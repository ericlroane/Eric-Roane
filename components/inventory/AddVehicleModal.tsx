import React, { useState, FormEvent, useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState<number | ''>(new Date().getFullYear());
    const [vin, setVin] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [status, setStatus] = useState<'Available' | 'Sold' | 'Pending'>('Available');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset form on open
            setMake('');
            setModel('');
            setYear(new Date().getFullYear());
            setVin('');
            setPrice('');
            setStatus('Available');
        }
    }, [isOpen]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) {
            addToast('You must be logged in to add a vehicle.', 'error');
            return;
        }
        if (!make || !model || !year || !vin || !price) {
            addToast('Please fill out all required fields.', 'error');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'vehicles'), {
                ownerId: user.uid,
                make,
                model,
                year: Number(year),
                vin: vin.toUpperCase(),
                price: Number(price),
                status,
                createdAt: serverTimestamp(),
            });
            addToast(`${year} ${make} ${model} added successfully!`, 'success');
            onClose();
        } catch (error: any) {
            console.error("Error adding document: ", error);
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
                        <h2 className="text-2xl font-bold text-white">Add New Vehicle</h2>
                        <p className="text-slate-400 mt-1">Enter the details for the new inventory item.</p>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="make">Make</label>
                                <input id="make" type="text" value={make} onChange={e => setMake(e.target.value)} required className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="model">Model</label>
                                <input id="model" type="text" value={model} onChange={e => setModel(e.target.value)} required className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="year">Year</label>
                                <input id="year" type="number" value={year} onChange={e => setYear(parseInt(e.target.value) || '')} required className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="price">Price ($)</label>
                                <input id="price" type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value) || '')} required className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="vin">VIN</label>
                                <input id="vin" type="text" value={vin} onChange={e => setVin(e.target.value)} required className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="status">Status</label>
                                <select id="status" value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500">
                                    <option>Available</option>
                                    <option>Pending</option>
                                    <option>Sold</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-700/50 px-6 py-4 flex justify-end items-center space-x-3 rounded-b-xl">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-300 hover:bg-slate-600 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                            {loading ? 'Saving...' : 'Add Vehicle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVehicleModal;