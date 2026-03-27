"use client";

import React, { useState } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useLanguage } from './LanguageContext';
import { Heart, CreditCard } from 'lucide-react';

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
        <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-slate-900 to-slate-900 border border-white/10 p-6 shadow-2xl transition-all hover:border-primary/30">
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Heart size={20} className="fill-primary/20" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                {t.supportArtist}
              </h3>
            </div>

            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-slate-400 font-medium">
                {t.donationDescription}
              </p>

              <div className="space-y-2 pt-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {language === 'pl' ? "KWOTA WSPARCIA (MIN 5.00 PLN)" : "TRANSACTION AMOUNT (MIN 5.00 PLN)"}
                </label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-primary transition-colors">
                    <span className="font-bold text-lg">zł</span>
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
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 font-bold text-2xl text-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-800"
                    placeholder="00"
                  />
                </div>
                {typeof amount === 'number' && amount < 5 && (
                  <p className="text-[10px] text-error font-black uppercase animate-pulse">
                    {language === 'pl' ? "Minimum: 5 PLN" : "Minimum: 5 PLN"}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onSupport}
              disabled={isLoading || amount === '' || amount < 5}
              className={`group/btn w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black text-sm tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {language === 'pl' ? "PRZETWARZANIE..." : "LOADING..."}
                </>
              ) : (
                <>
                  <CreditCard size={18} className="group-hover/btn:animate-bounce" />
                  {language === 'pl' ? 'WYŚLIJ NAPIWEK' : 'TIP THE GUY'}
                </>
              )}
            </button>
          </div>
        </div>
    </div>
  );
};

export default VideoPlaylist;
