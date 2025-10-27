import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CompleteProfile from './pages/CompleteProfile';
import FullScreenLoader from './components/shared/FullScreenLoader';
import Toast from './components/shared/Toast';
import AppHeader from './components/AppHeader';
import Inventory from './pages/Inventory';
import CRM from './pages/CRM';
import Sales from './pages/Sales';
import AICoach from './pages/AICoach';
import AnalysisDetail from './pages/AnalysisDetail';

export type AuthenticatedPage = 'dashboard' | 'inventory' | 'crm' | 'sales' | 'ai-coach' | 'analysis-detail';

const UnauthenticatedApp = () => {
  const [page, setPage] = useState<'landing' | 'login' | 'signup'>('landing');

  switch (page) {
    case 'login':
      return <Login setPage={setPage} />;
    case 'signup':
      return <Signup setPage={setPage} />;
    default:
      return <LandingPage setPage={setPage} />;
  }
};

const AuthenticatedApp = () => {
  const { profile, profileLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<AuthenticatedPage>('dashboard');
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  
  if (profileLoading) {
      return <FullScreenLoader message="Loading profile..."/>
  }

  if (!profile) {
    return <CompleteProfile />;
  }

  const navigateToAnalysis = (analysisId: string) => {
    setSelectedAnalysisId(analysisId);
    setCurrentPage('analysis-detail');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'inventory':
        return <Inventory />;
      case 'crm':
        return <CRM />;
      case 'sales':
        return <Sales />;
      case 'ai-coach':
        return <AICoach onSelectAnalysis={navigateToAnalysis} />;
      case 'analysis-detail':
        return <AnalysisDetail analysisId={selectedAnalysisId} setPage={setCurrentPage} />;
      default:
        return <Dashboard setPage={setCurrentPage} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
        <AppHeader currentPage={currentPage} setPage={setCurrentPage} />
        <main>
            {renderPage()}
        </main>
    </div>
  );
};


const AppContent = () => {
    const { user, loading } = useAuth();

    if(loading) return <FullScreenLoader message="Authenticating..."/>;
    
    return user ? <AuthenticatedApp /> : <UnauthenticatedApp />
}


function App() {
  return (
    <ToastProvider>
        <AuthProvider>
            <AppContent/>
            <Toast />
        </AuthProvider>
    </ToastProvider>
  );
}

export default App;