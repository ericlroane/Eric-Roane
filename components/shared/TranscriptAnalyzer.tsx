
import React, { useState } from 'react';
import { analyzeTranscript } from '../../services/geminiService';
import type { AnalysisResult } from '../../types';

const defaultTranscript = `Salesperson: Hi, thank you for calling Augusta Motors, this is Mike speaking. How can I help you?
Customer: Hi Mike, I saw a 2022 Ford Explorer on your website. Is it still available?
Salesperson: The blue one? Yes, it is! It's a fantastic vehicle, great condition. Are you interested in coming down for a test drive?
Customer: I might be. What's the price on that one?
Salesperson: We have it listed at $38,500. It's very competitively priced for the market.
Customer: Hmm, that's a bit higher than I was hoping. I saw a similar one over at Gordon Highway Cars for a little less.
Salesperson: I understand. Well, our vehicles go through a 150-point inspection and come with a 6-month warranty, which adds a lot of value. We also offer great financing options.
Customer: Okay... what kind of interest rates are you seeing for someone with good credit?
Salesperson: We work with over 20 lenders to find the best rates. It really depends on the application, but we can definitely get you a great number. If you come in, we can run the numbers.
Customer: Um, I'm not sure if I have time today. I need to think about it.
Salesperson: Okay, well, the car is getting a lot of attention. I'd hate for you to miss out.
Customer: I appreciate that. I'll... I'll call you back if I decide to come in. Thanks.
Salesperson: Alright, thank you for your call.`;

const TranscriptAnalyzer = () => {
    const [transcript, setTranscript] = useState<string>(defaultTranscript);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!transcript.trim()) {
            setError("Transcript cannot be empty.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await analyzeTranscript(transcript);
            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <label htmlFor="transcript" className="block text-lg font-semibold text-white mb-2">Sales Call Transcript</label>
                <textarea
                    id="transcript"
                    rows={15}
                    className="w-full bg-slate-900 text-slate-300 p-4 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Paste your sales call transcript here..."
                />
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </>
                    ) : "Analyze with AI Coach"}
                </button>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 min-h-[500px]">
                <h3 className="text-2xl font-bold text-white mb-4">AI Analysis & Coaching</h3>
                {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-md">{error}</div>}
                
                {!isLoading && !analysis && !error && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center">
                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.707.707M12 21v-1m-6.364-1.636l.707-.707"></path></svg>
                        <p className="text-lg">Your analysis results will appear here.</p>
                    </div>
                )}

                {analysis && (
                    <div className="space-y-6">
                        {analysis.dealRiskAlert.isAtRisk && (
                            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                                <h4 className="font-bold text-lg text-red-400">🚨 Deal Risk Alert!</h4>
                                <p className="text-red-300"><span className="font-semibold">Reason:</span> {analysis.dealRiskAlert.reason}</p>
                                <p className="text-red-300 mt-1"><span className="font-semibold">Suggestion:</span> {analysis.dealRiskAlert.suggestion}</p>
                            </div>
                        )}
                        <div className="bg-slate-900/70 p-4 rounded-lg">
                            <h4 className="font-bold text-lg text-cyan-400">Performance Scorecard</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 text-sm">
                                <div><span className="font-semibold text-slate-400">Overall Score:</span> {analysis.performanceScorecard.overallScore}/10</div>
                                <div><span className="font-semibold text-slate-400">Talk/Listen Ratio:</span> {analysis.performanceScorecard.talkToListenRatio}</div>
                                <div><span className="font-semibold text-slate-400">Pace:</span> {analysis.performanceScorecard.pace}</div>
                                <div><span className="font-semibold text-slate-400">Filler Words:</span> {analysis.performanceScorecard.fillerWords}</div>
                                <div><span className="font-semibold text-slate-400">Appt. Attempts:</span> {analysis.performanceScorecard.appointmentAttempts}</div>
                            </div>
                            <p className="mt-3 text-sm"><span className="font-semibold text-slate-400">Feedback:</span> {analysis.performanceScorecard.feedback}</p>
                        </div>

                        <div className="bg-slate-900/70 p-4 rounded-lg">
                            <h4 className="font-bold text-lg text-cyan-400">Sentiment Analysis</h4>
                            <p className="text-sm"><span className="font-semibold text-slate-400">Overall:</span> {analysis.sentimentAnalysis.overallSentiment}</p>
                            <p className="text-sm mt-1"><span className="font-semibold text-slate-400">Key Shifts:</span></p>
                            <ul className="list-disc list-inside text-sm text-slate-300 pl-2">
                                {analysis.sentimentAnalysis.sentimentShifts.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <div className="bg-slate-900/70 p-4 rounded-lg">
                            <h4 className="font-bold text-lg text-cyan-400">Keywords & Topics</h4>
                            <p className="text-sm mt-1"><span className="font-semibold text-slate-400">Main Topics:</span> {analysis.keywordTopics.topics.join(', ')}</p>
                            <p className="text-sm mt-1"><span className="font-semibold text-slate-400">Competitors Mentioned:</span> {analysis.keywordTopics.competitorMentions.join(', ') || 'None'}</p>
                            <p className="text-sm mt-1"><span className="font-semibold text-slate-400">Financing Questions:</span> {analysis.keywordTopics.financingQuestions.length > 0 ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TranscriptAnalyzer;
