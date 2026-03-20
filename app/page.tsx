import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import ProjectTabs from './components/ProjectTabs';
import Rewards from './components/Rewards';
import StartCampaignCTA from './components/StartCampaignCTA';
import Footer from './components/Footer';
import { mockCampaigns } from './data/mock-campaigns';

export default function Home() {
  const featuredCampaign = mockCampaigns.find(c => c.id === 'secret-project') || mockCampaigns[0];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <Hero campaign={featuredCampaign} />
        <Stats />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <ProjectTabs campaign={featuredCampaign} />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-12">
                <Rewards rewards={featuredCampaign.rewards || []} />

                <div className="p-8 bg-indigo-600 rounded-2xl relative overflow-hidden group cursor-pointer shadow-2xl shadow-indigo-500/20">
                  <div className="absolute top-0 right-0 p-4 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform opacity-20">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Chcesz wesprzeć bez nagrody?</h3>
                  <p className="text-indigo-100 mb-6">Pomóż nam zrealizować Secret Project dowolną kwotą wsparcia.</p>
                  <button className="w-full py-4 bg-white text-indigo-600 font-black rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                    Wspieraj dowolną kwotą
                  </button>
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
