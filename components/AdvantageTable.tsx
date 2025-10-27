
import React from 'react';

const CheckIcon = () => (
    <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const CrossIcon = () => (
    <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AdvantageTable = () => {
    const advantages = [
        {
            capability: 'Performance Feedback',
            oldWay: 'Subjective, inconsistent, and delayed. Relies on a manager having time to listen to a few random calls.',
            aiWay: 'Objective, instant, and comprehensive. AI analyzes 100% of sales calls, providing data-driven feedback on every interaction.',
        },
        {
            capability: 'Sales Strategy',
            oldWay: 'Based on "gut feeling" and anecdotal evidence. Winning tactics are hard to identify or replicate.',
            aiWay: 'Data-driven and predictive. AI identifies which talking points, questions, and behaviors actually lead to closed deals.',
        },
        {
            capability: 'Onboarding & Training',
            oldWay: 'Slow and resource-intensive. New reps learn by trial and error, costing the dealership lost opportunities.',
            aiWay: 'Fast, scalable, and risk-free. New reps practice with an AI role-player 24/7, getting up to speed in days, not months.',
        },
        {
            capability: 'Deal Management',
            oldWay: 'Reactive. Deals go cold because risks aren\'t identified until it\'s too late.',
            aiWay: 'Proactive and intelligent. The AI provides real-time "Deal Risk Alerts," flagging at-risk opportunities so you can intervene.',
        },
        {
            capability: 'Live Call Support',
            oldWay: 'None. Salespeople are on their own to handle tough objections and questions.',
            aiWay: 'Real-time assistance. The AI provides live, on-screen prompts to help reps navigate difficult conversations.',
        },
    ];

    return (
        <section className="py-20 bg-slate-900">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">Stop Guessing. <span className="text-cyan-400">Start Winning.</span></h2>
                <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">The AI Sales Coach delivers a decisive edge over outdated methods. Here's how.</p>
                <div className="overflow-x-auto">
                    <div className="min-w-full bg-slate-800 rounded-lg shadow-lg border border-slate-700">
                        <div className="grid grid-cols-3 font-bold text-lg text-left text-white border-b border-slate-700">
                            <div className="p-4">Capability</div>
                            <div className="p-4">The Old Way</div>
                            <div className="p-4 bg-slate-900/50 rounded-tr-lg">The AI Pro Cars Way</div>
                        </div>
                        {advantages.map((item, index) => (
                            <div key={index} className="grid grid-cols-3 text-left border-t border-slate-700">
                                <div className="p-4 font-semibold text-slate-200">{item.capability}</div>
                                <div className="p-4 text-slate-400 flex items-start gap-2"><CrossIcon /> {item.oldWay}</div>
                                <div className="p-4 text-slate-200 flex items-start gap-2 bg-slate-900/50"><CheckIcon /> {item.aiWay}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdvantageTable;

