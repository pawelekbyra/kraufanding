import React from 'react';
import { Reward } from '../types/campaign';

interface RewardsProps {
  rewards: Reward[];
}

const Rewards: React.FC<RewardsProps> = ({ rewards }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white mb-6">Wybierz Nagrodę</h2>
      {rewards.map((reward) => (
        <div
          key={reward.id}
          className="glass-card p-6 rounded-2xl border-white/5 hover:border-blue-500/30 transition-all hover:bg-white/10 group cursor-pointer hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:scale-[1.02] duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                {reward.title}
              </h3>
              <p className="text-2xl font-black text-blue-500 mt-1">
                {reward.amount.toLocaleString()} PLN
              </p>
            </div>
            <span className="bg-white/10 text-xs font-bold px-2 py-1 rounded border border-white/10 text-gray-400">
              {reward.backers} wspierających
            </span>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {reward.description}
          </p>

          <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Przewidywana Dostawa</span>
            <span className="text-sm text-gray-300 font-medium">{reward.deliveryDate}</span>
          </div>

          <button className="w-full mt-6 py-3 bg-white/5 hover:bg-blue-600 text-white font-black text-sm rounded-xl border border-white/10 hover:border-transparent transition-all group-hover:shadow-lg group-hover:shadow-blue-500/20">
            Wybierz Tę Nagrodę
          </button>
        </div>
      ))}
    </div>
  );
};

export default Rewards;
