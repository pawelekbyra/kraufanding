import React from 'react';
import Hero from './Hero';
import Stats from './Stats';
import ProjectTabs from './ProjectTabs';
import Rewards from './Rewards';
import PremiumWrapper from './PremiumWrapper';
import { Campaign } from '../types/campaign';
import { SignInButton } from '@clerk/nextjs';

interface ProjectViewProps {
  campaign: Campaign;
}

export default function ProjectView({ campaign }: ProjectViewProps) {
  const projectId = campaign.id;

  return (
    <main className="bg-[#FDFBF7] min-h-screen">
      {/* HEADER & FEATURED IMAGE */}
      <Hero campaign={campaign} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* FUNDING BOX (FULL WIDTH BELOW IMAGE) */}
        <div className="mb-24">
          <Stats
            raised={campaign.raised}
            goal={campaign.goal}
            backers={248}
            daysLeft={14}
          />
        </div>

        {/* MAIN LAYOUT (TABS + SIDEBAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* LEFT COLUMN: STORY & UPDATES */}
          <div className="lg:col-span-8 space-y-24">

            {/* PROJECT TABS (STORY, UPDATES, COMMENTS) */}
            <div className="prose prose-lg prose-neutral max-w-none">
              <ProjectTabs campaign={campaign} />
            </div>

            {/* PREMIUM SECTION: OPERATIONAL MATERIALS (LOGIN ONLY) */}
            <section className="pt-24 border-t-4 border-double border-[#1a1a1a]/10">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 text-[#1a1a1a]">Materiały Operacyjne</h2>

              <PremiumWrapper
                projectId={projectId}
                minTier={1}
                teaser={(userTierLevel, isLoggedIn) => (
                  <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2rem] overflow-hidden group">
                    <h4 className="text-primary font-black mb-4 flex items-center gap-2 uppercase tracking-widest text-xs italic">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      DLA ZALOGOWANYCH
                    </h4>
                    <p className="font-serif italic opacity-70 mb-8 leading-relaxed text-lg">
                      Zaloguj się, aby obczaić materiały operacyjne.
                    </p>
                    <div className="aspect-video bg-[#1a1a1a]/5 rounded-2xl overflow-hidden mb-4 relative">
                       <img
                         src="https://picsum.photos/seed/operational/800/450"
                         alt="Operational"
                         className="object-cover w-full h-full opacity-40 blur-[10px] grayscale transform group-hover:scale-105 transition-all duration-1000"
                       />
                       <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                            <span className="bg-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl border border-[#1a1a1a]/10 text-[#1a1a1a]">Zaloguj się</span>
                            <SignInButton mode="modal">
                               <button className="btn btn-primary btn-xs rounded-lg font-black uppercase tracking-widest px-4 shadow-xl mt-3">Wejdź</button>
                            </SignInButton>
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest drop-shadow-md">aby obczaić</span>
                       </div>
                    </div>
                  </div>
                )}
              >
                <div className="bg-white p-12 rounded-[2.5rem] border border-[#1a1a1a]/10 shadow-2xl space-y-8 font-serif">
                    <h3 className="text-4xl font-black uppercase tracking-tight text-[#1a1a1a]">Briefing Operacyjny</h3>
                    <p className="text-xl leading-relaxed opacity-70 italic">
                      Dostęp do podstawowych materiałów dla wszystkich zarejestrowanych członków polutek.pl.
                    </p>
                    <div className="aspect-video bg-[#1a1a1a]/5 rounded-2xl overflow-hidden border border-[#1a1a1a]/5">
                       <img src="https://picsum.photos/seed/ops/1200/800" alt="Ops Content" className="w-full h-full object-cover" />
                    </div>
                </div>
              </PremiumWrapper>
            </section>

            {/* PREMIUM SECTION: CONFIDENTIAL ARCHIVE (PATRONS ONLY) */}
            <section className="pt-24 border-t-4 border-double border-[#1a1a1a]/10">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 text-[#1a1a1a]">Poufne Archiwum</h2>

              <PremiumWrapper
                projectId={projectId}
                minTier={2}
                mediaPath="public.blob.vercel-storage.com/evidence-report-v1.pdf"
                teaser={(userTierLevel, isLoggedIn) => (
                  <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2rem] overflow-hidden group">
                    <h4 className="text-primary font-black mb-4 flex items-center gap-2 uppercase tracking-widest text-xs italic">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      ŚCIŚLE TAJNE
                    </h4>
                    <p className="font-serif italic opacity-70 mb-8 leading-relaxed text-lg">
                      Zostaw Napiwek, aby obczaić.
                    </p>
                    <div className="aspect-video bg-[#1a1a1a]/5 rounded-2xl overflow-hidden mb-4 relative">
                       <img
                         src="https://picsum.photos/seed/secret/800/450"
                         alt="Free Sample"
                         className="object-cover w-full h-full transform group-hover:scale-105 transition-all duration-1000 opacity-40 blur-[10px] grayscale"
                       />
                       <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                            <span className="bg-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl border border-[#1a1a1a]/10 text-[#1a1a1a]">Ściśle Tajne</span>
                            {!isLoggedIn ? (
                              <SignInButton mode="modal">
                                <button className="btn btn-primary btn-xs rounded-lg font-black uppercase tracking-widest px-4 shadow-xl mt-3">Zostaw Napiwek</button>
                              </SignInButton>
                            ) : (
                              <a href="#rewards" className="btn btn-primary btn-xs rounded-lg font-black uppercase tracking-widest px-4 shadow-xl mt-3">Zostaw Napiwek</a>
                            )}
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest drop-shadow-md">aby obczaić</span>
                       </div>
                    </div>
                  </div>
                )}
              >
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="aspect-video bg-[#1a1a1a]/5 rounded-[2.5rem] overflow-hidden border border-[#1a1a1a]/5 shadow-2xl">
                    <img src="https://picsum.photos/seed/premium/1200/800" alt="Premium Content" className="w-full h-full object-cover grayscale-0" />
                  </div>
                  <div className="bg-white p-12 rounded-[2.5rem] border border-[#1a1a1a]/10 shadow-2xl space-y-8 font-serif">
                    <h3 className="text-4xl font-black uppercase tracking-tight text-[#1a1a1a]">Pełny Raport Śledczy</h3>
                    <p className="text-xl leading-relaxed opacity-70 italic">
                      To jest kompletny, nieograniczony dostęp do danych tajnego projektu.
                      Jako patron, masz teraz klucze do całego archiwum dowodów i badań.
                    </p>
                    <div className="grid grid-cols-2 gap-6 pt-6">
                       <div className="p-8 bg-[#FDFBF7] rounded-3xl border border-[#1a1a1a]/5 shadow-inner">
                          <span className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 italic">Format Pliku</span>
                          <span className="text-2xl font-black text-[#1a1a1a] tracking-tight">PDF / High Res</span>
                       </div>
                       <div className="p-8 bg-[#FDFBF7] rounded-3xl border border-[#1a1a1a]/5 shadow-inner">
                          <span className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 italic">Poziom Dostępu</span>
                          <span className="text-2xl font-black text-[#1a1a1a] tracking-tight">Obserwator+</span>
                       </div>
                    </div>
                  </div>
                </div>
              </PremiumWrapper>
            </section>

          </div>

          {/* RIGHT COLUMN: SIDEBAR REWARDS */}
          <aside className="lg:col-span-4 space-y-12" id="rewards">
            <div className="sticky top-24">
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 text-[#1a1a1a] font-serif border-b-2 border-[#1a1a1a]/5 pb-4">
                Nagrody
              </h3>
              <Rewards rewards={campaign.rewards || []} projectId={projectId} />
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
