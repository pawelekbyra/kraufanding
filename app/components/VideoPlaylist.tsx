"use client";

import React, { useState, useEffect } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useLanguage } from './LanguageContext';
import ReferralModal from './ReferralModal';
import BrandName from './BrandName';
import { ChevronDown, Trophy } from './icons';

interface VideoPlaylistProps {
  videoId?: string;
  videoSlug?: string;
  videoTitle?: string;
}

const VideoPlaylist: React.FC<VideoPlaylistProps> = ({ videoTitle }) => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(t.currency);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [isRegulaminOpen, setIsRegulaminOpen] = useState(false);
  const [isPolitykaOpen, setIsPolitykaOpen] = useState(false);

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

    if (!isTermsAccepted) {
      setShowTermsError(true);
      return;
    }
    setShowTermsError(false);

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
    <div className="space-y-4 px-2 relative" id="donations">
        <div className="bg-white border-2 border-[#1a1a1a] p-6 pb-4 shadow-brutalist relative overflow-hidden rounded-2xl">
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-sans font-black text-[#1e3a8a] uppercase tracking-tight flex flex-wrap items-center justify-center gap-2 text-center">
              {t.supportArtist}
              <Trophy size={32} className="text-[#1e3a8a]" />
            </h3>

            <div className="space-y-4">
              <p className="font-serif text-sm leading-relaxed text-[#1e3a8a] whitespace-pre-wrap">
                {t.donationDescription}
              </p>

              {showTermsError && (
                <p className="text-red-600 font-sans font-bold text-[10px] text-center uppercase tracking-widest animate-bounce">
                  {t.pleaseAcceptTerms}
                </p>
              )}

              <div className="space-y-2 pt-2">
                <label className="block font-serif text-sm text-[#1e3a8a] font-bold text-center">
                  {language === 'pl' ? `Kwota wsparcia (Min ${minAmount}.00 ${selectedCurrency})` : `Transaction amount (Min ${minAmount}.00 ${selectedCurrency})`}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <select
                      value={selectedCurrency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                      className="h-full bg-transparent border-none pr-8 pl-4 font-mono text-xl font-bold text-[#1e3a8a]/50 focus:text-[#1e3a8a] focus:ring-0 outline-none cursor-pointer appearance-none transition-colors"
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
                    className="w-full bg-[#eff6ff] border border-[#e9eef6] rounded-lg py-4 px-12 font-mono text-3xl font-black text-[#1e3a8a] text-center focus:ring-0 outline-none transition-all placeholder:text-[#1e3a8a]/20"
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
              className={`w-full bg-[#1e3a8a] text-white py-4 rounded-lg font-mono font-bold text-sm tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 border border-[#1a1a1a] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-brutalist-sm active:translate-x-[4px] active:translate-y-[4px] ${isLoading ? 'opacity-70 cursor-wait' : ''} ${amount === '' || amount < minAmount ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
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

            {/* Terms below the button, no absolute positioning */}
            <div className="pt-2 flex justify-center">
              <label className="flex items-center gap-2 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity">
                <input
                  type="checkbox"
                  checked={isTermsAccepted}
                  onChange={(e) => {
                    setIsTermsAccepted(e.target.checked);
                    if (e.target.checked) setShowTermsError(false);
                  }}
                  className="checkbox checkbox-xs border-2 border-[#1e3a8a] rounded-sm checked:!bg-[#1e3a8a] checked:!border-[#1e3a8a] transition-all"
                />
                <span className="text-[#1e3a8a] font-sans font-medium text-[10px] tracking-tight transition-colors">
                  {language === 'pl' ? (
                    <>
                      Akceptuję{' '}
                      <button type="button" onClick={() => setIsRegulaminOpen(true)} className="underline hover:text-black">Regulamin</button>
                      {' '}i{' '}
                      <button type="button" onClick={() => setIsPolitykaOpen(true)} className="underline hover:text-black">Politykę Prywatności</button>
                    </>
                  ) : (
                    <>
                      I accept the{' '}
                      <button type="button" onClick={() => setIsRegulaminOpen(true)} className="underline hover:text-black">Terms</button>
                      {' '}and{' '}
                      <button type="button" onClick={() => setIsPolitykaOpen(true)} className="underline hover:text-black">Privacy Policy</button>
                    </>
                  )}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* "Nie mam hajsu" outside the box, positioned to not add height */}
        <button
          type="button"
          onClick={() => userId ? setIsModalOpen(true) : openSignIn()}
          className="absolute -bottom-6 left-4 text-black/20 hover:text-black font-mono font-bold text-[9px] uppercase tracking-tighter transition-colors py-1 z-30"
        >
          {t.noMoney}
        </button>

        {userId && (
          <ReferralModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            userId={userId}
            referralCount={referralCount}
          />
        )}

        {/* Regulamin Modal */}
        {isRegulaminOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-[#FDFBF7] border-2 border-[#1a1a1a] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-brutalist relative animate-in zoom-in-95 duration-300">
                <button
                  onClick={() => setIsRegulaminOpen(false)}
                  className="absolute top-4 right-4 text-black hover:opacity-50 transition-opacity font-bold uppercase tracking-widest text-xs"
                >
                  [ Zamknij ]
                </button>
                <div className="prose prose-sm prose-neutral">
                  <h1 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-2 border-[#1a1a1a]/10 pb-4">Regulamin Serwisu POLUTEK.PL</h1>
                  <section className="space-y-6 text-[#1a1a1a]">
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tight">1. Charakter platformy</h2>
                      <p>Serwis POLUTEK.PL jest prywatną, autorską platformą wideo. Platforma działa w modelu dożywotniego patronatu. Dostęp do treści cyfrowych jest uzależniony od łącznej kwoty wsparcia przekazanego twórcy.</p>
                    </div>
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tight">2. Model wsparcia i dostęp do treści</h2>
                      <p>Wsparcie finansowe przekazywane przez użytkowników ma charakter dobrowolnej wpłaty (napiwku). Użytkownicy odblokowują kolejne poziomy dostępu (Tiers) na podstawie swojej historycznej sumy wpłat (Lifetime Total).</p>
                    </div>
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tight">3. Płatności i brak zwrotów</h2>
                      <p>Wszelkie wpłaty są procesowane przez Stripe i mają charakter bezzwrotny. Raz odblokowany poziom dostępu jest przypisany do konta użytkownika na stałe (Lifetime Access).</p>
                    </div>
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tight">4. Prywatność i konto użytkownika</h2>
                      <p>Autoryzacja w serwisie odbywa się za pośrednictwem systemu Clerk. Użytkownik zobowiązuje się do korzystania z serwisu w sposób zgodny z prawem.</p>
                    </div>
                  </section>
                </div>
             </div>
          </div>
        )}

        {/* Polityka Prywatnosci Modal */}
        {isPolitykaOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-[#FDFBF7] border-2 border-[#1a1a1a] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-brutalist relative animate-in zoom-in-95 duration-300">
                <button
                  onClick={() => setIsPolitykaOpen(false)}
                  className="absolute top-4 right-4 text-black hover:opacity-50 transition-opacity font-bold uppercase tracking-widest text-xs"
                >
                  [ Zamknij ]
                </button>
                <div className="prose prose-sm prose-neutral">
                  <h1 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-2 border-[#1a1a1a]/10 pb-4">Polityka Prywatności</h1>
                  <section className="space-y-6 text-[#1a1a1a]">
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tight">1. Dane osobowe i logowanie</h2>
                      <p>Dla bezpieczeństwa i wygody użytkowników, POLUTEK.PL korzysta z zewnętrznego systemu uwierzytelniania <strong>Clerk</strong>. Clerk zarządza procesem rejestracji, logowania oraz danymi profilowymi użytkowników.</p>
                    </div>
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tight">2. Płatności i bezpieczeństwo finansowe</h2>
                      <p>Wszystkie operacje finansowe (darowizny, napiwki) są procesowane wyłącznie przez <strong>Stripe</strong>. POLUTEK.PL nie przechowuje ani nie ma bezpośredniego dostępu do danych kart płatniczych.</p>
                    </div>
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tight">3. Przetwarzanie i wykorzystanie danych</h2>
                      <p>Twoje dane są wykorzystywane wyłącznie w celu zapewnienia prawidłowego funkcjonowania serwisu i personalizacji dostępu do materiałów.</p>
                    </div>
                  </section>
                </div>
             </div>
          </div>
        )}
    </div>
  );
};

export default VideoPlaylist;
