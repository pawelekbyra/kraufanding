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
      {/* YOUTUBE STYLE HERO (IMAGE, TITLES, DESC) */}
      <Hero campaign={campaign} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* MAIN LAYOUT (CONTENT + SIDEBAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* LEFT COLUMN: COMMENTS */}
          <div className="lg:col-span-8 space-y-16">

            {/* COMMENTS SECTION */}
            <div className="pt-16 border-t border-[#1a1a1a]/5">
               <h3 className="text-2xl font-black uppercase tracking-widest mb-12 text-[#1a1a1a]">Komentarze</h3>
               <EmbeddedComments
                 entityId={campaign.id}
                 entityType="PROJECT"
                 userProfile={userProfile}
               />
            </div>
          </div>

          {/* RIGHT COLUMN: SIDEBAR (TIP + SECRETS) */}
          <aside className="lg:col-span-4 space-y-12" id="rewards">
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#1a1a1a]/40 italic border-b border-[#1a1a1a]/5 pb-4">
                  Wesprzyj Twórcę
                </h3>
                <Rewards rewards={campaign.rewards || []} projectId={projectId} />
              </div>

              {/* SECRETS AS THUMBNAILS IN SIDEBAR */}
              <div className="space-y-8 pt-8 border-t border-[#1a1a1a]/5">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#1a1a1a]/40 italic">
                  Ekskluzywne Materiały
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                   <div className="group cursor-pointer flex lg:flex-col gap-4 lg:gap-0">
                      <div className="w-40 lg:w-full shrink-0">
                        <PremiumWrapper projectId={projectId} minTier={1}>
                          <div className="aspect-video rounded-xl overflow-hidden bg-[#1a1a1a]/5 border border-[#1a1a1a]/5 mb-3">
                             <img src="https://picsum.photos/seed/ops/400/225" alt="Ops" className="w-full h-full object-cover" />
                          </div>
                        </PremiumWrapper>
                      </div>
                      <div className="!mt-0">
                         <p className="text-xs font-black uppercase tracking-tight line-clamp-2">Briefing Operacyjny: Tajne dane</p>
                         <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest mt-1 italic">Dla Zalogowanych</p>
                      </div>
                   </div>

                   <div className="group cursor-pointer flex lg:flex-col gap-4 lg:gap-0">
                      <div className="w-40 lg:w-full shrink-0">
                        <PremiumWrapper projectId={projectId} minTier={2}>
                          <div className="aspect-video rounded-xl overflow-hidden bg-[#1a1a1a]/5 border border-[#1a1a1a]/5 mb-3">
                             <img src="https://picsum.photos/seed/premium/400/225" alt="Secret" className="w-full h-full object-cover" />
                          </div>
                        </PremiumWrapper>
                      </div>
                      <div className="!mt-0">
                         <p className="text-xs font-black uppercase tracking-tight line-clamp-2">Pełny Raport Śledczy: Dowody</p>
                         <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest mt-1 italic">Dla Patronów</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </aside>

        </div>

      </div>
    </main>
  );
}
