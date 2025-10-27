import React from 'react';
import { Vehicle } from '../../types';
import VehicleCard from './VehicleCard';

interface VehicleListProps {
    vehicles: Vehicle[];
    onDelete: (vehicleId: string) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onDelete }) => {
    if (vehicles.length === 0) {
        return (
            <div className="text-center py-16 bg-slate-800 rounded-lg border-2 border-dashed border-slate-700">
                <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-xl font-medium text-white">No vehicles in inventory</h3>
                <p className="mt-1 text-sm text-slate-400">Get started by adding your first vehicle.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} onDelete={onDelete} />
            ))}
        </div>
    );
};

export default VehicleList;