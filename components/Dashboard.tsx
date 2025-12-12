import React, { useState } from 'react';
import { getMarketAnalysis } from '../services/geminiService';
import { StockRecommendation } from '../types';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [interest, setInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<StockRecommendation[]>([]);

  const handleAnalyze = async () => {
    if (!interest.trim()) return;
    setLoading(true);
    try {
      const result = await getMarketAnalysis(interest);
      setAnalysis(result.analysis);
      setRecommendations(result.recommendations);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Market Dashboard</h1>
        <p className="text-slate-400">AI-powered insights tailored to your trading style.</p>
      </header>

      {/* Input Section */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              What are you interested in today?
            </label>
            <input
              type="text"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="e.g., Tech stocks, Renewable energy, high volatility crypto..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading || !interest}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              loading
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
            }`}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <><Sparkles size={18} /> Analyze Market</>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Briefing */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="text-emerald-400" /> Market of the Day
            </h2>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
              {analysis.split('\n').map((para, i) => (
                <p key={i} className="mb-2">{para}</p>
              ))}
            </div>
          </div>

          {/* Recommendations List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-2">Top Picks for You</h3>
            {recommendations.map((stock, idx) => (
              <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-indigo-500/50 transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-2xl font-bold text-white">{stock.symbol}</span>
                    <p className="text-xs text-slate-400">{stock.name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                    stock.riskLevel === 'High' ? 'bg-rose-500/10 text-rose-400' :
                    stock.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {stock.riskLevel} Risk
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-3">{stock.reason}</p>
                <div className="flex items-center text-indigo-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                  View Details <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!analysis && !loading && (
        <div className="text-center py-20 opacity-50">
          <TrendingUp size={64} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-medium text-slate-400">Ready to analyze the markets</h3>
          <p className="text-slate-500">Enter your interests above to get started.</p>
        </div>
      )}
    </div>
  );
};