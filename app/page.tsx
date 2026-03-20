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

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8">
              <div id="story">
                <ProjectTabs campaign={campaign} />
              </div>
            </div>

            <aside className="lg:col-span-4 h-fit">
              <div id="rewards">
                <Rewards rewards={campaign.rewards} />
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
