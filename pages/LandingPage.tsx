import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AdvantageTable from '../components/AdvantageTable';
import AIFeatureSection from '../components/AIFeatureSection';
import Pricing from '../components/Pricing';
import WhyUpgrade from '../components/WhyUpgrade';
import Footer from '../components/Footer';

interface LandingPageProps {
  setPage: (page: 'login' | 'signup') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setPage }) => {
  return (
    <div className="min-h-screen bg-slate-900 font-sans antialiased">
      <Header setPage={setPage} />
      <main className="overflow-hidden">
        <Hero setPage={setPage} />
        <AIFeatureSection />
        <AdvantageTable />
        <Pricing setPage={setPage} />
        <WhyUpgrade setPage={setPage} />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
