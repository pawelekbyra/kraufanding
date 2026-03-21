'use client';

import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import ProjectTabs from './components/ProjectTabs';
import StartCampaignCTA from './components/StartCampaignCTA';
import Footer from './components/Footer';
import { mockCampaigns } from './data/mock-campaigns';

export default function Home() {
  const campaign = mockCampaigns[0];

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <main>
        <Hero campaign={campaign} />
        <Stats />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="story">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ProjectTabs campaign={campaign} />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="card bg-primary text-primary-content p-8 shadow-2xl">
                  <h3 className="text-2xl font-black mb-4">Wesprzyj teraz</h3>
                  <p className="mb-6 opacity-90 font-medium">Bądź częścią czegoś wielkiego i pomóż nam zmienić świat.</p>
                  <button className="btn btn-secondary btn-block font-black text-lg h-16 rounded-2xl">
                    Wybierz Nagrodę
                  </button>
                </div>

                <div className="card bg-base-200 p-8">
                  <h3 className="text-xl font-black mb-4">Udostępnij projekt</h3>
                  <div className="flex gap-2">
                    <button className="btn btn-circle btn-outline flex-1">FB</button>
                    <button className="btn btn-circle btn-outline flex-1">X</button>
                    <button className="btn btn-circle btn-outline flex-1">LI</button>
                  </div>
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
