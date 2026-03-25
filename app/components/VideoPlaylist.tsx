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

      // ARCHITEKTURA ON-DEMAND: Sesja generowana wyłącznie po kliknięciu
      const response = await fetch('/api/checkout', {
          method: 'POST', // WYŁĄCZNIE METODA POST
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Number(amount),
            title: videoTitle || "Tip The Guy / Patron"
          }),
          cache: 'no-store' // BEZWZGLĘDNE ZABICIE CACHE
      });

      const data = await response.json();

      if (data?.url) {
        // TWARDE PRZEKIEROWANIE: Unikanie cache'u przeglądarki
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
    <div className="space-y-4 px-2" id="donations">
        {/* PAYMENT AUTHORIZATION REQUEST - BRUTALIST DOCUMENT STYLE */}
        <div className="bg-[#FDFBF7] border-2 border-black p-6 shadow-brutalist relative overflow-hidden">
          {/* Decorative Stamp */}
          <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-black rounded-full flex items-center justify-center rotate-12 opacity-10 pointer-events-none">
            <span className="font-mono text-[10px] font-bold text-center uppercase">Approved<br/>By<br/>Polutek</span>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Header section */}
            <div className="border-b-2 border-dashed border-black pb-4">
              <h3 className="text-xl font-serif font-black text-[#1a1a1a] uppercase tracking-tighter">
                Payment Authorization Request
              </h3>
              <p className="font-mono text-[10px] text-[#1a1a1a]/60 mt-1 uppercase leading-tight">
                Ref: PATRON-SUPPORT-{new Date().getFullYear()}-X
              </p>
            </div>

            <div className="space-y-4">
              <p className="font-serif text-sm leading-relaxed text-[#1a1a1a]">
                Tip any amount to unlock permanent VIP access levels. All contributions directly support the channel.
              </p>

              <div className="space-y-2 pt-2">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">
                  Transaction Amount (MIN 5.00 EUR)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="font-mono text-xl font-bold text-black/20">€</span>
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
                    className="w-full bg-white border-2 border-black rounded-none py-3 pl-10 pr-4 font-mono text-2xl text-black focus:ring-0 outline-none transition-all placeholder:opacity-20"
                    placeholder="00.00"
                  />
                </div>
                {typeof amount === 'number' && amount < 5 && (
                  <p className="font-mono text-[10px] text-red-600 font-bold uppercase animate-pulse">Error: Minimum amount not met (5 EUR)</p>
                )}
              </div>
            </div>

            {/* CZYSTY BUTTON: Zero tagów Link, zero <a> */}
            <button
              type="button"
              onClick={onSupport}
              disabled={isLoading || amount === '' || amount < 5}
              className={`w-full bg-black text-white py-4 font-mono font-bold text-sm tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-brutalist-sm active:translate-x-[4px] active:translate-y-[4px] ${isLoading ? 'opacity-70 cursor-wait' : ''} ${amount === '' || amount < 5 ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  LOADING...
                </>
              ) : (
                'TIP THE GUY'
              )}
            </button>

            <div className="pt-2">
              <p className="font-mono text-[8px] text-black/40 leading-tight uppercase text-center">
                This action will redirect you to secure Stripe Checkout.<br/>
                No recurring charges. Lifetime access granted upon success.
              </p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default VideoPlaylist;
