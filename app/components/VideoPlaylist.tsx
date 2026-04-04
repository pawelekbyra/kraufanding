"use client";

import React, { useState, useEffect } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useLanguage } from './LanguageContext';
import ReferralModal from './ReferralModal';
import BrandName from './BrandName';
import { ChevronDown, Coin2 } from './icons';

interface VideoPlaylistProps {
  videoId?: string;
  videoSlug?: string;
  videoTitle?: string;
}

const VideoPlaylist: React.FC<VideoPlaylistProps> = ({ videoTitle }) => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(t.currency);

  const minAmount = 10;

  const getSuggestedAmount = (curr: string) => {
    if (curr === 'PLN') return 25;
    return 10;
  };

  const [amount, setAmount] = useState<number | ''>(getSuggestedAmount(t.currency));
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSelectedCurrency(t.currency);
    setAmount(getSuggestedAmount(t.currency));
  }, [t.currency]);

  const handleCurrencyChange = (curr: string) => {
    setSelectedCurrency(curr);
    setAmount(getSuggestedAmount(curr));
  };

  const availableCurrencies = ['PLN', 'USD', 'EUR', 'GBP', 'CHF'].filter(curr => {
    if (language === 'en' && curr === 'PLN') return false;
    return true;
  });
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
      alert(language === 'pl' ? `Minimalna kwota wsparcia to ${minAmount} ${selectedCurrency}` : `Minimum support amount is ${minAmount} ${selectedCurrency}`);
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
        <div className="bg-white border-2 border-[#3b82f6] p-6 pb-10 shadow-brutalist relative overflow-hidden rounded-2xl">
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-sans font-black text-[#1e40af] uppercase tracking-tight flex flex-wrap items-center justify-center gap-2 text-center">
              {language === 'pl' ? "WSPIERAJ POLUTEK.PL" : "SUPPORT POLUTEK.PL"}
              <Coin2 size={32} className="text-[#1e40af]" />
            </h3>

            <div className="space-y-4">
              <p className="font-serif text-sm leading-relaxed text-[#1e3a8a]">
                {t.donationDescription}
              </p>

              <div className="space-y-2 pt-2">
                <label className="block font-serif text-sm text-[#1e3a8a] font-bold text-center">
                  {language === 'pl' ? `Kwota wsparcia (Min ${minAmount}.00 ${selectedCurrency})` : `Transaction amount (Min ${minAmount}.00 ${selectedCurrency})`}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <select
                      value={selectedCurrency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                      className="h-full bg-transparent border-none pr-8 pl-4 font-mono text-xl font-bold text-[#1e40af]/50 focus:text-[#1e40af] focus:ring-0 outline-none cursor-pointer appearance-none transition-colors"
                      aria-label="Select Currency"
                    >
                      {availableCurrencies.map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                       <ChevronDown size={14} />
                    </div>
                  </div>
                  <input
                    type="number"
                    min={minAmount}
                    step="1"
                    value={amount}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAmount(val === '' ? '' : parseInt(val));
                    }}
                    className="w-full bg-[#eff6ff] border border-[#3b82f6]/30 rounded-lg py-4 px-12 font-mono text-3xl font-black text-[#1e40af] text-center focus:ring-0 outline-none transition-all placeholder:opacity-20"
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
              className={`w-full bg-[#1e3a8a] text-white py-4 rounded-lg font-mono font-bold text-sm tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-brutalist-sm active:translate-x-[4px] active:translate-y-[4px] ${isLoading ? 'opacity-70 cursor-wait' : ''} ${amount === '' || amount < minAmount ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
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
          </div>

          <button
            type="button"
            onClick={() => userId ? setIsModalOpen(true) : openSignIn()}
            className="absolute bottom-1 right-1 text-black/50 hover:text-black font-mono font-bold text-[9px] uppercase tracking-tighter transition-colors px-2 py-1 z-20"
          >
            {t.noMoney}
          </button>
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
