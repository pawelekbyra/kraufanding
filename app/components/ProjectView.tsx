import React from 'react';
import Hero from './Hero';
import Rewards from './Rewards';
import PremiumWrapper from './PremiumWrapper';
import EmbeddedComments from './comments/EmbeddedComments';
import { Campaign } from '../types/campaign';
import { auth, currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

interface ProjectViewProps {
  campaign: Campaign;
}

export default async function ProjectView({ campaign }: ProjectViewProps) {
  const projectId = campaign.id;
  const { userId } = auth();
  const user = await currentUser();

  const userProfile = userId ? {
    id: userId,
    email: user?.primaryEmailAddress?.emailAddress || ''
  } : null;

  // Fetch initial interactivity state for the project with error handling
  let initialIsLiked = false;
  let initialIsSubscribed = false;
  let likesCount = 0;

  try {
    if (userId) {
       const dbUser = await prisma.user.findUnique({
         where: { clerkUserId: userId },
         select: { id: true, isSubscribed: true }
       }).catch(() => null);

       if (dbUser) {
          try {
            const projectLike = await prisma.projectLike.findUnique({
                where: { userId_projectId: { userId: dbUser.id, projectId: campaign.id } }
            });
            initialIsLiked = !!projectLike;
          } catch (e) {}

          initialIsSubscribed = (dbUser as any).isSubscribed || false;
       }
    }
    try {
        likesCount = await prisma.projectLike.count({ where: { projectId: campaign.id } });
    } catch (e) {
        likesCount = 0;
    }
  } catch (error) {
    console.error("[PROJECT_VIEW_INTERACTION_FETCH_ERROR]", error);
  }

  return (
    <main className="bg-[#FDFBF7] min-h-screen">
      {/* EXACT YOUTUBE WIDTH & MARGINS */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-4">

        {/* YOUTUBE STYLE GRID LAYOUT (12 COLS) */}
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT COLUMN (approx 68%): PLAYER + INFO + COMMENTS */}
          <div className="col-span-12 lg:col-span-8">

            {/* VIDEO PLAYER & METADATA */}
            <Hero campaign={{ ...campaign, initialIsLiked, initialIsSubscribed, likesCount }} />

            {/* DESCRIPTION BOX (YOUTUBE STYLE) */}
            <div className="mt-3 bg-[#1a1a1a]/5 rounded-xl p-3 hover:bg-[#1a1a1a]/10 transition-colors cursor-pointer group">
               <div className="flex gap-4 text-[14px] font-bold">
                  <span>{(campaign as any).views?.toLocaleString() || '124,562'} wyświetleń</span>
                  <span>21 mar 2025</span>
               </div>
               <div className="text-[14px] leading-relaxed whitespace-pre-wrap font-serif italic text-[#1a1a1a]/90 mt-1">
                  {campaign.description}
                  <br />
                  Zapraszam do obczajenia moich nowych materiałów wideo. Wspierając ten projekt, zyskujesz stały dostęp do tajnych materiałów operacyjnych.
               </div>
               <button className="text-[12px] font-bold uppercase mt-2 opacity-60 group-hover:opacity-100">Pokaż więcej</button>
            </div>

            {/* COMMENTS SECTION */}
            <div className="mt-6">
               <EmbeddedComments
                 entityId={campaign.id}
                 entityType="PROJECT"
                 userProfile={userProfile}
               />
            </div>
          </div>

          {/* RIGHT COLUMN (approx 32%): SIDEBAR PLAYLIST (TIP + SECRETS) */}
          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1a1a1a] mb-2 border-b border-[#1a1a1a]/5 pb-1">Materiały</h3>

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
                    <Link key={i} href="#" className="group flex gap-2 p-1 rounded-lg hover:bg-[#1a1a1a]/5 transition-colors">
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
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                        <h4 className="text-[13px] font-bold text-[#1a1a1a] line-clamp-2 leading-tight uppercase tracking-tight">
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
                    </Link>
                );
            })}

          </aside>

        </div>

      </div>
    </main>
  );
}
