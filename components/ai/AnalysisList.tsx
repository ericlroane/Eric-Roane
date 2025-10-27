import React from 'react';
import { CallAnalysis } from '../../types';
import AnalysisCard from './AnalysisCard';

interface AnalysisListProps {
    analyses: CallAnalysis[];
    onSelectAnalysis: (analysisId: string) => void;
}

const AnalysisList: React.FC<AnalysisListProps> = ({ analyses, onSelectAnalysis }) => {
    if (analyses.length === 0) {
        return (
            <div className="text-center py-16 bg-slate-800 rounded-lg border-2 border-dashed border-slate-700">
                 <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.707.707M12 21v-1m-6.364-1.636l.707-.707" />
                </svg>
                <h3 className="mt-2 text-xl font-medium text-white">No calls analyzed yet</h3>
                <p className="mt-1 text-sm text-slate-400">Get started by uploading your first sales call transcript.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {analyses.map((analysis) => (
                <AnalysisCard key={analysis.id} analysis={analysis} onSelectAnalysis={onSelectAnalysis} />
            ))}
        </div>
    );
};

export default AnalysisList;
