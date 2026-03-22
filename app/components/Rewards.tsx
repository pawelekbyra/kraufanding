"use client";

import React, { useState } from 'react';
import { Reward } from '../types/campaign';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface RewardsProps {
  rewards: Reward[];
  projectId: string;
}

const Rewards: React.FC<RewardsProps> = ({ rewards, projectId }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const onSupport = async (reward: Reward, index: number) => {
    if (!userId) {
      openSignIn();
      return;
    }

    const isCustom = reward.title.toLowerCase().includes('napiwek') || reward.title.toLowerCase().includes('twoja kwota') || reward.title.toLowerCase().includes('zostaw napiwek');
    const amount = isCustom ? (customAmounts[reward.id] || reward.amount) : reward.amount;

    if (isCustom && amount < 10) {
      alert("Minimalna kwota wsparcia to 10 €");
      return;
    }

    try {
      setIsLoading(reward.id);

      // Determine tier level based on reward order or specific name
      // Level 1: Tip, 2: Observer, 3: Witness, 4: Insider, 5: Architect
      let tierLevel = Math.min(index + 1, 5);
      if (isCustom) {
        tierLevel = 1;
      } else if (reward.title.toLowerCase().includes('obserwator') || reward.title.toLowerCase().includes('dyszka') || reward.title.toLowerCase().includes('dostep obserwatora')) {
        tierLevel = 2;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          amount: amount,
          projectId: projectId,
          tierLevel,
          title: reward.title
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.url) {
        window.location.assign(data.url);
      }
    } catch (error) {
      console.error("Payment error", error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-8 font-serif">
      {rewards.map((reward, index) => {
        const isCustom = reward.title.toLowerCase().includes('napiwek') || reward.title.toLowerCase().includes('twoja kwota') || reward.title.toLowerCase().includes('zostaw napiwek');
        return (
        <div
          key={reward.id}
          className="bg-white border-2 border-[#1a1a1a]/10 rounded-[2rem] p-8 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <h4 className="text-3xl font-black text-[#1a1a1a] tracking-tight uppercase group-hover:text-primary transition-colors">
                {isCustom
                  ? "Zostaw Napiwek"
                  : `${reward.amount.toLocaleString('pl-PL')} €`}
              </h4>
              <h3 className="text-xl font-bold text-[#1a1a1a]/80 italic">
                {isCustom ? "Twoja Kwota" : reward.title}
              </h3>
            </div>

            {isCustom ? (
              <div className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                  <p className="text-primary font-black text-xs uppercase tracking-widest mb-4">Wsparcie Dowolną Kwotą</p>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="10"
                        step="1"
                        placeholder="10"
                        value={customAmounts[reward.id] || ""}
                        onChange={(e) => setCustomAmounts(prev => ({ ...prev, [reward.id]: parseInt(e.target.value) || 0 }))}
                        className="input input-bordered bg-white border-2 border-primary/20 rounded-xl w-full font-black text-2xl text-primary focus:border-primary transition-all pr-12"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 font-black text-xl">€</span>
                    </div>
                  </div>
                  {(customAmounts[reward.id] || 0) > 0 && (customAmounts[reward.id] || 0) < 10 && (
                    <p className="text-error text-[10px] font-black uppercase tracking-widest mt-3 animate-pulse">Minimum 10 € wymagane</p>
                  )}
                </div>
                <p className="text-[#1a1a1a]/60 text-sm leading-relaxed italic">
                  Twoje wsparcie pozwala nam realizować kolejne etapy projektu. Każda kwota powyżej minimum ma znaczenie!
                </p>
              </div>
            ) : (
              <p className="text-[#1a1a1a]/60 text-lg leading-relaxed line-clamp-3">
                {reward.description}
              </p>
            )}

            <div className="flex justify-between items-end border-t border-[#1a1a1a]/5 pt-6">
              <div className="space-y-1">
                <span className="block text-[10px] uppercase tracking-widest text-[#1a1a1a]/30 font-black italic">Dostawa</span>
                <span className="text-sm text-[#1a1a1a] font-black">{reward.deliveryDate}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                  {reward.backers} wspierających
                </span>
              </div>
            </div>

            <button
              onClick={() => onSupport(reward, index)}
              disabled={!!isLoading}
              className={`btn bg-[#1a1a1a] text-[#FDFBF7] hover:bg-primary border-none btn-block rounded-xl font-black tracking-widest transition-all duration-300 ${isLoading === reward.id ? 'loading' : ''}`}
            >
              {isLoading === reward.id ? 'ŁADOWANIE...' : 'WYBIERZ'}
            </button>
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default Rewards;
