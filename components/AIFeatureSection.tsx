
import React from 'react';
import TranscriptAnalyzer from './shared/TranscriptAnalyzer';

const AIFeatureSection = () => {
    return (
        <section id="features" className="py-20 bg-gray-900/50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">This Is Your <span className="text-cyan-400">Unfair Advantage</span></h2>
                    <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">Paste a sales call transcript below and watch our AI Sales Coach provide instant, data-driven insights. No more guesswork.</p>
                </div>
                <TranscriptAnalyzer />
            </div>
        </section>
    );
};

export default AIFeatureSection;