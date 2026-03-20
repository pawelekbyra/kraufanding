import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import ProjectTabs from './components/ProjectTabs';
import Rewards from './components/Rewards';
import Footer from './components/Footer';
import { mockCampaigns } from './data/mock-campaigns';

export default function Home() {
  const campaign = mockCampaigns.find(c => c.id === 'secret-project') || mockCampaigns[0];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <Hero campaign={campaign} />
        <Stats />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12" id="story">
              <ProjectTabs campaign={campaign} />
            </div>

            <aside className="lg:col-span-1" id="rewards">
              <Rewards rewards={campaign.rewards || []} />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
