import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Sale } from '../types';
import SaleList from '../components/sales/SaleList';
import AddSaleModal from '../components/sales/AddSaleModal';

const Sales: React.FC = () => {
    const { user } = useAuth();
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        const salesRef = collection(db, 'sales');
        const q = query(salesRef, where('ownerId', '==', user.uid), orderBy('saleDate', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const salesData: Sale[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // FIX: Explicitly map properties instead of using the spread operator (...data).
                // This creates a clean, plain JavaScript object and avoids copying any internal,
                // non-serializable properties from the Firestore data object, which was causing
                // the "circular structure to JSON" error.
                salesData.push({
                    id: doc.id,
                    ownerId: data.ownerId,
                    vehicleId: data.vehicleId,
                    customerId: data.customerId,
                    salePrice: data.salePrice,
                    notes: data.notes,
                    vehicleInfo: data.vehicleInfo,
                    customerInfo: data.customerInfo,
                    saleDate: data.saleDate?.toDate().toISOString() || new Date().toISOString(),
                    createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
                });
            });
            setSales(salesData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching sales:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">
                    Sales History
                </h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                    + Add Sale
                </button>
            </div>
            
            {loading ? (
                <div className="text-center text-slate-400 py-10">Loading sales history...</div>
            ) : (
                <SaleList sales={sales} />
            )}

            <AddSaleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Sales;