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

            {/* UNIFIED MATERIALS SECTION */}
            <section className="pt-24 border-t-4 border-double border-[#1a1a1a]/10">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 text-[#1a1a1a]">Materiały</h2>

              <div className="space-y-24">
                <PremiumWrapper projectId={projectId} minTier={1}>
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

                <PremiumWrapper
                  projectId={projectId}
                  minTier={2}
                  mediaPath="public.blob.vercel-storage.com/evidence-report-v1.pdf"
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
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: SIDEBAR REWARDS */}
          <aside className="lg:col-span-4 space-y-12" id="rewards">
            <div>
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
