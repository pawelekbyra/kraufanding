"use client";

import React, { useState } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useLanguage } from './LanguageContext';

interface VideoPlaylistProps {
  videoId?: string;
  videoSlug?: string;
  videoTitle?: string;
}

const VideoPlaylist: React.FC<VideoPlaylistProps> = ({ videoTitle }) => {
  const { t, language } = useLanguage();
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
      alert(language === 'pl' ? "Minimalna kwota wsparcia to 5 zł" : "Minimum support amount is 5 PLN");
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
        window.location.href = data.url;
      } else if (data?.error) {
        if (response.status === 401 || data.error.includes("AUTH_REQUIRED")) {
          alert(language === 'pl' ? "Twoja sesja wygasła. Zaloguj się ponownie." : "Your session has expired. Please sign in again.");
          openSignIn();
        } else {
          alert(language === 'pl' ? `Błąd: ${data.message || data.error}` : `Error: ${data.message || data.error}`);
        }
      }
    } catch (error: any) {
      console.error("Payment error", error);
      alert(language === 'pl' ? "Błąd połączenia z systemem płatności. Spróbuj odświeżyć stronę." : "Payment system connection error. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 px-2" id="donations">
        <div className="bg-white border border-obsidian p-6 shadow-brutalist relative overflow-hidden">
          {/* Authentic Archive Stamp */}
          <div className="absolute -top-4 -right-4 w-28 h-28 border-2 border-ikb rounded-full flex items-center justify-center rotate-12 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
            <span className="font-mono text-[10px] font-black text-center uppercase leading-tight text-ikb tracking-widest">CERTIFIED<br/>DONOR<br/>2024</span>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-ikb flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white rotate-45" />
               </div>
               <h3 className="text-xl font-serif font-black text-obsidian uppercase tracking-tighter italic">
                 {t.supportArtist}
               </h3>
            </div>

            <div className="space-y-6">
              <p className="font-sans text-[14px] leading-relaxed text-obsidian/70 max-w-sm">
                {t.donationDescription}
              </p>

              <div className="space-y-3 pt-2">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-obsidian/50">
                  {language === 'pl' ? "KWOTA WSPARCIA (MIN 5.00 PLN)" : "TRANSACTION AMOUNT (MIN 5.00 PLN)"}
                </label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                    <span className="font-mono text-xl font-black text-ikb">PLN</span>
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
                    className="w-full bg-linen border border-obsidian rounded-none py-4 pl-16 pr-6 font-mono text-2xl text-obsidian focus:ring-0 focus:border-ikb focus:bg-white outline-none transition-all placeholder:opacity-20 shadow-inner"
                    placeholder="00"
                  />
                </div>
                {typeof amount === 'number' && amount < 5 && (
                  <p className="font-mono text-[10px] text-red-600 font-bold uppercase tracking-widest animate-pulse border-l-2 border-red-600 pl-2">
                    {language === 'pl' ? "Błąd: Nie osiągnięto minimum (5 PLN)" : "Error: Minimum amount not met (5 PLN)"}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onSupport}
              disabled={isLoading || amount === '' || amount < 5}
              className={`w-full bg-obsidian text-white py-4 font-mono font-bold text-sm tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-brutalist active:translate-x-[4px] active:translate-y-[4px] group ${isLoading ? 'opacity-70 cursor-wait' : ''} ${amount === '' || amount < 5 ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-none animate-spin" />
                  {language === 'pl' ? "PRZETWARZANIE..." : "LOADING..."}
                </>
              ) : (
                <>
                  {language === 'pl' ? 'WYŚLIJ WSPARCIE' : 'SEND SUPPORT'}
                  <div className="w-2 h-2 bg-ikb group-hover:scale-125 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
    </div>
  );
};

export default VideoPlaylist;
