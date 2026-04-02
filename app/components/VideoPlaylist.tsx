"use client";

import React, { useState, useEffect } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useLanguage } from './LanguageContext';
import ReferralModal from './ReferralModal';
import BrandName from './BrandName';
import { ChevronDown } from './icons';

interface VideoPlaylistProps {
  videoId?: string;
  videoSlug?: string;
  videoTitle?: string;
}

const VideoPlaylist: React.FC<VideoPlaylistProps> = ({ videoTitle }) => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(t.currency);

  const getMinAmount = (curr: string) => {
    if (curr === 'PLN') return 10;
    if (curr === 'JPY') return 1000;
    return 5;
  };

  const getSuggestedAmount = (curr: string) => {
    if (curr === 'PLN') return 25;
    if (curr === 'JPY') return 5000;
    return 10;
  };

  const minAmount = getMinAmount(selectedCurrency);
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
        <div className="bg-[#FDFBF7] border border-[#1a1a1a] p-6 pb-14 shadow-brutalist relative overflow-hidden rounded-3xl">
          {/* ARCHIVAL METADATA DECOR */}
          <div className="absolute top-4 left-6 flex gap-4 opacity-20 pointer-events-none select-none">
             <div className="font-mono text-[8px] font-black uppercase tracking-widest">DOC-ID: TipGate-2024</div>
             <div className="font-mono text-[8px] font-black uppercase tracking-widest">VER: 1.0.4-Stable</div>
          </div>

          <div className="absolute top-2 right-2 w-24 h-24 border border-[#1a1a1a] rounded-full flex items-center justify-center rotate-12 opacity-10 pointer-events-none">
            <span className="font-mono text-[12px] font-bold text-center uppercase leading-tight text-red-600">THANK<br/>YOU!</span>
          </div>

          <div className="space-y-5 relative z-10 pt-4">
            <div className="flex items-center justify-between border-b border-dashed border-[#1a1a1a]/10 pb-4">
                <h3 className="text-xl font-serif font-black text-[#1a1a1a] uppercase tracking-tighter">
                {t.supportBrand} <BrandName variant="classic" />
                </h3>
                <div className="w-12 h-6 border border-[#1a1a1a] rounded-full bg-[#1a1a1a]/5 flex items-center justify-center opacity-40">
                   <div className="w-8 h-[1px] bg-[#1a1a1a]" />
                </div>
            </div>

            <div className="space-y-4">
              <p className="font-serif text-[15px] leading-relaxed text-[#1a1a1a] italic opacity-80">
                {t.donationDescription}
              </p>

              <div className="space-y-3 pt-2">
                <label className="block font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/40 text-center">
                  {language === 'pl' ? `KWOTA WSPARCIA (MIN ${minAmount}.00 ${selectedCurrency})` : `TRANSACTION AMOUNT (MIN ${minAmount}.00 ${selectedCurrency})`}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    {language === 'pl' ? (
                      <div className="pr-8 font-mono text-xl font-bold text-[#1a1a1a]/20 select-none pointer-events-none">
                        {selectedCurrency}
                      </div>
                    ) : (
                      <select
                        value={selectedCurrency}
                        onChange={(e) => handleCurrencyChange(e.target.value)}
                        className="h-full bg-transparent border-none pr-8 pl-6 font-mono text-xl font-bold text-[#1a1a1a]/40 focus:text-[#1a1a1a] focus:ring-0 outline-none cursor-pointer appearance-none transition-colors"
                        aria-label="Select Currency"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CHF">CHF</option>
                        <option value="JPY">JPY</option>
                      </select>
                    )}
                    {language !== 'pl' && (
                      <div className="absolute right-6 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                         <ChevronDown size={14} />
                      </div>
                    )}
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
                    className="w-full bg-[#1a1a1a]/5 border border-[#1a1a1a] rounded-full py-5 px-14 font-mono text-4xl font-black text-[#1a1a1a] text-center focus:ring-1 focus:ring-[#1a1a1a]/10 outline-none transition-all placeholder:opacity-10"
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
              className={`w-full bg-[#1e3a8a] text-white py-5 font-mono font-bold text-sm tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 rounded-full border-2 border-[#1a1a1a] hover:bg-[#1e3a8a]/90 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-brutalist active:translate-x-[4px] active:translate-y-[4px] ${isLoading ? 'opacity-70 cursor-wait' : ''} ${amount === '' || amount < minAmount ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
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

          <div className="absolute bottom-4 inset-x-0 flex justify-center border-t border-dashed border-[#1a1a1a]/5 pt-2">
            <button
                type="button"
                onClick={() => userId ? setIsModalOpen(true) : openSignIn()}
                className="text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 font-mono font-black text-[10px] uppercase tracking-[0.2em] transition-colors px-4 py-1"
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
