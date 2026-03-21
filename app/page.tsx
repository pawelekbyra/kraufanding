'use client';

import React from 'react';
import Link from 'next/link';
import { mockCampaigns } from './data/mock-campaigns';

export default function Home() {
  return (
    <div className="min-h-screen bg-cream text-charcoal py-20 font-serif">
      <main className="max-w-6xl mx-auto px-4">
        <header className="mb-20 text-center">
          <h1 className="text-6xl font-black mb-6 tracking-tighter uppercase leading-none">
            POLUTEK<span className="text-primary">.PL</span>
          </h1>
          <p className="text-2xl opacity-60 max-w-2xl mx-auto leading-relaxed italic">
            A hybrid platform combining crowdfunding, subscriptions, and premium content protection.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {mockCampaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/campaigns/${campaign.id}`}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral/5 hover:shadow-2xl transition-all duration-500"
            >
              <figure className="aspect-[16/9] relative overflow-hidden">
                <img
                  src={campaign.thumbnail}
                  alt={campaign.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  {campaign.category}
                </div>
              </figure>
              <div className="p-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-40">{campaign.author}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Active</span>
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight uppercase group-hover:text-primary transition-colors line-clamp-2">
                  {campaign.title}
                </h3>
                <p className="text-sm opacity-60 leading-relaxed line-clamp-3 mb-8">
                  {campaign.description}
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-1">
                    <span>{Math.round((campaign.raised / campaign.goal) * 100)}% Funded</span>
                    <span className="opacity-40">€{campaign.raised.toLocaleString()} / €{campaign.goal.toLocaleString()}</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full h-2"
                    value={(campaign.raised / campaign.goal) * 100}
                    max="100"
                  ></progress>
                </div>
              </div>
            </Link>
          ))}

          <div className="bg-neutral/5 rounded-3xl border-2 border-dashed border-neutral/10 flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:bg-neutral/10 transition-colors">
            <div className="w-16 h-16 bg-neutral/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-40">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight mb-2">Start a Project</h3>
            <p className="text-sm opacity-40 max-w-[200px]">Bring your ambitious idea to life with POLUTEK.PL</p>
          </div>
        </section>
      </main>
    </div>
  );
}
