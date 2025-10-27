import React, { useState, FormEvent, useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Customer } from '../../types';

interface AddCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState<Customer['status']>('New Lead');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset form on open
            setName('');
            setEmail('');
            setPhone('');
            setNotes('');
            setStatus('New Lead');
        }
    }, [isOpen]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) {
            addToast('You must be logged in.', 'error');
            return;
        }
        if (!name || !email || !phone) {
            addToast('Please fill out name, email, and phone.', 'error');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'customers'), {
                ownerId: user.uid,
                name,
                email,
                phone,
                status,
                notes,
                createdAt: serverTimestamp(),
            });
            addToast(`Customer "${name}" added successfully!`, 'success');
            onClose();
        } catch (error: any) {
            console.error("Error adding customer: ", error);
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
                        <h2 className="text-2xl font-bold text-white">Add New Customer / Lead</h2>
                        <p className="text-slate-400 mt-1">Enter the details for the new customer.</p>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="name">Full Name</label>
                                <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="email">Email</label>
                                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="phone">Phone</label>
                                <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="status">Status</label>
                                <select id="status" value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500">
                                    <option>New Lead</option>
                                    <option>Contacted</option>
                                    <option>Appointment Set</option>
                                    <option>Sold</option>
                                    <option>Lost</option>
                                </select>
                            </div>
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="notes">Notes</label>
                                <textarea id="notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-700/50 px-6 py-4 flex justify-end items-center space-x-3 rounded-b-xl">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-300 hover:bg-slate-600 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                            {loading ? 'Saving...' : 'Add Customer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerModal;