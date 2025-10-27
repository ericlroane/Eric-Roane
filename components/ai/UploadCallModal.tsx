import React, { useState, FormEvent, useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { analyzeTranscript } from '../../services/geminiService';

interface UploadCallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UploadCallModal: React.FC<UploadCallModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    
    const [callTitle, setCallTitle] = useState('');
    const [transcript, setTranscript] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset form on open
            setCallTitle('');
            setTranscript('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) {
            addToast('You must be logged in.', 'error');
            return;
        }
        if (!callTitle || !transcript) {
            addToast('Please provide a title and transcript.', 'error');
            return;
        }

        setLoading(true);
        try {
            // 1. Get AI Analysis
            const analysisResult = await analyzeTranscript(transcript);

            // 2. Save to Firestore
            await addDoc(collection(db, 'call_analyses'), {
                ownerId: user.uid,
                callTitle,
                transcript,
                analysisResult,
                createdAt: serverTimestamp(),
            });
            addToast(`Analysis for "${callTitle}" saved successfully!`, 'success');
            onClose();
        } catch (error: any) {
            console.error("Error analyzing and saving call: ", error);
            addToast(`Error: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 w-full max-w-2xl rounded-xl border border-slate-700 shadow-2xl shadow-cyan-500/10" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-white">Upload & Analyze Call</h2>
                        <p className="text-slate-400 mt-1">Provide a title and paste the transcript to get AI-powered insights.</p>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="callTitle">Call Title</label>
                                <input id="callTitle" type="text" value={callTitle} onChange={e => setCallTitle(e.target.value)} placeholder="e.g., John Doe - 2023 Explorer Inquiry" required className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="transcript">Transcript</label>
                                <textarea id="transcript" rows={10} value={transcript} onChange={e => setTranscript(e.target.value)} required className="w-full bg-slate-900 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500" placeholder="Paste the full call transcript here..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-700/50 px-6 py-4 flex justify-end items-center space-x-3 rounded-b-xl">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-300 hover:bg-slate-600 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center">
                             {loading && (
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {loading ? 'Analyzing...' : 'Analyze & Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadCallModal;
