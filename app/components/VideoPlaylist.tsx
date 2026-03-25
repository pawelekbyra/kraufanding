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
        // Twarde i natychmiastowe przekierowanie na świeży URL ze Stripe
        window.location.href = data.url;
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
    <div className="space-y-4 font-mono px-2" id="donations">
        <div className="bg-white border-2 border-black border-dashed rounded-none p-6 relative overflow-hidden transition-all duration-500 shadow-brutalist">
          {/* Stamp Effect */}
          <div className="absolute -right-4 -top-4 w-24 h-24 border-4 border-primary/20 rounded-full flex items-center justify-center rotate-12 pointer-events-none uppercase font-black text-[10px] text-primary/20">
            <div className="border-2 border-primary/20 rounded-full w-20 h-20 flex items-center justify-center">
                POLUTEK.PL
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black text-[#1a1a1a] tracking-tighter uppercase">
                  Payment Authorization Request
                </h3>
                <span className="text-[10px] opacity-30">REF: TIP-{new Date().getFullYear()}</span>
              </div>
              <p className="text-[#1a1a1a]/60 text-[11px] leading-relaxed uppercase">
                Tip any amount and get lifetime access to Paweł Polutek’s patron-only content.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-black/10 border-dashed">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/40">
                / support_amount_eur
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-xl font-black text-[#1a1a1a]/20 transition-colors">€</span>
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
                  className="w-full bg-white border-2 border-black rounded-none py-3 pl-10 pr-4 font-black text-2xl text-[#1a1a1a] focus:ring-4 focus:ring-primary/5 outline-none transition-all"
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
              className={`w-full bg-black text-white hover:bg-primary border-none py-4 rounded-none font-black tracking-[0.3em] uppercase transition-all duration-300 shadow-brutalist-sm hover:-translate-y-1 active:translate-y-0 ${isLoading ? 'opacity-70 cursor-wait' : ''} ${amount === '' || amount < 5 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'PROCESSING...' : 'TIP THE GUY'}
            </button>

            <div className="pt-2 text-[9px] opacity-40 leading-tight">
                * By clicking the button above you initiate an on-demand Stripe Checkout session. This action cannot be cached or pre-fetched.
            </div>
          </div>
        </div>
    </div>
  );
};

export default VideoPlaylist;
