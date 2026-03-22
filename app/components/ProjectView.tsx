import React from 'react';
import Hero from './Hero';
import Stats from './Stats';
import ProjectTabs from './ProjectTabs';
import Rewards from './Rewards';
import PremiumWrapper from './PremiumWrapper';
import { Campaign } from '../types/campaign';
import { SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

interface ProjectViewProps {
  campaign: Campaign;
  otherCampaigns?: Campaign[];
}

export default function ProjectView({ campaign, otherCampaigns }: ProjectViewProps) {
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

        {/* OTHER PROJECTS GALLERY */}
        {otherCampaigns && otherCampaigns.length > 0 && (
          <section className="mt-48 pt-24 border-t-4 border-double border-[#1a1a1a]/10">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-[#1a1a1a]">Inne Zrzutki</h2>
              <p className="text-xl italic opacity-50 font-serif">Odkryj więcej projektów na polutek.pl</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {otherCampaigns.map((other) => (
                <Link key={other.id} href={`/projects/${other.slug}`} className="group">
                  <div className="bg-white border-2 border-[#1a1a1a]/5 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
                    <div className="aspect-[16/9] relative overflow-hidden bg-[#1a1a1a]/5">
                      <img
                        src={other.thumbnail}
                        alt={other.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                      />
                    </div>
                    <div className="p-8 space-y-6">
                      <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">{other.title}</h3>

                      <div className="space-y-4">
                        <div className="h-1.5 bg-[#1a1a1a]/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-1000"
                            style={{ width: `${Math.min((other.raised / other.goal) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-lg font-black">€{other.raised.toLocaleString('pl-PL')}</span>
                           <span className="text-[10px] font-black uppercase tracking-widest opacity-30 italic">z €{other.goal.toLocaleString('pl-PL')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
