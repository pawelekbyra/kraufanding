import React from 'react';
import { Reward } from '../types/campaign';

interface RewardsProps {
  rewards: Reward[];
}

const Rewards: React.FC<RewardsProps> = ({ rewards }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-white mb-8 border-l-4 border-indigo-600 pl-4">
        Wybierz nagrodę
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/10 hover:scale-[1.02] cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                  {reward.title}
                </h3>
                <p className="text-blue-400 font-bold text-lg mt-1">
                  {reward.amount} PLN lub więcej
                </p>
              </div>
            </div>

            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              {reward.description}
            </p>

            <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5">
              <div className="text-gray-500">
                <span className="block text-[10px] uppercase font-bold tracking-widest text-gray-600">Przewidywana dostawa</span>
                <span className="font-bold text-white">{reward.deliveryDate}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold tracking-widest text-gray-600">Wspierających</span>
                <span className="font-bold text-white">{reward.backers}</span>
              </div>
            </div>

            <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-full py-3 bg-white text-black text-xs font-black rounded-lg transition-transform hover:scale-[1.02]">
                Wybierz tę nagrodę
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
