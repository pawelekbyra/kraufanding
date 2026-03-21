'use client';

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import ProjectTabs from './components/ProjectTabs';
import StartCampaignCTA from './components/StartCampaignCTA';
import Footer from './components/Footer';
import { Campaign, Reward } from './types/campaign';

interface ClientHomeProps {
  restrictedContent: React.ReactNode;
  initialCampaign: Campaign;
  initialRewards: Reward[];
}

export default function ClientHome({ restrictedContent, initialCampaign, initialRewards }: ClientHomeProps) {
  const [raised, setRaised] = useState(initialCampaign.raised);
  const goal = initialCampaign.goal;

  const currentCampaign: Campaign = {
    ...initialCampaign,
    raised: raised,
    rewards: initialRewards
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a]">
      <Navbar />

      <main>
        <Hero campaign={currentCampaign} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Stats />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            <div className="lg:col-span-2">
              <ProjectTabs
                campaign={currentCampaign}
                restrictedContent={restrictedContent}
              />
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-neutral/5">
                <h3 className="text-lg font-black uppercase tracking-widest mb-6 border-b border-neutral/10 pb-4 text-charcoal">Patron Rewards</h3>
                <div className="space-y-6">
                  {initialRewards.map((reward, idx) => (
                    <div key={idx} className="group p-6 border-2 border-neutral/5 rounded-2xl hover:border-primary/30 transition-all cursor-pointer bg-cream/30">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-3xl font-black text-charcoal">€{reward.amount}</span>
                        <button
                          className="btn btn-xs btn-outline btn-primary opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setRaised(prev => Math.min(prev + reward.amount, goal))}
                        >
                          SELECT
                        </button>
                      </div>
                      <h4 className="font-bold text-lg mb-1 text-charcoal">{reward.title}</h4>
                      <p className="text-sm opacity-60 leading-relaxed text-charcoal">{reward.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <StartCampaignCTA />
      </main>

      <Footer />
    </div>
  );
}
