import React from 'react';
import { Reward } from '../types/campaign';

interface RewardsProps {
  rewards?: Reward[];
}

const Rewards: React.FC<RewardsProps> = ({ rewards }) => {
  if (!rewards || rewards.length === 0) return null;

  return (
    <div className="space-y-6 sticky top-24">
      <h2 className="text-2xl font-black text-white mb-6">Support this Project</h2>
      {rewards.map((reward) => (
        <div
          key={reward.id}
          className="glass-card p-6 rounded-2xl border-white/5 hover:border-indigo-500/50 transition-all duration-300 group cursor-pointer hover:-translate-y-1"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-2xl font-black text-indigo-400">
              {reward.amount.toLocaleString()} PLN
            </span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
              {reward.backers} Backers
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
            {reward.title}
          </h3>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            {reward.description}
          </p>
          <div className="pt-6 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-gray-500">Delivery: {reward.deliveryDate}</span>
            <button className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-bold rounded-lg transition-all">
              Select
            </button>
          </div>
        </div>
      ))}
      <div className="glass-card p-6 rounded-2xl border-dashed border-2 border-white/10 text-center hover:border-indigo-500/30 transition-all cursor-pointer">
        <h3 className="text-lg font-bold mb-2">Pledge without a reward</h3>
        <p className="text-sm text-gray-500 mb-4">Back it because you believe in it.</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="10"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          />
          <button className="px-4 py-2 bg-white text-black text-xs font-black rounded-lg">Pledge</button>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
