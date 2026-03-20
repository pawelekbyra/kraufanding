import React from 'react';
import { Reward } from '../types/campaign';

interface RewardsProps {
  rewards: Reward[];
}

const Rewards: React.FC<RewardsProps> = ({ rewards }) => {
  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
        Select a Reward
        <span className="h-px flex-1 bg-white/10"></span>
      </h2>
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="group p-6 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="text-2xl font-black text-white">{reward.amount.toLocaleString()} PLN</span>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded">
                Reward
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
              {reward.title}
            </h3>

            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              {reward.description}
            </p>

            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tighter">
              <div className="flex flex-col">
                <span className="text-gray-400">Delivery</span>
                <span className="text-white mt-1">{reward.deliveryDate}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-gray-400">Backers</span>
                <span className="text-white mt-1">{reward.backers}</span>
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-white/5 group-hover:bg-indigo-600 text-white font-black rounded-xl border border-white/10 group-hover:border-indigo-500 transition-all transform active:scale-95">
              Select This Reward
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
