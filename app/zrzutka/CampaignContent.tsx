"use client";

import React, { useState, useEffect } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { useLanguage } from '../components/LanguageContext';
import { Trophy, Users, Heart, Star, Gem, Check, ArrowRight, Loader2, ChevronDown } from '../components/icons';
import EmbeddedComments from '../components/comments/EmbeddedComments';
import { createPortal } from 'react-dom';
import { useAuth, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BrandName from '../components/BrandName';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface CampaignContentProps {
  adminData: any;
  creator: any;
  userProfile: any;
  totalRaised: number;
  supportersCount: number;
}

const REWARDS = [
  {
    id: 'reward_1',
    amount: 50,
    title: 'Wspierający',
    description: 'Twoje imię pojawi się w napisach końcowych mojego projektu. Dziękuję za zaufanie!',
    icon: <Heart className="text-red-500" size={32} />,
    perks: ['Imię w napisach', 'Podziękowanie e-mail', 'Dożywotni Patron (Tier 1)']
  },
  {
    id: 'reward_2',
    amount: 150,
    title: 'Mecenas Projektu',
    description: 'Dostęp do ekskluzywnych nagrań zza kulis powstawania projektu oraz wcześniejszy dostęp do materiałów.',
    icon: <Star className="text-amber-500" size={32} />,
    perks: ['Wszystko z Tier 1', 'Nagrania Behind-the-scenes', 'Wcześniejszy dostęp', 'Dożywotni Patron (Tier 2)']
  },
  {
    id: 'reward_3',
    amount: 500,
    title: 'Partner Strategiczny',
    description: 'Zaproszenie na zamknięte spotkanie online, gdzie omówię szczegóły projektu i odpowiem na Twoje pytania.',
    icon: <Gem className="text-blue-500" size={32} />,
    perks: ['Wszystko z Tier 2', 'Spotkanie online Q&A', 'Dostęp do Discorda VIP', 'Limitowana koszulka projektu']
  }
];

export default function CampaignContent({
  creator,
  userProfile,
  totalRaised: initialRaised,
  supportersCount: initialSupporters
}: CampaignContentProps) {
  const { language } = useLanguage();
  const { userId } = useAuth();
  const { openSignIn } = useClerk();

  const [mounted, setMounted] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | ''>(50);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setIsCheckoutModalOpen(true);
      setIsSuccess(true);
      setIsSyncing(true);
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        try {
          const res = await fetch('/api/user/sync');
          const data = await res.json();
          if (data.totalPaid > 0 || attempts >= 10) {
            clearInterval(interval);
            setIsSyncing(false);
          }
        } catch (e) {
          console.error("Sync error", e);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, []);

  const goal = 50000;
  const progress = Math.min(Math.round((initialRaised / goal) * 100), 100);

  const handleSupport = async (amount: number) => {
    if (!userId) {
      openSignIn();
      return;
    }

    if (!amount || amount < 10) {
      alert(language === 'pl' ? "Minimalna kwota to 10 PLN" : "Minimum amount is 10 PLN");
      return;
    }

    try {
      setIsLoading(true);
      setSelectedAmount(amount);

      const response = await fetch('/api/checkout/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Number(amount),
            currency: 'pln',
            title: `Wsparcie projektu: I rise money for my secret project`,
            creatorId: creator?.id
          }),
          cache: 'no-store'
      });

      const data = await response.json();

      if (data?.clientSecret) {
        setClientSecret(data.clientSecret);
        setIsCheckoutModalOpen(true);
      } else {
        alert(language === 'pl' ? `Błąd: ${data.message || data.error}` : `Error: ${data.message || data.error}`);
      }
    } catch (error) {
      console.error("Payment error", error);
      alert("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-brand font-black uppercase tracking-tighter leading-tight mb-4">
          I rise money for <br className="hidden md:block" />
          <span className="text-primary italic">my secret project</span>
        </h1>
        <Link
          href="/channel/polutek"
          className="flex items-center justify-center gap-2 text-[#1a1a1a]/60 font-serif hover:opacity-80 transition-opacity group/author"
        >
          <div className="w-8 h-8 rounded-full bg-[#eff6ff] border border-[#1a1a1a] overflow-hidden group-hover/author:border-primary transition-colors">
             <img
               src={creator?.imageUrl || "/nowe.png"}
               alt={creator?.name}
               className="w-full h-full object-contain p-1"
             />
          </div>
          <span className="font-bold uppercase tracking-widest text-[10px] flex items-center gap-1">
            By <BrandName className="text-[10px]" dotPlClassName="group-hover/author:animate-glow" />
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-brutalist-lg border-2 border-[#1a1a1a] bg-black">
             <VideoPlayer video={{
               id: 'campaign_video',
               title: 'I rise money for my secret project',
               videoUrl: 'https://pub-309ebc4b2d654f78b2a22e1d57917b94.r2.dev/Wuthering-Heights.mp4',
               thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
               creatorId: creator?.id || '',
               slug: 'campaign-video',
               tier: 'PUBLIC',
               views: 0,
               likesCount: 0,
               dislikesCount: 0
             } as any} />
          </div>

          <div className="bg-white border-2 border-[#1a1a1a] p-8 md:p-12 shadow-brutalist rounded-3xl space-y-8">
            <div className="flex items-center gap-4 border-b-2 border-[#1a1a1a]/5 pb-6">
               <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Trophy size={28} />
               </div>
               <div>
                  <h2 className="text-2xl font-brand font-black uppercase tracking-tight">O projekcie</h2>
                  <p className="text-sm text-[#1a1a1a]/40 font-serif">Secret Project #001</p>
               </div>
            </div>

            <div className="prose prose-neutral max-w-none font-serif text-lg leading-relaxed text-[#1a1a1a]/80">
              <p>Witajcie! Przez ostatnie miesiące pracowałem w ukryciu nad czymś, co może całkowicie zmienić sposób, w jaki postrzegacie niezależne dziennikarstwo i śledztwa w sieci.</p>
              <p><strong>&quot;Secret Project&quot;</strong> to rozbudowana platforma, która pozwoli nam wszystkim dotrzeć do prawdy tam, gdzie inni wolą milczeć. Potrzebuję Waszego wsparcia, aby sfinalizować produkcję i zabezpieczyć infrastrukturę.</p>
              <h3 className="font-brand font-black uppercase tracking-tight text-xl mt-10">Na co zbieramy?</h3>
              <ul className="list-none space-y-4 mt-6">
                <li className="flex gap-4 items-start">
                   <div className="w-6 h-6 bg-[#1a1a1a] rounded-full flex items-center justify-center shrink-0 mt-1">
                      <Check size={14} className="text-white" />
                   </div>
                   <span><strong>Postprodukcja:</strong> Profesjonalna oprawa wideo.</span>
                </li>
                <li className="flex gap-4 items-start">
                   <div className="w-6 h-6 bg-[#1a1a1a] rounded-full flex items-center justify-center shrink-0 mt-1">
                      <Check size={14} className="text-white" />
                   </div>
                   <span><strong>Bezpieczeństwo:</strong> Szyfrowane serwery.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-3">
                <h2 className="text-2xl font-brand font-black uppercase tracking-tight">Komentarze</h2>
                <div className="h-0.5 flex-1 bg-[#1a1a1a]/5" />
             </div>
             <div className="bg-white border-2 border-[#1a1a1a] p-8 shadow-brutalist rounded-3xl">
                <EmbeddedComments videoId="crowdfunding_zrzutka" userProfile={userProfile} videoTier="PUBLIC" />
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-8 h-fit">
          <div className="bg-[#1a1a1a] text-white p-8 md:p-10 shadow-brutalist-lg rounded-3xl space-y-8 relative overflow-hidden">
             <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Postęp kampanii</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-mono font-black tracking-tighter text-primary">{initialRaised.toLocaleString()}</span>
                      <span className="text-xl font-mono text-white/20">PLN</span>
                   </div>
                   <p className="text-sm font-medium text-white/40 italic">Cel: {goal.toLocaleString()} PLN</p>
                </div>

                <div className="space-y-3">
                   <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-primary shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span>{progress}% sfinalizowane</span>
                      <span className="text-primary">Wspieraj teraz</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white/60">
                         <Users size={14} />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Supporters</span>
                      </div>
                      <p className="text-xl font-mono font-black">{initialSupporters}</p>
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white/60">
                         <Star size={14} />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Days left</span>
                      </div>
                      <p className="text-xl font-mono font-black">24</p>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <span className="font-mono font-bold text-white/20">PLN</span>
                    </div>
                    <input
                      type="number"
                      min="10"
                      step="1"
                      value={selectedAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedAmount(val === '' ? '' : parseInt(val));
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-mono text-2xl font-black text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-white/10"
                      placeholder="10"
                    />
                  </div>

                  <button
                    onClick={() => handleSupport(Number(selectedAmount))}
                    disabled={isLoading || !selectedAmount || Number(selectedAmount) < 10}
                    className="w-full bg-white text-[#1a1a1a] py-4 rounded-2xl font-mono font-black text-sm tracking-[0.2em] uppercase transition-all hover:bg-primary hover:text-white active:scale-95 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'WESPRZYJ PROJEKT'}
                  </button>
                </div>
             </div>
          </div>

          <div id="rewards-section" className="space-y-6">
             <h2 className="text-xl font-brand font-black uppercase tracking-tight flex items-center gap-3 px-2">Nagrody dla Ciebie <ChevronDown size={20} className="text-primary" /></h2>
             <div className="space-y-6">
                {REWARDS.map((reward) => (
                   <div key={reward.id} className="group bg-white border-2 border-[#1a1a1a] p-6 shadow-brutalist rounded-3xl hover:-translate-y-1 transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                         <div className="p-3 bg-[#eff6ff] rounded-2xl border border-[#1a1a1a]/5 group-hover:bg-primary/10 transition-colors">{reward.icon}</div>
                         <div className="text-right">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]/40">Wpłata</span>
                            <span className="text-2xl font-mono font-black">{reward.amount} <span className="text-sm opacity-20">PLN</span></span>
                         </div>
                      </div>
                      <h3 className="text-lg font-brand font-black uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{reward.title}</h3>
                      <p className="text-sm text-[#1a1a1a]/60 font-serif mb-6 leading-relaxed">{reward.description}</p>
                      <div className="space-y-2 mb-6">
                         {reward.perks.map((perk, i) => (
                            <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-[#1a1a1a]/80">
                               <div className="w-4 h-4 bg-[#1a1a1a]/5 rounded-full flex items-center justify-center shrink-0"><Check size={10} className="text-primary" /></div>
                               <span>{perk}</span>
                            </div>
                         ))}
                      </div>
                      <button onClick={() => handleSupport(reward.amount)} disabled={isLoading} className="w-full bg-[#eff6ff] group-hover:bg-[#1a1a1a] group-hover:text-white border border-[#1a1a1a]/5 py-3 rounded-xl font-mono font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2">
                         {isLoading && selectedAmount === reward.amount ? <Loader2 className="animate-spin" size={14} /> : <>WYBIERAM <ArrowRight size={14} /></>}
                      </button>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {isCheckoutModalOpen && (clientSecret || isSuccess) && createPortal(
          <div className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-[#1a1a1a] flex flex-col md:flex-row overflow-hidden">
             <div className="hidden md:flex md:w-[45%] bg-[#1a1a1a] text-white flex-col justify-start px-10 md:px-12 lg:px-20 pt-1 pb-10 relative overflow-hidden h-full border-r border-white/5">
                <div className="relative z-10 mt-20">
                   <span className="inline-block px-3 py-0.5 bg-white/10 rounded text-[10px] font-black uppercase tracking-[0.4em] text-white/80 leading-none mb-6">Wsparcie Kampanii</span>
                   <h1 className="text-5xl lg:text-6xl font-brand font-black uppercase tracking-tighter leading-[0.85] mb-8">Zostań <br /> Mecenasem</h1>
                   <div className="space-y-6">
                      <div className="flex items-baseline gap-3 border-b border-white/10 pb-6">
                         <span className="text-4xl lg:text-5xl font-mono font-black tracking-tighter">{selectedAmount}</span>
                         <span className="text-xl font-mono opacity-20">PLN</span>
                      </div>
                      <p className="text-lg text-white/60 font-serif italic italic">&quot;I rise money for my secret project&quot;</p>
                   </div>
                </div>
             </div>

             <div className="flex-1 bg-[#FDFBF7] flex flex-col relative h-full">
                <button onClick={() => setIsCheckoutModalOpen(false)} className="absolute top-4 right-4 z-30 group items-center justify-center w-12 h-12 border border-[#1a1a1a]/10 rounded-full font-bold hover:bg-[#1a1a1a] hover:text-white transition-all bg-white shadow-lg"><span className="text-2xl leading-none flex items-center justify-center">×</span></button>
                <div className="flex-1 flex flex-col items-center justify-start px-6 md:px-12 lg:px-16 pt-20 pb-10 relative z-10 overflow-y-auto">
                   <div className="w-full max-w-[480px]">
                      {isSuccess ? (
                        <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                           <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl"><Check size={32} className="text-white" /></div>
                           <h1 className="text-3xl font-brand font-black uppercase tracking-tighter">Dziękujemy!</h1>
                           <button onClick={() => setIsCheckoutModalOpen(false)} className="w-full bg-[#1a1a1a] text-white py-4 rounded-2xl font-mono font-bold text-sm tracking-[0.2em] uppercase transition-all">Wróć do kampanii</button>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                           <h2 className="text-2xl font-brand font-black uppercase tracking-tight leading-none mb-2">Dokończ wpłatę</h2>
                           <div className="bg-white border border-[#1a1a1a]/5 p-1 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[2.5rem]">
                              <div className="p-6 md:p-8 lg:p-10">
                                 {stripePromise && clientSecret ? (
                                   <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'flat', variables: { colorPrimary: '#1a1a1a', colorBackground: '#ffffff', colorText: '#1a1a1a', borderRadius: '12px', fontFamily: 'var(--font-jakarta)' } } }}>
                                     <CheckoutForm returnUrl={`${window.location.origin}/zrzutka?success=true`} />
                                   </Elements>
                                 ) : <Loader2 className="animate-spin mx-auto my-20" size={32} />}
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>,
          document.body
        )}
    </div>
  );
}
