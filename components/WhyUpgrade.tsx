import React from 'react';

interface WhyUpgradeProps {
  setPage: (page: 'signup') => void;
}

const WhyUpgrade: React.FC<WhyUpgradeProps> = ({ setPage }) => {

  return (
    <section id="why-upgrade" className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Adapt or Be <span className="text-cyan-400">Left Behind</span>.</h2>
        <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
          A message from our founder: We built this in Augusta because we saw our local dealers being left behind by technology. This is your chance to leapfrog the competition. Your competition isn't waiting. Don't let legacy software hold you back.
        </p>
        <div className="mt-8">
          <button 
            onClick={() => setPage('signup')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
            Get Your AI Advantage
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyUpgrade;
