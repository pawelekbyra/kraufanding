import React from 'react';
import Hero from './Hero';
import Stats from './Stats';
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
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* YOUTUBE STYLE GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: PLAYER + INFO + COMMENTS */}
          <div className="lg:col-span-8 space-y-8">

            {/* VIDEO PLAYER & METADATA */}
            <Hero campaign={campaign} />

            {/* DESCRIPTION & PROGRESS BOX */}
            <div className="space-y-6">
               {/* DESCRIPTION BOX */}
               <div className="bg-[#1a1a1a]/5 rounded-[2rem] p-6 sm:p-8 space-y-4">
                  <div className="flex gap-4 text-sm font-black uppercase tracking-widest">
                     <span>124,562 wyświetleń</span>
                     <span className="opacity-40 italic">21 mar 2025</span>
                  </div>
                  <div className="prose prose-neutral prose-lg italic text-[#1a1a1a]/70 leading-relaxed font-serif">
                     {campaign.description}
                     <br />
                     Zapraszam do obczajenia mojej nowej zrzutki. Wspierając ten projekt, zyskujesz dostęp do tajnych materiałów operacyjnych.
                  </div>
               </div>

               {/* CROWDFUNDING PROGRESS */}
               <Stats
                 raised={campaign.raised}
                 goal={campaign.goal}
                 backers={248}
                 daysLeft={14}
                 compact
               />
            </div>

            {/* COMMENTS SECTION */}
            <div className="pt-12 border-t border-[#1a1a1a]/5">
               <EmbeddedComments
                 entityId={campaign.id}
                 entityType="PROJECT"
                 userProfile={userProfile}
               />
            </div>
          </div>

          {/* RIGHT COLUMN: SIDEBAR PLAYLIST (TIP + SECRETS) */}
          <aside className="lg:col-span-4 space-y-6">

            {/* SECRET 1 */}
            <div className="group cursor-pointer flex gap-4">
              <div className="w-44 h-24 shrink-0 overflow-hidden rounded-xl bg-[#1a1a1a]/5 border border-[#1a1a1a]/5">
                <PremiumWrapper projectId={projectId} minTier={1}>
                  <img src="https://picsum.photos/seed/ops/400/225" alt="Ops" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </PremiumWrapper>
              </div>
              <div className="flex-1 py-1">
                <h4 className="text-sm font-black uppercase tracking-tight line-clamp-2 leading-snug">Briefing Operacyjny: Tajne dane</h4>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1 italic">Polutek HQ • 24K wyświetleń</p>
                <span className="inline-block mt-2 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Unlocked</span>
              </div>
            </div>

            {/* SECRET 2 */}
            <div className="group cursor-pointer flex gap-4">
              <div className="w-44 h-24 shrink-0 overflow-hidden rounded-xl bg-[#1a1a1a]/5 border border-[#1a1a1a]/5">
                <PremiumWrapper projectId={projectId} minTier={2}>
                  <img src="https://picsum.photos/seed/secret/400/225" alt="Secret" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </PremiumWrapper>
              </div>
              <div className="flex-1 py-1">
                <h4 className="text-sm font-black uppercase tracking-tight line-clamp-2 leading-snug">Pełny Raport Śledczy: Dowody</h4>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1 italic">Polutek Archive • 12K wyświetleń</p>
                <span className="inline-block mt-2 bg-[#1a1a1a]/5 text-[#1a1a1a]/40 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded italic">Ściśle Tajne</span>
              </div>
            </div>

            {/* DONATE BUTTON (POSITION 3) */}
            <div className="py-4 border-y border-[#1a1a1a]/5">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/30 italic mb-4">Wesprzyj Twórcę</h3>
               <Rewards rewards={campaign.rewards || []} projectId={projectId} />
            </div>

            {/* MORE SECRETS... */}
            <div className="group cursor-pointer flex gap-4 opacity-50">
              <div className="w-44 h-24 shrink-0 overflow-hidden rounded-xl bg-[#1a1a1a]/5 border border-[#1a1a1a]/5">
                  <div className="w-full h-full flex items-center justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-20">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                     </svg>
                  </div>
              </div>
              <div className="flex-1 py-1">
                <h4 className="text-sm font-black uppercase tracking-tight line-clamp-2 leading-snug">Logi Systemowe: Infiltracja</h4>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1 italic">Polutek Lab • Wkrótce</p>
              </div>
            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}
