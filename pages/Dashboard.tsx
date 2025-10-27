import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getCountFromServer } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { AuthenticatedPage } from '../App';

interface DashboardProps {
    setPage: (page: AuthenticatedPage) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setPage }) => {
    const { user, profile } = useAuth();
    const [inventoryCount, setInventoryCount] = useState<number | null>(null);
    const [customerCount, setCustomerCount] = useState<number | null>(null);
    const [salesData, setSalesData] = useState<{ totalRevenue: number; unitsSold: number } | null>(null);
    const [analysisCount, setAnalysisCount] = useState<number | null>(null);


    useEffect(() => {
        if (!user) return;

        const vehiclesQuery = query(collection(db, "vehicles"), where("ownerId", "==", user.uid));
        const customersQuery = query(collection(db, "customers"), where("ownerId", "==", user.uid));
        const salesQuery = query(collection(db, "sales"), where("ownerId", "==", user.uid));
        const analysesQuery = query(collection(db, "call_analyses"), where("ownerId", "==", user.uid));

        const unsubInventory = onSnapshot(vehiclesQuery, async () => {
             const snapshot = await getCountFromServer(vehiclesQuery);
             setInventoryCount(snapshot.data().count);
        });

        const unsubCustomers = onSnapshot(customersQuery, async () => {
            const snapshot = await getCountFromServer(customersQuery);
            setCustomerCount(snapshot.data().count);
       });

        const unsubSales = onSnapshot(salesQuery, (querySnapshot) => {
            let totalRevenue = 0;
            const unitsSold = querySnapshot.size;
            querySnapshot.forEach(doc => {
                // FIX: Directly access only the required property. This avoids creating an intermediate,
                // non-serializable object from doc.data() that could be picked up by dev tools
                // and cause a circular reference error.
                const price = doc.data().salePrice as number | undefined;
                if (price) {
                    totalRevenue += price;
                }
            });
            setSalesData({ totalRevenue, unitsSold });
        });
        
        const unsubAnalyses = onSnapshot(analysesQuery, async () => {
            const snapshot = await getCountFromServer(analysesQuery);
            setAnalysisCount(snapshot.data().count);
        });


        return () => {
            unsubInventory();
            unsubCustomers();
            unsubSales();
            unsubAnalyses();
        };

    }, [user]);

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-white">
                Welcome, <span className="text-cyan-400">{profile?.displayName}</span>!
            </h1>
            <p className="text-slate-400 mt-2">
                This is your AI Pro Cars command center.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {/* Inventory Summary */}
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h2 className="text-xl font-semibold text-white">Inventory Status</h2>
                    <div className="mt-4">
                        {inventoryCount === null ? (
                            <div className="h-16 bg-slate-700 rounded animate-pulse"></div>
                        ) : (
                            <>
                                <p className="text-4xl font-bold text-cyan-400">{inventoryCount}</p>
                                <p className="text-slate-400">Vehicles in Stock</p>
                            </>
                        )}
                        <button 
                            onClick={() => setPage('inventory')}
                            className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Manage Inventory
                        </button>
                    </div>
                </div>

                {/* CRM Summary */}
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                     <h2 className="text-xl font-semibold text-white">CRM Insights</h2>
                    <div className="mt-4">
                        {customerCount === null ? (
                             <div className="h-16 bg-slate-700 rounded animate-pulse"></div>
                        ) : (
                            <>
                                <p className="text-4xl font-bold text-cyan-400">{customerCount}</p>
                                <p className="text-slate-400">Total Customers & Leads</p>
                            </>
                        )}
                        <button
                            onClick={() => setPage('crm')}
                            className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Manage Customers
                        </button>
                    </div>
                </div>

                 <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h2 className="text-xl font-semibold text-white">Sales Analytics</h2>
                    <div className="mt-4">
                        {salesData === null ? (
                             <div className="h-16 bg-slate-700 rounded animate-pulse"></div>
                        ) : (
                             <div className="space-y-2">
                                <div>
                                    <p className="text-2xl font-bold text-cyan-400">${salesData.totalRevenue.toLocaleString()}</p>
                                    <p className="text-slate-400 text-sm">Total Revenue</p>
                                </div>
                                 <div>
                                    <p className="text-2xl font-bold text-cyan-400">{salesData.unitsSold}</p>
                                    <p className="text-slate-400 text-sm">Units Sold</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setPage('sales')}
                            className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            View All Sales
                        </button>
                    </div>
                </div>

                 <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h2 className="text-xl font-semibold text-white">AI Sales Coach</h2>
                    <div className="mt-4">
                        {analysisCount === null ? (
                             <div className="h-16 bg-slate-700 rounded animate-pulse"></div>
                        ) : (
                            <>
                                <p className="text-4xl font-bold text-cyan-400">{analysisCount}</p>
                                <p className="text-slate-400">Total Calls Analyzed</p>
                            </>
                        )}
                        <button
                            onClick={() => setPage('ai-coach')}
                            className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Go to AI Coach
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;