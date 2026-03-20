import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CampaignCard from './components/CampaignCard';
import Footer from './components/Footer';
import { mockCampaigns } from './data/mock-campaigns';

export default function Home() {
  const featuredCampaign = mockCampaigns.find(c => c.id === 'secret-project') || mockCampaigns[0];
  const otherCampaigns = mockCampaigns.filter(c => c.id !== featuredCampaign.id);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <Hero campaign={featuredCampaign} />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">Eksploruj Projekty</h2>
              <p className="text-gray-500">Odkryj najciekawsze zbiórki od naszej społeczności.</p>
            </div>
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-md shadow-lg shadow-indigo-500/20 transition-all">
                Wszystkie
              </button>
              <button className="px-4 py-2 text-gray-400 hover:text-white text-sm font-bold rounded-md transition-all">
                Technologia
              </button>
              <button className="px-4 py-2 text-gray-400 hover:text-white text-sm font-bold rounded-md transition-all">
                Ekologia
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all group">
              Zobacz Więcej
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
