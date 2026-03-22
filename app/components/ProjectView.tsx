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

          {/* LEFT COLUMN: PROGRESS & COMMENTS */}
          <div className="lg:col-span-8 space-y-16">

            {/* PROGRESS BOX */}
            <div className="pt-8 border-t border-[#1a1a1a]/5">
              <Stats
                raised={campaign.raised}
                goal={campaign.goal}
                backers={248}
                daysLeft={14}
              />
            </div>

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

                <div className="space-y-6">
                   <div className="group cursor-pointer">
                      <PremiumWrapper projectId={projectId} minTier={1}>
                        <div className="aspect-video rounded-2xl overflow-hidden bg-[#1a1a1a]/5 border border-[#1a1a1a]/5 mb-3">
                           <img src="https://picsum.photos/seed/ops/400/225" alt="Ops" className="w-full h-full object-cover" />
                        </div>
                      </PremiumWrapper>
                      <div className="!mt-0">
                         <p className="text-sm font-black uppercase tracking-tight line-clamp-2">Briefing Operacyjny: Tajne dane</p>
                         <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1 italic">Dla Zalogowanych</p>
                      </div>
                   </div>

                   <div className="group cursor-pointer">
                      <PremiumWrapper projectId={projectId} minTier={2}>
                        <div className="aspect-video rounded-2xl overflow-hidden bg-[#1a1a1a]/5 border border-[#1a1a1a]/5 mb-3">
                           <img src="https://picsum.photos/seed/premium/400/225" alt="Secret" className="w-full h-full object-cover" />
                        </div>
                      </PremiumWrapper>
                      <div className="!mt-0">
                         <p className="text-sm font-black uppercase tracking-tight line-clamp-2">Pełny Raport Śledczy: Dowody</p>
                         <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1 italic">Dla Patronów</p>
                      </div>
                   </div>
                </div>
              </div>
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
