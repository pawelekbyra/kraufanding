"use client";

import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import ProjectTabs from "./components/ProjectTabs";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { mockCampaigns } from "./data/mock-campaigns";
import { Campaign } from "./types/campaign";

export default function Home() {
  const [campaign, setCampaign] = useState<Campaign>(mockCampaigns[0]);

  const handleDonate = () => {
    const amount = prompt("Enter donation amount (PLN):");
    if (!amount || isNaN(Number(amount))) return;

    setCampaign(prev => {
      return {
        ...prev,
        raised: prev.raised + parseInt(amount)
      };
    });
  };

  return (
    <div className="min-h-screen bg-base-100 font-sans selection:bg-primary selection:text-primary-content">
      <Navbar />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Hero campaign={campaign} />

          <div className="mt-20">
            <ProjectTabs campaign={campaign} />
          </div>
        </div>
      </main>

      <Footer />

      {/* Floating Action Button for mobile support */}
      <div className="fixed bottom-8 right-8 z-50 lg:hidden">
        <button
          onClick={handleDonate}
          className="btn btn-primary btn-circle btn-lg shadow-2xl animate-bounce"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
