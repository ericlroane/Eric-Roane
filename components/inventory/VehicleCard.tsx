import React from 'react';
import { Vehicle } from '../../types';

interface VehicleCardProps {
    vehicle: Vehicle;
    onDelete: (vehicleId: string) => void;
}

const statusStyles = {
    Available: 'bg-green-500/20 text-green-400',
    Pending: 'bg-yellow-500/20 text-yellow-400',
    Sold: 'bg-red-500/20 text-red-400',
};

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onDelete }) => {
    return (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 shadow-lg hover:shadow-cyan-500/20 flex flex-col">
            <div className="bg-slate-700 h-40 flex items-center justify-center text-slate-500">
                {/* Placeholder for image */}
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white flex-1 pr-2">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[vehicle.status]} flex-shrink-0`}>
                        {vehicle.status}
                    </span>
                </div>
                <p className="text-sm text-slate-400 mt-1">VIN: {vehicle.vin}</p>
                <div className="flex-grow"></div>
                <div className="flex justify-between items-end mt-4">
                     <p className="text-2xl font-extrabold text-cyan-400">
                        ${vehicle.price.toLocaleString()}
                    </p>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(vehicle.id); }}
                        className="p-2 rounded-full text-slate-400 hover:bg-red-900/50 hover:text-red-400 transition-colors"
                        aria-label="Delete vehicle"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;