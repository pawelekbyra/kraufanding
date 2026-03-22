import React from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { mockCampaigns } from './data/mock-campaigns';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif selection:bg-primary selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">Discover Secret Projects</h1>
          <p className="text-xl italic opacity-70">Empowering confidential innovation and research.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {mockCampaigns.map((campaign) => (
            <Link key={campaign.id} href={`/projects/${campaign.slug}`} className="group">
              <div className="bg-white border border-neutral/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img
                    src={campaign.thumbnail}
                    alt={campaign.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                    {campaign.category}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight group-hover:text-primary transition-colors">{campaign.title}</h3>
                  <p className="text-neutral/60 mb-6 line-clamp-2 italic">{campaign.description}</p>

                  <div className="space-y-4">
                    <div className="h-1 bg-neutral/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="block text-xs font-black uppercase tracking-widest opacity-40">Raised</span>
                        <span className="text-lg font-bold">€{campaign.raised.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-black uppercase tracking-widest opacity-40">Goal</span>
                        <span className="text-lg font-bold">€{campaign.goal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
