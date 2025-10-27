import React, { useState } from 'react';

interface HeaderProps {
  setPage: (page: 'login' | 'signup') => void;
}


const Header: React.FC<HeaderProps> = ({ setPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3M5.636 5.636l1.414 1.414m10.304 10.304l-1.414-1.414M12 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="text-2xl font-bold text-white">AI Pro Cars</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-gray-300">
          <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="hover:text-cyan-400 transition-colors">The AI Advantage</a>
          <a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="hover:text-cyan-400 transition-colors">Pricing</a>
          <button onClick={() => setPage('login')} className="hover:text-cyan-400 transition-colors">Login</button>
        </div>
        <button 
            onClick={() => setPage('signup')}
            className="hidden md:block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105">
          Get Your AI Advantage
        </button>
        <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {isMenuOpen ? (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
            </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-slate-800`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
            <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="block text-gray-300 hover:text-cyan-400 rounded-md py-2 text-base font-medium">The AI Advantage</a>
            <a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="block text-gray-300 hover:text-cyan-400 rounded-md py-2 text-base font-medium">Pricing</a>
            <button onClick={() => { setPage('login'); setIsMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-cyan-400 rounded-md p-2 text-base font-medium">Login</button>
            <button
                onClick={() => { setPage('signup'); setIsMenuOpen(false); }}
                className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105">
                Get Your AI Advantage
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
