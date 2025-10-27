
import React from 'react';

const Footer = () => {
    return (
        <footer id="footer" className="bg-slate-900 border-t border-slate-800">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold text-white">AI Pro Cars</h3>
                        <p className="text-slate-400">The Future of Dealership Management</p>
                        <p className="text-slate-500 text-sm">Augusta, GA</p>
                    </div>
                    <div className="flex space-x-6 text-slate-300 mb-4 md:mb-0">
                        <a href="#features" className="hover:text-cyan-400">The AI Advantage</a>
                        <a href="#pricing" className="hover:text-cyan-400">Pricing</a>
                        <a href="#why-upgrade" className="hover:text-cyan-400">Why Upgrade?</a>
                    </div>
                    <div className="text-slate-500 text-sm">
                        <p>&copy; 2025 Vibe Coding of Augusta. All Rights Reserved.</p>
                        <a href="#" className="hover:text-cyan-400">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
