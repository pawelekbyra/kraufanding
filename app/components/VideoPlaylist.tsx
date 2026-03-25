"use client";

import React, { useState } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';

interface VideoPlaylistProps {
  videoId?: string;
  videoSlug?: string;
  videoTitle?: string;
}

const VideoPlaylist: React.FC<VideoPlaylistProps> = ({ videoTitle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<number | ''>(10);
  const { userId } = useAuth();
  const { openSignIn } = useClerk();

  const onSupport = async () => {
    if (!userId) {
      openSignIn();
      return;
    }

    if (!amount || amount < 5) {
      alert("Minimalna kwota wsparcia to 5 €");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Number(amount),
            title: videoTitle || "Tip The Guy / Patron"
          }),
          cache: 'no-store'
      });

      const data = await response.json();

      if (data?.url) {
        // Natychmiastowe przekierowanie po otrzymaniu świeżego URL
        window.location.assign(data.url);
      } else if (data?.error) {
        if (response.status === 401 || data.error.includes("AUTH_REQUIRED")) {
          alert("Twoja sesja wygasła. Zaloguj się ponownie.");
          openSignIn();
        } else {
          alert("Błąd: " + (data.message || data.error));
        }
      }
    } catch (error: any) {
      console.error("Payment error", error);
      alert("Błąd połączenia z systemem płatności. Spróbuj odświeżyć stronę.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 font-serif px-2" id="donations">
        <div className="bg-white border-2 border-[#1a1a1a]/10 rounded-[2rem] p-6 shadow-lg group relative overflow-hidden transition-all duration-500">
          <div className="space-y-4 relative z-10">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#1a1a1a] tracking-tight uppercase group-hover:text-primary transition-colors">
                Become a Patron
              </h3>
              <p className="text-[#1a1a1a]/60 text-sm leading-relaxed">
                Tip any amount to unlock permanent VIP access levels. All contributions directly support the channel.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/40 italic">
                Your support amount (min. €5)
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-xl font-black text-[#1a1a1a]/20 group-focus-within/input:text-primary transition-colors">€</span>
                </div>
                <input
                  type="number"
                  min="5"
                  step="1"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAmount(val === '' ? '' : parseInt(val));
                  }}
                  className="w-full bg-[#FDFBF7] border-2 border-[#1a1a1a]/10 rounded-2xl py-3 pl-10 pr-4 font-black text-2xl text-[#1a1a1a] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                />
              </div>
              {typeof amount === 'number' && amount < 5 && (
                <p className="text-error text-[8px] font-black uppercase tracking-widest animate-pulse">Minimalna kwota to 5 €</p>
              )}
            </div>

            <button
              type="button"
              onClick={onSupport}
              disabled={isLoading || amount === '' || amount < 5}
              className={`btn bg-[#1a1a1a] text-[#FDFBF7] hover:bg-primary border-none btn-block rounded-xl font-black tracking-widest transition-all duration-300 ${isLoading ? 'loading' : ''} ${amount === '' || amount < 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'LOADING...' : 'TIP THE GUY'}
            </button>
          </div>
        </div>
    </div>
  );
};

export default VideoPlaylist;
