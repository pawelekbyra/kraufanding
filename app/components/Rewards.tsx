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

  // Create the "Zostaw Napiwek" reward
  const tipReward: Reward = {
    id: 'tip-reward',
    title: 'Zostaw Napiwek',
    amount: 10,
    description: 'Wpłać dowolną kwotę i uzyskaj dostęp do treści dla Patronów.',
    deliveryDate: 'Natychmiast',
    backers: 124
  };

  // Only show the "Zostaw Napiwek" reward (hide others as requested)
  const allRewards = [tipReward];

  const onSupport = async (reward: Reward, index: number) => {
    if (!userId) {
      openSignIn();
      return;
    }

    const isCustom = reward.id === 'tip-reward' || reward.title.toLowerCase().includes('napiwek') || reward.title.toLowerCase().includes('twoja kwota');
    const amount = isCustom ? (customAmounts[reward.id] || reward.amount) : reward.amount;

    if (isCustom && amount < 10) {
      alert("Minimalna kwota wsparcia to 10 €");
      return;
    }

    try {
      setIsLoading(reward.id);

      // Determine tier level
      // Level 1: FREE, 2: Observer (Patron), 3: Witness, 4: Insider, 5: Architect
      let tierLevel = 2; // Default for tip/patron access

      if (!isCustom) {
        // Other rewards get higher tiers based on their position (starting from 3)
        tierLevel = Math.min(index + 2, 5);

        // Specific name matching for robustness
        if (reward.title.toLowerCase().includes('obserwator')) tierLevel = 2;
        else if (reward.title.toLowerCase().includes('świadek') || reward.title.toLowerCase().includes('witness')) tierLevel = 3;
        else if (reward.title.toLowerCase().includes('insider')) tierLevel = 4;
        else if (reward.title.toLowerCase().includes('architekt')) tierLevel = 5;
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
      {allRewards.map((reward, index) => {
        const isCustom = reward.id === 'tip-reward' || reward.title.toLowerCase().includes('napiwek') || reward.title.toLowerCase().includes('twoja kwota');
        const currentAmount = isCustom ? (customAmounts[reward.id] || reward.amount) : reward.amount;

        return (
        <div
          key={reward.id}
          className="bg-white border-2 border-[#1a1a1a]/10 rounded-[2rem] p-8 shadow-lg transition-all duration-500 group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              {!isCustom && (
                <h4 className="text-3xl font-black text-[#1a1a1a] tracking-tight uppercase group-hover:text-primary transition-colors">
                  {currentAmount.toLocaleString('pl-PL')} €
                </h4>
              )}
              <h3 className={isCustom ? "text-3xl font-black text-[#1a1a1a] tracking-tight uppercase group-hover:text-primary transition-colors" : "text-xl font-bold text-[#1a1a1a]/80 italic"}>
                {reward.title}
              </h3>
            </div>

            <p className="text-[#1a1a1a]/60 text-lg leading-relaxed">
              {reward.description}
            </p>

            {isCustom && (
              <div className="space-y-4 pt-4 border-t border-[#1a1a1a]/5">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/40 mb-2 italic">
                  Własna kwota wsparcia (min. 10 €)
                </label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <span className="text-2xl font-black text-[#1a1a1a]/20 group-focus-within/input:text-primary transition-colors">€</span>
                  </div>
                  <input
                    type="number"
                    min="10"
                    step="1"
                    value={currentAmount}
                    onChange={(e) => setCustomAmounts(prev => ({ ...prev, [reward.id]: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-[#FDFBF7] border-2 border-[#1a1a1a]/10 rounded-2xl py-5 pl-14 pr-6 font-black text-3xl text-[#1a1a1a] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
                {currentAmount < 10 && (
                  <p className="text-error text-[10px] font-black uppercase tracking-widest animate-pulse">Minimalna kwota to 10 €</p>
                )}
              </div>
            )}

            {!isCustom && (
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
            )}

            <button
              onClick={() => onSupport(reward, index)}
              disabled={!!isLoading || (isCustom && currentAmount < 10)}
              className={`btn bg-[#1a1a1a] text-[#FDFBF7] hover:bg-primary border-none btn-block rounded-xl font-black tracking-widest transition-all duration-300 ${isLoading === reward.id ? 'loading' : ''} ${(isCustom && currentAmount < 10) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
