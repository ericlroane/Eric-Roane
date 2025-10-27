import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Vehicle } from '../types';
import VehicleList from '../components/inventory/VehicleList';
import AddVehicleModal from '../components/inventory/AddVehicleModal';
import ConfirmationModal from '../components/shared/ConfirmationModal';

const Inventory: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // State for delete confirmation
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        const vehiclesRef = collection(db, 'vehicles');
        const q = query(vehiclesRef, where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const vehicleData: Vehicle[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // FIX: Explicitly map properties to create a clean, serializable object.
                // This prevents copying internal Firestore properties that cause circular reference errors.
                vehicleData.push({
                    id: doc.id,
                    ownerId: data.ownerId,
                    make: data.make,
                    model: data.model,
                    year: data.year,
                    vin: data.vin,
                    price: data.price,
                    status: data.status,
                    createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
                });
            });
            setVehicles(vehicleData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching inventory:", error);
            addToast(`Error fetching inventory: ${error.message}`, 'error');
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleDeleteRequest = (vehicleId: string) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            setVehicleToDelete(vehicle);
            setIsConfirmModalOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (!vehicleToDelete) return;
        setDeleteLoading(true);
        try {
            await deleteDoc(doc(db, 'vehicles', vehicleToDelete.id));
            addToast(`Vehicle ${vehicleToDelete.year} ${vehicleToDelete.make} ${vehicleToDelete.model} deleted.`, 'success');
            setIsConfirmModalOpen(false);
            setVehicleToDelete(null);
        } catch (error: any) {
            addToast(`Error deleting vehicle: ${error.message}`, 'error');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">
                    Vehicle Inventory
                </h1>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                    + Add Vehicle
                </button>
            </div>
            
            {loading ? (
                <div className="text-center text-slate-400 py-10">Loading inventory...</div>
            ) : (
                <VehicleList vehicles={vehicles} onDelete={handleDeleteRequest} />
            )}

            <AddVehicleModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
            
            {vehicleToDelete && (
                 <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Vehicle"
                    message={`Are you sure you want to permanently delete the ${vehicleToDelete.year} ${vehicleToDelete.make} ${vehicleToDelete.model}? This action cannot be undone.`}
                    loading={deleteLoading}
                />
            )}
        </div>
    );
};

export default Inventory;