import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, Settings, Sliders, Save } from 'lucide-react';
import { runBacktestSimulation } from '../services/geminiService';

export const Backtester: React.FC = () => {
  const [strategy, setStrategy] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [data, setData] = useState<{name: string, value: number}[]>([]);
  const [summary, setSummary] = useState('');

  const handleSimulate = async () => {
    if (!strategy) return;
    setIsSimulating(true);
    
    try {
        const result = await runBacktestSimulation(strategy);
        
        // Format for Recharts
        const chartData = result.dataPoints.map((val, idx) => ({
            name: `Day ${idx + 1}`,
            value: val
        }));
        
        setData(chartData);
        setSummary(result.summary);
    } catch (e) {
        console.error("Simulation failed", e);
    } finally {
        setIsSimulating(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Backtest Lab</h1>
        <p className="text-slate-400">Test your strategies with our simulated engine.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Controls */}
        <div className="lg:col-span-1 bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Sliders size={18} /> Configuration
          </h3>
          
          <div>
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Strategy Logic</label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white mt-2 h-32 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              placeholder="Describe your strategy (e.g., Buy when RSI < 30 and price is above 200 SMA, sell when RSI > 70)"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
            />
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Initial Capital</span>
                <span className="text-sm font-mono text-emerald-400">$10,000</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Timeframe</span>
                <span className="text-sm text-white">1 Hour</span>
             </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-700 space-y-2">
             <button 
                onClick={handleSimulate}
                disabled={isSimulating || !strategy}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all"
             >
                {isSimulating ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/> : <Play size={18} />}
                Run Simulation
             </button>
             <button className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 py-3 rounded-xl font-medium flex justify-center items-center gap-2 transition-all">
                <Save size={18} /> Save Strategy
             </button>
          </div>
        </div>

        {/* Chart Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
           <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex-1 min-h-[400px] relative">
              {data.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={['auto', 'auto']} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            itemStyle={{ color: '#818cf8' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
              ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                      <Settings size={48} className="mb-4 opacity-50" />
                      <p>Enter a strategy and hit Run to visualize performance.</p>
                  </div>
              )}
           </div>

           {/* Analysis Panel */}
           {summary && (
               <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 animate-fade-in">
                   <h4 className="text-lg font-semibold text-white mb-2">AI Performance Analysis</h4>
                   <p className="text-slate-300">{summary}</p>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};