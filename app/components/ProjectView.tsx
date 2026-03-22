import React from 'react';
import Hero from './Hero';
import Rewards from './Rewards';
import PremiumWrapper from './PremiumWrapper';
import EmbeddedComments from './comments/EmbeddedComments';
import { Campaign } from '../types/campaign';
import { auth, currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';

interface ProjectViewProps {
  campaign: Campaign;
  otherCampaigns?: Campaign[];
}

export default async function ProjectView({ campaign, otherCampaigns }: ProjectViewProps) {
  const projectId = campaign.id;
  const { userId } = auth();
  const user = await currentUser();

  const userProfile = userId ? {
    id: userId,
    email: user?.primaryEmailAddress?.emailAddress || ''
  } : null;

  return (
    <main className="bg-[#FDFBF7] min-h-screen">
      {/* EXACT YOUTUBE WIDTH */}
      <div className="max-w-[1280px] mx-auto px-4 py-6">

        {/* YOUTUBE STYLE GRID LAYOUT (12 COLS) */}
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT COLUMN (approx 68%): PLAYER + INFO + COMMENTS */}
          <div className="col-span-12 lg:col-span-8">

            {/* VIDEO PLAYER & METADATA */}
            <Hero campaign={campaign} />

            {/* DESCRIPTION BOX (YOUTUBE STYLE) */}
            <div className="mt-4 bg-[#1a1a1a]/5 rounded-xl p-4 space-y-2 hover:bg-[#1a1a1a]/10 transition-colors cursor-pointer group">
               <div className="flex gap-4 text-sm font-bold">
                  <span>124,562 wyświetleń</span>
                  <span>21 mar 2025</span>
               </div>
               <div className="text-sm leading-relaxed whitespace-pre-wrap font-serif italic text-[#1a1a1a]/90">
                  {campaign.description}
                  <br />
                  Zapraszam do obczajenia mojej nowej zrzutki. Wspierając ten projekt, zyskujesz dostęp do tajnych materiałów operacyjnych.
               </div>
               <button className="text-xs font-bold uppercase mt-2 opacity-60 group-hover:opacity-100">Pokaż więcej</button>
            </div>

            {/* COMMENTS SECTION */}
            <div className="mt-8">
               <EmbeddedComments
                 entityId={campaign.id}
                 entityType="PROJECT"
                 userProfile={userProfile}
               />
            </div>
          </div>

          {/* RIGHT COLUMN (approx 32%): SIDEBAR PLAYLIST (TIP + SECRETS) */}
          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#1a1a1a] mb-4 border-b border-[#1a1a1a]/5 pb-2">Materiały</h3>

            {/* MOCK PLAYLIST ITEMS (12+ items) */}
            {Array.from({ length: 15 }).map((_, i) => {
                const isDonate = i === 2;
                if (isDonate) {
                    return (
                        <div key="donate" className="py-2 border-y border-[#1a1a1a]/5">
                           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/40 italic mb-2 px-2">Wesprzyj Twórcę</h3>
                           <Rewards rewards={campaign.rewards || []} projectId={projectId} />
                        </div>
                    );
                }

                const isLocked = i > 0;
                const seed = `secret-${i}`;
                const titles = [
                    "Briefing Operacyjny: Tajne dane",
                    "Analiza systemów: Infiltracja",
                    "Pełny Raport Śledczy: Dowody",
                    "Nagranie z monitoringu: Sektor 7",
                    "Logi serwera: Przejęcie kontroli",
                    "Rozmowa przechwycona: Cel X",
                    "Dokumentacja techniczna v2.1",
                    "Kody źródłowe: Moduł Alpha",
                    "Wywiad terenowy: Operacja Noc",
                    "Zapisy audio: Świadek Zero",
                    "Mapa powiązań: Architekt",
                    "Zdjęcia satelitarne: Baza",
                    "Protokół bezpieczeństwa 99",
                    "Archiwum X: Niepublikowane",
                    "Finałowy raport: Rozwiązanie"
                ];

                return (
                    <div key={i} className="group cursor-pointer flex gap-3 p-2 rounded-lg hover:bg-[#1a1a1a]/5 transition-colors">
                      <div className="w-[168px] h-[94px] shrink-0 overflow-hidden rounded-lg bg-black relative">
                        <PremiumWrapper projectId={projectId} minTier={isLocked ? 2 : 1} variant="thumbnail">
                           <img
                             src={`https://picsum.photos/seed/${seed}/400/225`}
                             alt="Thumbnail"
                             className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                           />
                        </PremiumWrapper>
                        <div className="absolute bottom-1 right-1 bg-black text-white text-[10px] font-bold px-1 rounded">12:45</div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                        <h4 className="text-sm font-bold text-[#1a1a1a] line-clamp-2 leading-tight uppercase tracking-tight">
                           {titles[i % titles.length]}
                        </h4>
                        <div className="text-[11px] text-[#1a1a1a]/60 flex flex-col">
                           <span>Polutek Archive</span>
                           <div className="flex items-center gap-1">
                              <span>12K wyświetleń</span>
                              <span>•</span>
                              <span>1 rok temu</span>
                           </div>
                        </div>
                        {isLocked ? (
                           <span className="text-[8px] font-black uppercase tracking-widest text-[#1a1a1a]/30 italic">Ściśle Tajne</span>
                        ) : (
                           <span className="text-[8px] font-black uppercase tracking-widest text-primary">Unlocked</span>
                        )}
                      </div>
                    </div>
                );
            })}

          </aside>

        </div>

        {/* OTHER PROJECTS GALLERY (at the end of the section) */}
        {otherCampaigns && otherCampaigns.length > 0 && (
          <section className="mt-32 pt-24 border-t-4 border-double border-[#1a1a1a]/10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-[#1a1a1a]">Inne Zrzutki</h2>
              <p className="text-xl italic opacity-50 font-serif">Odkryj więcej projektów na polutek.pl</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {otherCampaigns.map((other) => (
                <Link key={other.id} href={`/projects/${other.slug}`} className="group">
                  <div className="bg-white border-2 border-[#1a1a1a]/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
                    <div className="aspect-[16/9] relative overflow-hidden bg-[#1a1a1a]/5">
                      <img
                        src={other.thumbnail}
                        alt={other.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                      />
                    </div>
                    <div className="p-8 space-y-6">
                      <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">{other.title}</h3>
                      <div className="flex justify-between items-center pt-4 border-t border-[#1a1a1a]/5">
                         <span className="text-sm font-black uppercase tracking-widest text-[#1a1a1a]/40">Zobacz projekt</span>
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                         </svg>
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
