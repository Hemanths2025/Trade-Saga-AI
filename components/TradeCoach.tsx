import React, { useState } from 'react';
import { analyzeTradePerformance } from '../services/geminiService';
import { MessageSquare, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';

export const TradeCoach: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [entry, setEntry] = useState('');
  const [exit, setExit] = useState('');
  const [direction, setDirection] = useState<'long' | 'short'>('long');
  const [notes, setNotes] = useState('');
  
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !entry || !exit) return;

    setLoading(true);
    try {
      const result = await analyzeTradePerformance(
        ticker,
        parseFloat(entry),
        parseFloat(exit),
        direction,
        notes
      );
      setFeedback(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Trade Coach AI</h1>
          <p className="text-slate-400">Review your past trades. Get brutally honest feedback to improve your edge.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-lg">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Ticker Symbol</label>
            <input 
              type="text" 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
              placeholder="e.g. TSLA"
              value={ticker}
              onChange={e => setTicker(e.target.value.toUpperCase())}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Entry Price</label>
              <input 
                type="number" 
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                placeholder="0.00"
                value={entry}
                onChange={e => setEntry(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Exit Price</label>
              <input 
                type="number" 
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                placeholder="0.00"
                value={exit}
                onChange={e => setExit(e.target.value)}
              />
            </div>
          </div>

          <div>
             <label className="block text-sm text-slate-400 mb-2">Direction</label>
             <div className="flex gap-4">
               <button 
                  type="button"
                  onClick={() => setDirection('long')}
                  className={`flex-1 py-3 rounded-lg font-semibold border ${direction === 'long' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
               >
                 Long (Buy)
               </button>
               <button 
                  type="button"
                  onClick={() => setDirection('short')}
                  className={`flex-1 py-3 rounded-lg font-semibold border ${direction === 'short' ? 'bg-rose-600/20 text-rose-400 border-rose-500' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
               >
                 Short (Sell)
               </button>
             </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Your Reasoning / Notes</label>
            <textarea 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-indigo-500 outline-none h-24 resize-none"
              placeholder="Why did you take this trade? How did you feel?"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 mt-2"
          >
            {loading ? 'Analyzing...' : 'Analyze Trade'}
          </button>
        </form>
      </div>

      <div className="flex flex-col h-full">
         <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
               <MessageSquare className="text-indigo-400"/> AI Feedback
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {feedback ? (
                <div className="prose prose-invert prose-p:text-slate-300">
                    {feedback.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                   <AlertCircle size={48} className="mb-4" />
                   <p className="text-center">Submit your trade details to receive a comprehensive analysis.</p>
                </div>
              )}
            </div>
         </div>
      </div>
    </div>
  );
};