import React from 'react';
import { CallAnalysis } from '../../types';

interface AnalysisCardProps {
    analysis: CallAnalysis;
    onSelectAnalysis: (analysisId: string) => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, onSelectAnalysis }) => {
    const { callTitle, createdAt, analysisResult } = analysis;
    const { performanceScorecard, dealRiskAlert } = analysisResult;

    return (
        <div 
            className="bg-slate-800 rounded-lg border border-slate-700 p-4 transform hover:-translate-y-1 transition-transform duration-300 shadow-lg hover:shadow-cyan-500/10 cursor-pointer"
            onClick={() => onSelectAnalysis(analysis.id)}
        >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                    <h3 className="font-bold text-white text-lg">{callTitle}</h3>
                    <p className="text-sm text-slate-400">Analyzed on {new Date(createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                    {dealRiskAlert.isAtRisk && (
                         <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400">
                            🚨 Deal at Risk
                        </span>
                    )}
                    <div className="text-center">
                        <p className="text-sm text-slate-400">Score</p>
                        <p className="font-bold text-cyan-400 text-xl">{performanceScorecard.overallScore}/10</p>
                    </div>
                     <button className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
                        View Details &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalysisCard;
