import React, { useState, useRef, useEffect } from 'react';
import { getCompanyIntelligence } from '../services/geminiService';
import { Send, Bot, User } from 'lucide-react';
import { Message } from '../types';

export const CompanyIntel: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'Hello. I am your specialized market intelligence agent. Ask me about any company, ticker, or recent financial news.',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Format history for Gemini API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const responseText = await getCompanyIntelligence(userMsg.content, history);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen pt-4 pb-20 lg:pb-4 px-4 max-w-5xl mx-auto flex flex-col">
       <div className="flex-none mb-4">
         <h1 className="text-3xl font-bold text-white">Company Intel</h1>
         <p className="text-slate-400">Deep dive into company fundamentals and news using live search data.</p>
       </div>

       <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
             {messages.map((msg) => (
               <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'model' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                     {msg.role === 'model' ? <Bot size={20} className="text-white"/> : <User size={20} className="text-slate-300"/>}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'model' ? 'bg-slate-800 text-slate-200' : 'bg-indigo-600 text-white'}`}>
                     <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                     <span className="text-[10px] opacity-50 mt-2 block">{msg.timestamp.toLocaleTimeString()}</span>
                  </div>
               </div>
             ))}
             {isTyping && (
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                    <Bot size={20} className="text-white"/>
                 </div>
                 <div className="bg-slate-800 rounded-2xl p-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                 </div>
               </div>
             )}
          </div>

          <div className="p-4 bg-slate-800 border-t border-slate-700">
             <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about Apple's earnings, Tesla's delivery numbers, etc..."
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
             </form>
          </div>
       </div>
    </div>
  );
};