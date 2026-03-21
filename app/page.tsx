import React from 'react';
import Link from 'next/link';
import { mockCampaigns } from './data/mock-campaigns';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import ProjectTabs from './components/ProjectTabs';
import Rewards from './components/Rewards';
import Footer from './components/Footer';
import PremiumWrapper from './components/PremiumWrapper';

export default function Home() {
  const campaign = mockCampaigns[0];
  const projectId = campaign.id;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif selection:bg-primary selection:text-white">
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <Hero campaign={campaign} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

            {/* LEFT COLUMN: STORY & UPDATES */}
            <div className="lg:col-span-8 space-y-24">

              {/* STATS BAR (MOBILE ONLY) */}
              <div className="lg:hidden">
                <Stats
                  raised={campaign.raised}
                  goal={campaign.goal}
                  backers={248}
                  daysLeft={14}
                />
              </div>

              {/* PROJECT TABS (STORY, UPDATES, COMMENTS) */}
              <div className="prose prose-lg prose-neutral max-w-none">
                <ProjectTabs campaign={campaign} />
              </div>

              {/* EXAMPLE OF GATED CONTENT USING PremiumWrapper */}
              <section className="pt-12 border-t border-neutral/10">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">Confidential Archive</h2>

                <PremiumWrapper
                  projectId={projectId}
                  minTier={2}
                  teaser={
                    <div className="p-8 bg-primary/5 border border-primary/20 rounded-2xl">
                      <h4 className="text-primary font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        FREE PREVIEW UNLOCKED
                      </h4>
                      <p className="font-serif italic opacity-80 mb-6 leading-relaxed text-lg">
                        As a registered user, you have access to this initial insight. The full investigation
                        is reserved for our patrons.
                      </p>
                      <div className="aspect-video bg-neutral/10 rounded-xl overflow-hidden mb-4 relative">
                         <img src="https://picsum.photos/seed/secret/800/450" alt="Free Sample" className="object-cover w-full h-full opacity-50 blur-[2px]" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-white/90 px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-xl">Sample Preview</span>
                         </div>
                      </div>
                    </div>
                  }
                >
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="aspect-video bg-neutral/5 rounded-3xl overflow-hidden border border-neutral/10 shadow-inner">
                      <img src="https://picsum.photos/seed/premium/1200/800" alt="Premium Content" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white p-10 rounded-3xl border border-neutral/10 shadow-xl space-y-6">
                      <h3 className="text-3xl font-bold uppercase tracking-tight">Full Investigation Report</h3>
                      <p className="text-xl leading-relaxed opacity-80">
                        This is the complete, unrestricted access to the secret project data.
                        As a patron, you now hold the keys to the entire archive of evidence and research.
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                         <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-neutral/5">
                            <span className="block text-xs font-black uppercase tracking-widest opacity-40 mb-2">File Format</span>
                            <span className="text-lg font-bold">PDF / High Resolution</span>
                         </div>
                         <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-neutral/5">
                            <span className="block text-xs font-black uppercase tracking-widest opacity-40 mb-2">Access Level</span>
                            <span className="text-lg font-bold">Observer+</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </PremiumWrapper>
              </section>

            </div>

            {/* RIGHT COLUMN: STATS & REWARDS (DESKTOP ONLY) */}
            <aside className="lg:col-span-4 space-y-12">
              <div className="hidden lg:block sticky top-24">
                <Stats
                  raised={campaign.raised}
                  goal={campaign.goal}
                  backers={248}
                  daysLeft={14}
                />
                <div className="mt-12">
                  <Rewards rewards={campaign.rewards || []} />
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
