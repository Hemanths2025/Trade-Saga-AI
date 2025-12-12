import React from 'react';
import { MessageCircle, Heart, Share2, MoreHorizontal } from 'lucide-react';

const MOCK_POSTS = [
  {
    id: 1,
    user: "SarahTrades",
    avatar: "https://picsum.photos/40/40?random=1",
    content: "Just closed my position on NVDA. The AI momentum is real, but taking profits at 20% gain. What's everyone else looking at for the afternoon session?",
    likes: 45,
    comments: 12,
    time: "2h ago"
  },
  {
    id: 2,
    user: "CryptoKing_99",
    avatar: "https://picsum.photos/40/40?random=2",
    content: "Bitcoin testing key resistance levels. If we break 65k with volume, we could see a massive leg up. Keep your eyes on the RSI divergence on the 4H chart.",
    likes: 120,
    comments: 34,
    time: "4h ago"
  },
  {
    id: 3,
    user: "MacroMike",
    avatar: "https://picsum.photos/40/40?random=3",
    content: "The Fed meeting minutes released today suggest rates might stay higher for longer. I'm rotating into defensive sectors like Utilities and Healthcare.",
    likes: 89,
    comments: 21,
    time: "5h ago"
  }
];

export const Community: React.FC = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-white">Trader Community</h1>
           <p className="text-slate-400">Connect, share ideas, and grow together.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          New Post
        </button>
      </header>

      <div className="space-y-6">
        {MOCK_POSTS.map(post => (
          <div key={post.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
             <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                   <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full border border-slate-600" />
                   <div>
                      <h3 className="font-semibold text-white">{post.user}</h3>
                      <p className="text-xs text-slate-400">{post.time}</p>
                   </div>
                </div>
                <button className="text-slate-400 hover:text-white">
                   <MoreHorizontal size={20} />
                </button>
             </div>
             
             <p className="text-slate-300 mb-6 leading-relaxed">
                {post.content}
             </p>
             
             <div className="flex items-center gap-6 border-t border-slate-700 pt-4">
                <button className="flex items-center gap-2 text-slate-400 hover:text-rose-400 transition-colors">
                   <Heart size={18} /> 
                   <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors">
                   <MessageCircle size={18} /> 
                   <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors ml-auto">
                   <Share2 size={18} /> 
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};