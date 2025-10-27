import React from 'react';

interface PricingProps {
  setPage: (page: 'signup') => void;
}

const Check = () => <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>;

const Pricing: React.FC<PricingProps> = ({ setPage }) => {

    return (
        <section id="pricing" className="py-20 bg-slate-900">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Entry Point to the <span className="text-cyan-400">Future</span></h2>
                <p className="text-lg text-slate-400 mb-12">Frame pricing not as a cost, but as an investment in a competitive advantage.</p>
                <div className="flex flex-col lg:flex-row justify-center items-center gap-8 max-w-4xl mx-auto">
                    
                    {/* Basic Plan */}
                    <div className="w-full lg:w-1/2 bg-slate-800 rounded-lg p-8 border border-slate-700 transform hover:-translate-y-2 transition-transform duration-300">
                        <h3 className="text-2xl font-bold text-white">Basic</h3>
                        <p className="text-slate-400 mt-2">Digitize Your Dealership</p>
                        <div className="my-6">
                            <span className="text-5xl font-extrabold text-white">$29.99</span>
                            <span className="text-slate-400">/mo</span>
                        </div>
                        <ul className="space-y-4 text-left">
                            <li className="flex items-center space-x-3"><Check /><span>Core DMS</span></li>
                            <li className="flex items-center space-x-3"><Check /><span>Seamless QuickBooks Sync</span></li>
                            <li className="flex items-center space-x-3"><Check /><span>Inventory Management</span></li>
                             <li className="flex items-center space-x-3"><Check /><span>Sales Tracking</span></li>
                        </ul>
                        <button 
                            onClick={() => setPage('signup')}
                            className="mt-8 w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                            Choose Basic
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="w-full lg:w-1/2 bg-slate-800 rounded-lg p-8 border-2 border-cyan-500 relative transform hover:-translate-y-2 transition-transform duration-300 shadow-2xl shadow-cyan-500/20">
                        <div className="absolute top-0 right-0 -mt-4 mr-4">
                            <span className="bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</span>
                        </div>
                        <h3 className="text-2xl font-bold text-cyan-400">Pro</h3>
                        <p className="text-slate-400 mt-2">Dominate Your Market</p>
                        <div className="my-6">
                            <span className="text-5xl font-extrabold text-white">$75</span>
                            <span className="text-slate-400">/mo</span>
                        </div>
                        <ul className="space-y-4 text-left">
                            <li className="flex items-center space-x-3"><Check /><span>Everything in Basic, plus:</span></li>
                            <li className="flex items-center space-x-3 font-bold"><Check /><span>The AI Sales Coach</span></li>
                            <li className="flex items-center space-x-3"><Check /><span>Advanced CRM</span></li>
                            <li className="flex items-center space-x-3"><Check /><span>Deal Risk Alerts</span></li>
                            <li className="flex items-center space-x-3"><Check /><span>AI-Powered Role-Playing</span></li>
                        </ul>
                        <button 
                            onClick={() => setPage('signup')}
                            className="mt-8 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                            Start Dominating
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Pricing;
