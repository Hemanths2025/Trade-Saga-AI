import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Backtester } from './components/Backtester';
import { Course } from './components/Course';
import { TradeCoach } from './components/TradeCoach';
import { CompanyIntel } from './components/CompanyIntel';
import { Community } from './components/Community';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.BACKTESTER:
        return <Backtester />;
      case View.COURSE:
        return <Course />;
      case View.TRADE_COACH:
        return <TradeCoach />;
      case View.COMPANY_INTEL:
        return <CompanyIntel />;
      case View.COMMUNITY:
        return <Community />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      <Navigation currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 ml-20 lg:ml-64 transition-all duration-300 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-slate-900 to-slate-900 pointer-events-none" />
        <div className="relative z-10 min-h-screen">
            {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;