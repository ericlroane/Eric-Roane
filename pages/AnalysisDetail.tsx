import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CallAnalysis } from '../types';
import FullScreenLoader from '../components/shared/FullScreenLoader';
import { AuthenticatedPage } from '../App';

interface AnalysisDetailProps {
    analysisId: string | null;
    setPage: (page: AuthenticatedPage) => void;
}

const AnalysisDetail: React.FC<AnalysisDetailProps> = ({ analysisId, setPage }) => {
    const [analysis, setAnalysis] = useState<CallAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!analysisId) {
            setError("No analysis selected.");
            setLoading(false);
            return;
        }

        const fetchAnalysis = async () => {
            setLoading(true);
            setError(null);
            try {
                const docRef = doc(db, 'call_analyses', analysisId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // FIX: Explicitly map properties to create a clean, serializable object.
                    // This prevents copying internal Firestore properties that cause circular reference errors.
                    const fetchedAnalysis: CallAnalysis = {
                        id: docSnap.id,
                        ownerId: data.ownerId,
                        callTitle: data.callTitle,
                        transcript: data.transcript,
                        analysisResult: data.analysisResult,
                        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
                    };
                    setAnalysis(fetchedAnalysis);
                } else {
                    setError("Analysis not found.");
                }
            } catch (err) {
                setError("Failed to fetch analysis data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [analysisId]);

    if (loading) {
        return <FullScreenLoader message="Loading analysis..." />;
    }

    if (error) {
        return <div className="text-center py-10 text-red-400">{error}</div>;
    }
    
    if (!analysis) {
        return <div className="text-center py-10 text-slate-400">Analysis data is not available.</div>;
    }

    const { transcript, analysisResult } = analysis;

    return (
        <div className="container mx-auto px-6 py-8">
            <button onClick={() => setPage('ai-coach')} className="mb-6 text-cyan-400 hover:text-cyan-300">&larr; Back to All Analyses</button>
            <h1 className="text-3xl font-bold text-white mb-4">{analysis.callTitle}</h1>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Transcript */}
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-2">Call Transcript</h3>
                    <textarea
                        readOnly
                        rows={20}
                        className="w-full bg-slate-900 text-slate-300 p-4 rounded-md border border-slate-600"
                        value={transcript}
                    />
                </div>

                {/* Analysis */}
                <div className="bg-slate-800 rounded-lg border border-slate-700">
                    <h3 className="text-2xl font-bold text-white mb-4 p-6 border-b border-slate-700">AI Analysis & Coaching</h3>
                     <div className="p-6 space-y-6">
                        {analysisResult.dealRiskAlert.isAtRisk && (
                            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                                <h4 className="font-bold text-lg text-red-400">🚨 Deal Risk Alert!</h4>
                                <p className="text-red-300"><span className="font-semibold">Reason:</span> {analysisResult.dealRiskAlert.reason}</p>
                                <p className="text-red-300 mt-1"><span className="font-semibold">Suggestion:</span> {analysisResult.dealRiskAlert.suggestion}</p>
                            </div>
                        )}
                        <div className="bg-slate-900/70 p-4 rounded-lg">
                            <h4 className="font-bold text-lg text-cyan-400">Performance Scorecard</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 text-sm">
                                <div><span className="font-semibold text-slate-400">Overall Score:</span> {analysisResult.performanceScorecard.overallScore}/10</div>
                                <div><span className="font-semibold text-slate-400">Talk/Listen Ratio:</span> {analysisResult.performanceScorecard.talkToListenRatio}</div>
                                <div><span className="font-semibold text-slate-400">Pace:</span> {analysisResult.performanceScorecard.pace}</div>
                                <div><span className="font-semibold text-slate-400">Filler Words:</span> {analysisResult.performanceScorecard.fillerWords}</div>
                                <div><span className="font-semibold text-slate-400">Appt. Attempts:</span> {analysisResult.performanceScorecard.appointmentAttempts}</div>
                            </div>
                            <p className="mt-3 text-sm"><span className="font-semibold text-slate-400">Feedback:</span> {analysisResult.performanceScorecard.feedback}</p>
                        </div>

                        <div className="bg-slate-900/70 p-4 rounded-lg">
                            <h4 className="font-bold text-lg text-cyan-400">Sentiment Analysis</h4>
                            <p className="text-sm"><span className="font-semibold text-slate-400">Overall:</span> {analysisResult.sentimentAnalysis.overallSentiment}</p>
                            <p className="text-sm mt-1"><span className="font-semibold text-slate-400">Key Shifts:</span></p>
                            <ul className="list-disc list-inside text-sm text-slate-300 pl-2">
                                {analysisResult.sentimentAnalysis.sentimentShifts.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <div className="bg-slate-900/70 p-4 rounded-lg">
                            <h4 className="font-bold text-lg text-cyan-400">Keywords & Topics</h4>
                            <p className="text-sm mt-1"><span className="font-semibold text-slate-400">Main Topics:</span> {analysisResult.keywordTopics.topics.join(', ')}</p>
                            <p className="text-sm mt-1"><span className="font-semibold text-slate-400">Competitors Mentioned:</span> {analysisResult.keywordTopics.competitorMentions.join(', ') || 'None'}</p>
                            <p className="text-sm mt-1"><span className="font-semibold text-slate-400">Financing Questions:</span> {analysisResult.keywordTopics.financingQuestions.length > 0 ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisDetail;