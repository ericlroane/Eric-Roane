import React from 'react';
import { Customer } from '../../types';
import CustomerCard from './CustomerCard';

interface CustomerListProps {
    customers: Customer[];
    onDelete: (customerId: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers, onDelete }) => {
    if (customers.length === 0) {
        return (
            <div className="text-center py-16 bg-slate-800 rounded-lg border-2 border-dashed border-slate-700">
                <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197" />
                </svg>
                <h3 className="mt-2 text-xl font-medium text-white">No customers yet</h3>
                <p className="mt-1 text-sm text-slate-400">Get started by adding your first customer or lead.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {customers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} onDelete={onDelete} />
            ))}
        </div>
    );
};

export default CustomerList;