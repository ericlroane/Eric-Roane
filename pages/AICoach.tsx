import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { CallAnalysis } from '../types';
import UploadCallModal from '../components/ai/UploadCallModal';
import AnalysisList from '../components/ai/AnalysisList';

interface AICoachProps {
    onSelectAnalysis: (analysisId: string) => void;
}

const AICoach: React.FC<AICoachProps> = ({ onSelectAnalysis }) => {
    const { user } = useAuth();
    const [analyses, setAnalyses] = useState<CallAnalysis[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        const analysesRef = collection(db, 'call_analyses');
        const q = query(analysesRef, where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const analysisData: CallAnalysis[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // FIX: Explicitly map properties instead of using the spread operator (...data).
                // This creates a clean, plain JavaScript object and avoids copying any internal,
                // non-serializable properties from the Firestore data object, which was causing
                // the "circular structure to JSON" error.
                analysisData.push({
                    id: doc.id,
                    ownerId: data.ownerId,
                    callTitle: data.callTitle,
                    transcript: data.transcript,
                    analysisResult: data.analysisResult,
                    createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
                });
            });
            setAnalyses(analysisData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching call analyses:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">
                    AI Sales Coach
                </h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                    + Upload & Analyze Call
                </button>
            </div>
            
            {loading ? (
                <div className="text-center text-slate-400 py-10">Loading analyses...</div>
            ) : (
                <AnalysisList analyses={analyses} onSelectAnalysis={onSelectAnalysis} />
            )}

            <UploadCallModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default AICoach;