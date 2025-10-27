import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Customer } from '../types';
import CustomerList from '../components/crm/CustomerList';
import AddCustomerModal from '../components/crm/AddCustomerModal';
import ConfirmationModal from '../components/shared/ConfirmationModal';

const CRM: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // State for delete confirmation
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        const customersRef = collection(db, 'customers');
        const q = query(customersRef, where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const customerData: Customer[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // FIX: Explicitly map properties to create a clean, serializable object.
                // This prevents copying internal Firestore properties that cause circular reference errors.
                customerData.push({
                    id: doc.id,
                    ownerId: data.ownerId,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    status: data.status,
                    notes: data.notes,
                    createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
                });
            });
            setCustomers(customerData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching customers:", error);
            addToast(`Error fetching customers: ${error.message}`, 'error');
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleDeleteRequest = (customerId: string) => {
        const customer = customers.find(c => c.id === customerId);
        if (customer) {
            setCustomerToDelete(customer);
            setIsConfirmModalOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (!customerToDelete) return;
        setDeleteLoading(true);
        try {
            await deleteDoc(doc(db, 'customers', customerToDelete.id));
            addToast(`Customer "${customerToDelete.name}" deleted.`, 'success');
            setIsConfirmModalOpen(false);
            setCustomerToDelete(null);
        } catch (error: any) {
            addToast(`Error deleting customer: ${error.message}`, 'error');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">
                    Customer Management
                </h1>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                    + Add Customer
                </button>
            </div>
            
            {loading ? (
                <div className="text-center text-slate-400 py-10">Loading customers...</div>
            ) : (
                <CustomerList customers={customers} onDelete={handleDeleteRequest} />
            )}

            <AddCustomerModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            {customerToDelete && (
                 <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Customer"
                    message={`Are you sure you want to permanently delete the customer "${customerToDelete.name}"? This action cannot be undone.`}
                    loading={deleteLoading}
                />
            )}
        </div>
    );
};

export default CRM;