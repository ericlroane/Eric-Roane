import React from 'react';
import { Customer } from '../../types';

interface CustomerCardProps {
    customer: Customer;
    onDelete: (customerId: string) => void;
}

const statusStyles = {
    'New Lead': 'bg-blue-500/20 text-blue-400',
    'Contacted': 'bg-purple-500/20 text-purple-400',
    'Appointment Set': 'bg-yellow-500/20 text-yellow-400',
    'Sold': 'bg-green-500/20 text-green-400',
    'Lost': 'bg-red-500/20 text-red-400',
};

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onDelete }) => {
    return (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 transform hover:-translate-y-1 transition-transform duration-300 shadow-lg hover:shadow-cyan-500/20 flex flex-col h-full">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white flex-1 pr-2">{customer.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[customer.status]} flex-shrink-0`}>
                        {customer.status}
                    </span>
                </div>
                <div className="mt-2 text-sm text-slate-400 space-y-1">
                    <p><strong>Email:</strong> {customer.email}</p>
                    <p><strong>Phone:</strong> {customer.phone}</p>
                </div>
                {customer.notes && (
                    <div className="mt-4 text-sm bg-slate-700/50 p-2 rounded-md">
                         <p className="text-slate-300 italic">"{customer.notes}"</p>
                    </div>
                )}
            </div>
            <div className="flex justify-end mt-4">
                 <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(customer.id); }}
                    className="p-2 rounded-full text-slate-400 hover:bg-red-900/50 hover:text-red-400 transition-colors"
                    aria-label="Delete customer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        </div>
    );
};

export default CustomerCard;