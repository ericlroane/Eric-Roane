import React from 'react';
import { Sale } from '../../types';

interface SaleCardProps {
    sale: Sale;
}

const SaleCard: React.FC<SaleCardProps> = ({ sale }) => {
    return (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 transform hover:-translate-y-1 transition-transform duration-300 shadow-lg hover:shadow-cyan-500/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                    <p className="text-sm text-slate-400">Vehicle</p>
                    <p className="font-bold text-white">{sale.vehicleInfo.year} {sale.vehicleInfo.make} {sale.vehicleInfo.model}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-400">Customer</p>
                    <p className="font-semibold text-white">{sale.customerInfo.name}</p>
                </div>
                 <div>
                    <p className="text-sm text-slate-400">Sale Date</p>
                    <p className="text-white">{new Date(sale.saleDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                     <p className="text-sm text-slate-400">Sale Price</p>
                    <p className="text-2xl font-extrabold text-cyan-400">
                        ${sale.salePrice.toLocaleString()}
                    </p>
                </div>
            </div>
            {sale.notes && (
                 <div className="mt-3 pt-3 border-t border-slate-700 text-sm">
                     <p className="text-slate-300 italic">"{sale.notes}"</p>
                </div>
            )}
        </div>
    );
};

export default SaleCard;