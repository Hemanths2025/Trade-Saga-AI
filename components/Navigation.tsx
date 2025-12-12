import React from 'react';
import { LayoutDashboard, LineChart, BookOpen, UserCheck, Search, Users, Activity } from 'lucide-react';
import { View } from '../types';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: View.DASHBOARD, label: 'Market Dashboard', icon: LayoutDashboard },
    { id: View.BACKTESTER, label: 'Backtester Lab', icon: LineChart },
    { id: View.COURSE, label: 'Academy', icon: BookOpen },
    { id: View.TRADE_COACH, label: 'Trade Coach AI', icon: UserCheck },
    { id: View.COMPANY_INTEL, label: 'Company Intel', icon: Search },
    { id: View.COMMUNITY, label: 'Community', icon: Users },
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
          <Activity size={20} />
        </div>
        <span className="font-bold text-xl tracking-tight text-white hidden lg:block">TradeSage</span>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={22} className={currentView === item.id ? 'text-indigo-400' : 'group-hover:text-white'} />
            <span className="font-medium hidden lg:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 hidden lg:block">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Pro Plan</p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mb-2">
            <div className="bg-indigo-500 h-1.5 rounded-full w-3/4"></div>
          </div>
          <p className="text-xs text-slate-500">1,240 / 5,000 Credits</p>
        </div>
      </div>
    </div>
  );
};