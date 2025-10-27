import React, { useState, FormEvent, useEffect } from 'react';
import { addDoc, collection, serverTimestamp, query, where, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Vehicle, Customer } from '../../types';

interface AddSaleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddSaleModal: React.FC<AddSaleModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [salePrice, setSalePrice] = useState<number | ''>('');
    const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !user) return;

        const fetchData = async () => {
            // Fetch available vehicles
            const vehiclesQuery = query(collection(db, "vehicles"), where("ownerId", "==", user.uid), where("status", "==", "Available"));
            const vehicleSnapshot = await getDocs(vehiclesQuery);
            const vehicleData = vehicleSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ownerId: data.ownerId,
                    make: data.make,
                    model: data.model,
                    year: data.year,
                    vin: data.vin,
                    price: data.price,
                    status: data.status,
                    createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
                } as Vehicle;
            });
            setVehicles(vehicleData);

            // Fetch customers
            const customersQuery = query(collection(db, "customers"), where("ownerId", "==", user.uid));
            const customerSnapshot = await getDocs(customersQuery);
            const customerData = customerSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ownerId: data.ownerId,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    status: data.status,
                    notes: data.notes,
                    createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
                } as Customer;
            });
            setCustomers(customerData);
        };

        fetchData();

        // Reset form
        setSelectedVehicleId('');
        setSelectedCustomerId('');
        setSalePrice('');
        setSaleDate(new Date().toISOString().split('T')[0]);
        setNotes('');
        
    }, [isOpen, user]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user || !selectedVehicleId || !selectedCustomerId || !salePrice) {
            addToast('Please select a vehicle, customer, and enter a sale price.', 'error');
            return;
        }
        setLoading(true);

        const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
        const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

        if (!selectedVehicle || !selectedCustomer) {
            addToast('Selected vehicle or customer not found.', 'error');
            setLoading(false);
            return;
        }

        try {
            const batch = writeBatch(db);

            // 1. Create new sale document
            const saleRef = doc(collection(db, 'sales'));
            batch.set(saleRef, {
                ownerId: user.uid,
                vehicleId: selectedVehicleId,
                customerId: selectedCustomerId,
                salePrice: Number(salePrice),
                saleDate: new Date(saleDate),
                notes,
                createdAt: serverTimestamp(),
                vehicleInfo: {
                    make: selectedVehicle.make,
                    model: selectedVehicle.model,
                    year: selectedVehicle.year,
                },
                customerInfo: {
                    name: selectedCustomer.name,
                },
            });

            // 2. Update vehicle status
            const vehicleRef = doc(db, "vehicles", selectedVehicleId);
            batch.update(vehicleRef, { status: "Sold" });

            // 3. Update customer status
            const customerRef = doc(db, "customers", selectedCustomerId);
            batch.update(customerRef, { status: "Sold" });

            await batch.commit();

            addToast('Sale recorded successfully!', 'success');
            onClose();
        } catch (error: any) {
            console.error("Error recording sale: ", error);
            addToast(`Error: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 w-full max-w-lg rounded-xl border border-slate-700 shadow-2xl shadow-cyan-500/10" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-white">Record a New Sale</h2>
                        <p className="text-slate-400 mt-1">Select a vehicle and customer to log the transaction.</p>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="vehicle">Vehicle</label>
                                <select id="vehicle" value={selectedVehicleId} onChange={e => setSelectedVehicleId(e.target.value)} required className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500">
                                    <option value="" disabled>Select an available vehicle...</option>
                                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} - ${v.price.toLocaleString()}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="customer">Customer</label>
                                <select id="customer" value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} required className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500">
                                    <option value="" disabled>Select a customer...</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.email}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="salePrice">Final Sale Price ($)</label>
                                    <input id="salePrice" type="number" value={salePrice} onChange={e => setSalePrice(Number(e.target.value) || '')} required className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="saleDate">Sale Date</label>
                                    <input id="saleDate" type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)} required className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="notes">Sale Notes (Optional)</label>
                                <textarea id="notes" rows={2} value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-700/50 px-6 py-4 flex justify-end items-center space-x-3 rounded-b-xl">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-300 hover:bg-slate-600 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                            {loading ? 'Saving...' : 'Record Sale'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSaleModal;