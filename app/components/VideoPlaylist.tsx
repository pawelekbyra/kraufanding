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
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [receiptNo, setReceiptNo] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCurrency(t.currency);
    setAmount(getSuggestedAmount(t.currency));
    setCurrentYear(new Date().getFullYear());
    setReceiptNo(Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));
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
        <div className="bg-linen border-2 border-ink p-6 pb-12 shadow-brutalist relative overflow-hidden">
          {/* Authentic-looking archival stamp */}
          <div className="absolute top-2 right-2 w-28 h-28 border-4 border-oxblood/20 rounded-full flex items-center justify-center -rotate-12 pointer-events-none select-none">
            <div className="border-2 border-oxblood/20 rounded-full w-24 h-24 flex items-center justify-center">
              <span className="font-mono text-[10px] font-black text-center uppercase leading-none text-oxblood/40">
                OFFICIAL<br/>ARCHIVE<br/>{currentYear || '....'}
              </span>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-start border-b border-ink/10 pb-4">
              <div>
                <h3 className="text-2xl font-serif font-black text-ink uppercase tracking-tight">
                  {t.supportArtist}
                </h3>
                <p className="font-mono text-[10px] uppercase text-ink/40 tracking-widest mt-1">
                  FORM NO. PTK-DON-001 / {selectedCurrency}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-serif text-base leading-relaxed text-ink italic">
                &ldquo;{t.donationDescription}&rdquo;
              </p>

              <div className="bg-bone/50 border border-ink/10 p-4 space-y-4">
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
                    {language === 'pl' ? `DEKLAROWANA KWOTA (MIN ${minAmount}.00 ${selectedCurrency})` : `DECLARED AMOUNT (MIN ${minAmount}.00 ${selectedCurrency})`}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      {language === 'pl' ? (
                        <div className="pr-6 font-mono text-xl font-bold text-ink/30 select-none pointer-events-none">
                          {selectedCurrency}
                        </div>
                      ) : (
                        <div className="relative group">
                          <select
                            value={selectedCurrency}
                            onChange={(e) => handleCurrencyChange(e.target.value)}
                            className="h-full bg-transparent border-none pr-10 pl-4 font-mono text-xl font-bold text-ink/40 focus:text-ink focus:ring-0 outline-none cursor-pointer appearance-none transition-colors"
                            aria-label="Select Currency"
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="CHF">CHF</option>
                            <option value="JPY">JPY</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
                            </svg>
                          </div>
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
                      className="w-full bg-white border-2 border-ink rounded-none py-4 px-6 font-mono text-3xl font-black text-ink focus:ring-0 outline-none transition-all placeholder:opacity-10"
                      placeholder={String(minAmount)}
                    />
                  </div>
                  {typeof amount === 'number' && amount < minAmount && (
                    <p className="font-mono text-[10px] text-oxblood font-bold uppercase animate-pulse">
                      {language === 'pl' ? `! BŁĄD: KWOTA PONIŻEJ MINIMUM` : `! ERROR: AMOUNT BELOW MINIMUM`}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onSupport}
                disabled={isLoading || amount === '' || amount < minAmount}
                className={`w-full bg-oxblood text-linen py-5 font-mono font-bold text-sm tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-brutalist active:translate-x-[4px] active:translate-y-[4px] ${isLoading ? 'opacity-70 cursor-wait' : ''} ${amount === '' || amount < minAmount ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-linen/30 border-t-linen rounded-full animate-spin" />
                    {language === 'pl' ? "AUTORYZACJA..." : "AUTHORIZING..."}
                  </>
                ) : (
                  <>
                    {language === 'pl' ? 'POTWIERDŹ WSPARCIE' : 'CONFIRM SUPPORT'}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
              <div className="mt-4 flex justify-between items-center opacity-30 font-mono text-[9px] uppercase tracking-widest border-t border-ink/10 pt-4">
                <span>SECURE ARCHIVAL TRANSFER</span>
                <span>NO. {receiptNo || '------'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => userId ? setIsModalOpen(true) : openSignIn()}
            className="absolute bottom-2 right-2 text-ink/40 hover:text-oxblood font-mono font-bold text-[9px] uppercase tracking-tighter transition-colors px-2 py-1 z-20 underline decoration-dotted"
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
