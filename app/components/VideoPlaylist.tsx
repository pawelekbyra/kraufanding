"use client";

import React, { useState, useEffect } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useLanguage } from './LanguageContext';
import ReferralModal from './ReferralModal';

interface VideoPlaylistProps {
  videoId?: string;
  videoSlug?: string;
  videoTitle?: string;
}

const VideoPlaylist: React.FC<VideoPlaylistProps> = ({ videoTitle }) => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(t.currency);
  const minAmount = language === 'pl' ? 10 : 5;
  const [amount, setAmount] = useState<number | ''>(language === 'pl' ? 25 : 10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSelectedCurrency(t.currency);
  }, [t.currency]);
  const [referralCount, setReferralCount] = useState(0);
  const { userId } = useAuth();
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (userId) {
      const fetchReferralData = async () => {
        try {
          const response = await fetch(`/api/user/referrals`);
          if (response.ok) {
            const data = await response.json();
            setReferralCount(data.referralCount || 0);
          }
        } catch (error) {
          console.error("[VideoPlaylist] Failed to fetch referral count:", error);
        }
      };
      fetchReferralData();
    }
  }, [userId]);

  const onSupport = async () => {
    if (!userId) {
      openSignIn();
      return;
    }

    if (!amount || amount < minAmount) {
      alert(language === 'pl' ? `Minimalna kwota wsparcia to ${minAmount} ${t.currency}` : `Minimum support amount is ${minAmount} ${t.currency}`);
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Number(amount),
            currency: selectedCurrency.toLowerCase(),
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
        <div className="bg-[#FDFBF7] border-2 border-black p-6 shadow-brutalist relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-black rounded-full flex items-center justify-center rotate-12 opacity-10 pointer-events-none">
            <span className="font-mono text-[12px] font-bold text-center uppercase leading-tight text-red-600">THANK<br/>YOU!</span>
          </div>

          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-serif font-black text-[#1a1a1a] uppercase tracking-tighter">
              {t.supportArtist}
            </h3>

            <div className="space-y-4">
              <p className="font-serif text-sm leading-relaxed text-[#1a1a1a]">
                {t.donationDescription}
              </p>

              <div className="space-y-2 pt-2">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-black/50 text-center">
                  {language === 'pl' ? `KWOTA WSPARCIA (MIN ${minAmount}.00 ${selectedCurrency})` : `TRANSACTION AMOUNT (MIN ${minAmount}.00 ${selectedCurrency})`}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    {language === 'pl' ? (
                      <div className="pr-6 font-mono text-xl font-bold text-black/20 select-none pointer-events-none">
                        {selectedCurrency}
                      </div>
                    ) : (
                      <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="h-full bg-transparent border-none pr-8 pl-4 font-mono text-xl font-bold text-black/40 focus:text-black focus:ring-0 outline-none cursor-pointer appearance-none transition-colors"
                        aria-label="Select Currency"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CHF">CHF</option>
                      </select>
                    )}
                    {language !== 'pl' && (
                      <div className="absolute right-4 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                         <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
                         </svg>
                      </div>
                    )}
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
                    className="w-full bg-white border-2 border-black rounded-none py-4 px-12 font-mono text-3xl font-black text-black text-center focus:ring-0 outline-none transition-all placeholder:opacity-20"
                    placeholder={String(minAmount)}
                  />
                </div>
                {typeof amount === 'number' && amount < minAmount && (
                  <p className="font-mono text-[10px] text-red-600 font-bold uppercase animate-pulse text-center">
                    {language === 'pl' ? `Błąd: Nie osiągnięto minimum (${minAmount} ${selectedCurrency})` : `Error: Minimum amount not met (${minAmount} ${selectedCurrency})`}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onSupport}
              disabled={isLoading || amount === '' || amount < minAmount}
              className={`w-full bg-black text-white py-4 font-mono font-bold text-sm tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-brutalist-sm active:translate-x-[4px] active:translate-y-[4px] ${isLoading ? 'opacity-70 cursor-wait' : ''} ${amount === '' || amount < minAmount ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {language === 'pl' ? "PRZETWARZANIE..." : "LOADING..."}
                </>
              ) : (
                language === 'pl' ? 'WYŚLIJ NAPIWEK' : 'TIP THE GUY'
              )}
            </button>

            <button
              type="button"
              onClick={() => userId ? setIsModalOpen(true) : openSignIn()}
              className="w-full text-black/40 hover:text-black font-mono font-bold text-[10px] uppercase tracking-widest pt-4 transition-colors"
            >
              {t.noMoney}
            </button>
          </div>
        </div>

        {userId && (
          <ReferralModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            userId={userId}
            referralCount={referralCount}
          />
        )}
    </div>
  );
};

export default VideoPlaylist;
