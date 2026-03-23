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
    <div className="space-y-4 px-2" id="donations">
        <div
          className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl transition-all duration-500 group relative overflow-hidden border-t-4 border-t-gold"
        >
          <div className="space-y-6 relative z-10">
            <div className="space-y-1 text-center">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase font-serif">
                Zostaw Napiwek
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Wpłać dowolną kwotę i uzyskaj dożywotni dostęp do treści dla Patronów.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic text-center">
                Kwota wsparcia (min. 10 €)
              </label>
              <div className="relative group/input">
                <input
                  type="number"
                  min="10"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-4 font-black text-3xl text-slate-900 focus:border-gold focus:ring-4 focus:ring-gold/5 outline-none transition-all text-center"
                />
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-300 group-focus-within/input:text-gold transition-colors">€</span>
                </div>
              </div>
              {amount < 10 && (
                <p className="text-error text-[8px] font-black uppercase tracking-widest animate-pulse text-center">Minimalna kwota to 10 €</p>
              )}
            </div>

            <button
              onClick={onSupport}
              disabled={isLoading || amount < 10}
              className={`btn bg-primary hover:bg-gold text-white border-none btn-block h-14 rounded-2xl font-black tracking-widest transition-all duration-500 shadow-lg shadow-primary/20 ${isLoading ? 'loading' : ''} ${amount < 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'ŁADOWANIE...' : 'WESPRZYJ'}
            </button>
          </div>
        </div>
    </div>
  );
};

export default VideoPlaylist;
