import React from 'react';
import { Reward } from '../types/campaign';

interface RewardsProps {
  rewards: Reward[];
}

const Rewards: React.FC<RewardsProps> = ({ rewards }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-base-content mb-6">Wybierz Nagrodę</h2>
      {rewards.map((reward) => (
        <div
          key={reward.id}
          className="card bg-base-100/40 backdrop-blur-md border border-white/5 shadow-xl hover:shadow-[0_0_50px_-10px_rgba(var(--p),0.4)] hover:border-primary/50 hover:scale-[1.02] transition-all group cursor-pointer duration-500"
        >
          <div className="card-body p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <h3 className="card-title text-xl font-black group-hover:text-primary transition-colors tracking-tight">
                  {reward.title}
                </h3>
                <p className="text-3xl font-black text-primary drop-shadow-[0_0_8px_rgba(var(--p),0.3)]">
                  {reward.amount.toLocaleString()} <span className="text-sm opacity-70">PLN</span>
                </p>
              </div>
              <div className="badge badge-secondary badge-outline font-black text-[10px] py-3 uppercase tracking-widest px-3 border-2">
                {reward.backers} wspiera
              </div>
            </div>

            <p className="text-base-content/70 text-sm leading-relaxed mb-8 font-medium">
              {reward.description}
            </p>

            <div className="flex flex-col gap-2 border-t border-white/5 pt-6">
              <span className="text-[10px] uppercase tracking-tighter text-base-content/40 font-black">Przewidywana Dostawa</span>
              <span className="text-sm text-base-content/90 font-black flex items-center gap-2">
                📅 {reward.deliveryDate}
              </span>
            </div>

            <button className="btn btn-primary btn-block mt-8 font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 group-hover:animate-pulse">
              Wybierz Nagrodę
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Rewards;
