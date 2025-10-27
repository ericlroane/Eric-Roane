import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { AuthenticatedPage } from '../App';

interface AppHeaderProps {
    currentPage: AuthenticatedPage;
    setPage: (page: AuthenticatedPage) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentPage, setPage }) => {
    const { profile } = useAuth();
    const { addToast } = useToast();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            addToast('Logged out successfully.', 'success');
        } catch (error: any) {
            addToast(error.message, 'error');
        }
    };

    const navLinkClasses = (page: AuthenticatedPage) => 
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === page 
            ? 'bg-slate-700 text-cyan-400' 
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`;

    return (
        <header className="bg-slate-800/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-700">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                         <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3M5.636 5.636l1.414 1.414m10.304 10.304l-1.414-1.414M12 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="text-2xl font-bold text-white">AI Pro Cars</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                        <button onClick={() => setPage('dashboard')} className={navLinkClasses('dashboard')}>
                            Dashboard
                        </button>
                        <button onClick={() => setPage('inventory')} className={navLinkClasses('inventory')}>
                            Inventory
                        </button>
                         <button onClick={() => setPage('crm')} className={navLinkClasses('crm')}>
                            CRM
                        </button>
                        <button onClick={() => setPage('sales')} className={navLinkClasses('sales')}>
                            Sales
                        </button>
                        <button onClick={() => setPage('ai-coach')} className={navLinkClasses('ai-coach')}>
                            AI Coach
                        </button>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-slate-300 hidden sm:block">Welcome, {profile?.displayName}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                        Logout
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default AppHeader;