import React, { useState } from 'react';
import { BookOpen, CheckCircle, Lock, PlayCircle } from 'lucide-react';
import { CourseModule } from '../types';

const MOCK_MODULES: CourseModule[] = [
  {
    id: '1',
    title: 'Introduction to Technical Analysis',
    duration: '15 min',
    level: 'Beginner',
    content: 'Technical analysis is a trading discipline employed to evaluate investments and identify trading opportunities by analyzing statistical trends gathered from trading activity, such as price movement and volume.'
  },
  {
    id: '2',
    title: 'Understanding Candlestick Patterns',
    duration: '25 min',
    level: 'Beginner',
    content: 'Candlestick charts originated in Japan over 100 years before the West developed the bar and point-and-figure charts. In the 1700s, a Japanese man named Homma discovered that, while there was a link between price and the supply and demand of rice, the markets were strongly influenced by the emotion of traders.'
  },
  {
    id: '3',
    title: 'Risk Management Fundamentals',
    duration: '20 min',
    level: 'Beginner',
    content: 'Risk management is the process of identifying, assessing, and controlling threats to an organization\'s capital and earnings. In trading, this means setting stop-losses and position sizing correctly.'
  },
  {
    id: '4',
    title: 'Moving Averages & Indicators',
    duration: '30 min',
    level: 'Intermediate',
    content: 'Locked content. Upgrade to Pro to access advanced indicator strategies.'
  }
];

export const Course: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Trading Academy</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Master the markets with our curated learning path. Start from the basics and work your way up to algorithmic strategies.</p>
      </header>

      <div className="space-y-4">
        {MOCK_MODULES.map((module, index) => {
          const isLocked = module.content.startsWith('Locked');
          const isOpen = activeModule === module.id;

          return (
            <div 
              key={module.id} 
              className={`bg-slate-800 border ${isOpen ? 'border-indigo-500' : 'border-slate-700'} rounded-2xl overflow-hidden transition-all duration-300`}
            >
              <button
                onClick={() => !isLocked && setActiveModule(isOpen ? null : module.id)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    isLocked ? 'bg-slate-700 text-slate-500' : 'bg-indigo-600 text-white'
                  }`}>
                    {isLocked ? <Lock size={18} /> : index + 1}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${isLocked ? 'text-slate-500' : 'text-white'}`}>{module.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><PlayCircle size={14} /> {module.duration}</span>
                      <span className="bg-slate-700 px-2 py-0.5 rounded text-xs">{module.level}</span>
                    </div>
                  </div>
                </div>
                {isOpen ? <div className="w-2 h-2 rounded-full bg-indigo-500"/> : null}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-700/50">
                  <p className="text-slate-300 leading-relaxed mb-6">
                    {module.content}
                  </p>
                  <button className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                    <CheckCircle size={18} /> Mark as Complete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};