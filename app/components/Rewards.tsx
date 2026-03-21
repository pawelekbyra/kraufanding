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
          className="card bg-base-100 border border-base-200 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all group cursor-pointer duration-300"
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="card-title text-lg font-bold group-hover:text-primary transition-colors">
                  {reward.title}
                </h3>
                <p className="text-2xl font-black text-primary mt-1">
                  {reward.amount.toLocaleString()} PLN
                </p>
              </div>
              <div className="badge badge-secondary badge-outline font-black text-[10px] py-3">
                {reward.backers} wspierających
              </div>
            </div>

            <p className="text-base-content/70 text-sm leading-relaxed mb-6">
              {reward.description}
            </p>

            <div className="flex flex-col gap-1 border-t border-base-200 pt-4">
              <span className="text-[10px] uppercase tracking-widest text-base-content/50 font-black">Przewidywana Dostawa</span>
              <span className="text-sm text-base-content/80 font-bold">{reward.deliveryDate}</span>
            </div>

            <button className="btn btn-primary btn-block mt-6 font-black rounded-xl">
              Wybierz Tę Nagrodę
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Rewards;
