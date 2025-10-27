import React from 'react';
import { Sale } from '../../types';
import SaleCard from './SaleCard';

interface SaleListProps {
    sales: Sale[];
}

const SaleList: React.FC<SaleListProps> = ({ sales }) => {
    if (sales.length === 0) {
        return (
            <div className="text-center py-16 bg-slate-800 rounded-lg border-2 border-dashed border-slate-700">
                <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-xl font-medium text-white">No sales recorded</h3>
                <p className="mt-1 text-sm text-slate-400">Get started by logging your first vehicle sale.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sales.map((sale) => (
                <SaleCard key={sale.id} sale={sale} />
            ))}
        </div>
    );
};

export default SaleList;