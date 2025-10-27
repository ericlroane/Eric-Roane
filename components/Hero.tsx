import React from 'react';

interface HeroProps {
  setPage: (page: 'signup') => void;
}

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-24 md:w-24 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.04.4 2.01 1.09 2.75" />
      <path d="M12 2a4.5 4.5 0 0 1 4.5 4.5c0 1.04-.4 2.01-1.09 2.75" />
      <path d="M12 13.5a4.5 4.5 0 0 1-4.5-4.5" />
      <path d="M12 13.5a4.5 4.5 0 0 0 4.5-4.5" />
      <path d="M8.51 16.25a4.5 4.5 0 0 0-1.42 3.25" />
      <path d="M15.49 16.25a4.5 4.5 0 0 1 1.42 3.25" />
      <path d="M4.5 13.5a4.5 4.5 0 0 0 0 9" />
      <path d="M19.5 13.5a4.5 4.5 0 0 1 0 9" />
      <path d="M12 13.5a4.5 4.5 0 0 0-4.5 4.5c0 1.04.4 2.01 1.09 2.75" />
      <path d="M12 13.5a4.5 4.5 0 0 1 4.5 4.5c0 1.04-.4 2.01-1.09 2.75" />
      <path d="M12 22.5a4.5 4.5 0 0 0 0-9" />
    </svg>
);


const Hero: React.FC<HeroProps> = ({ setPage }) => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <section className="relative py-20 md:py-32 bg-slate-900">
        <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                Your Competitors Are Still Using <span className="text-cyan-400">Spreadsheets</span>.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                Welcome to the AI Revolution. Be the first dealership in Augusta to sell with an AI co-pilot. Plans start at just $29.99.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button 
                    onClick={() => setPage('signup')}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 w-full sm:w-auto">
                    Request a Demo
                </button>
                <button 
                    onClick={() => scrollToSection('pricing')}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors w-full sm:w-auto">
                    View Pricing
                </button>
            </div>
            <div className="mt-20 flex justify-center items-center space-x-4 animate-pulse">
                <p className="text-slate-400 text-2xl font-thin">Data</p>
                <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                <BrainIcon />
                <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                <p className="text-cyan-400 text-2xl font-semibold">Sales</p>
            </div>
        </div>
    </section>
  );
};

export default Hero;
