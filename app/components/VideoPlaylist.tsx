"use client";

import React, { useState } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';

interface VideoPlaylistProps {
  projectId: string;
}

const VideoPlaylist: React.FC<VideoPlaylistProps> = ({ projectId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(10);
  const { userId } = useAuth();
  const { openSignIn } = useClerk();

  const onSupport = async () => {
    if (!userId) {
      openSignIn();
      return;
    }

    if (amount < 10) {
      alert("Minimalna kwota wsparcia to 10 €");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          amount: amount,
          projectId: projectId,
          tierLevel: 2, // Patron level
          title: "Zostaw Napiwek / Patron"
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
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 font-serif px-2" id="donations">
        <div
          className="bg-white border-2 border-[#1a1a1a]/10 rounded-[2rem] p-6 shadow-lg transition-all duration-500 group relative overflow-hidden"
        >
          <div className="space-y-4 relative z-10">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#1a1a1a] tracking-tight uppercase group-hover:text-primary transition-colors">
                Zostaw Napiwek
              </h3>
              <p className="text-[#1a1a1a]/60 text-sm leading-relaxed">
                Wpłać dowolną kwotę i uzyskaj dożywotni dostęp do treści dla Patronów.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/40 italic">
                Kwota wsparcia (min. 10 €)
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-xl font-black text-[#1a1a1a]/20 group-focus-within/input:text-primary transition-colors">€</span>
                </div>
                <input
                  type="number"
                  min="10"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#FDFBF7] border-2 border-[#1a1a1a]/10 rounded-2xl py-3 pl-10 pr-4 font-black text-2xl text-[#1a1a1a] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                />
              </div>
              {amount < 10 && (
                <p className="text-error text-[8px] font-black uppercase tracking-widest animate-pulse">Minimalna kwota to 10 €</p>
              )}
            </div>

            <button
              onClick={onSupport}
              disabled={isLoading || amount < 10}
              className={`btn bg-[#1a1a1a] text-[#FDFBF7] hover:bg-primary border-none btn-block rounded-xl font-black tracking-widest transition-all duration-300 ${isLoading ? 'loading' : ''} ${amount < 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'ŁADOWANIE...' : 'WESPRZYJ'}
            </button>
          </div>
        </div>
    </div>
  );
};

export default VideoPlaylist;
