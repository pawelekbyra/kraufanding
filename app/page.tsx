'use client';

import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [raised, setRaised] = useState(6520);
  const goal = 10000;
  const progress = (raised / goal) * 100;

  const donate = () => {
    setRaised(prev => Math.min(prev + 10, goal));
  };

  const donateFixed = (amount: number) => {
    setRaised(prev => Math.min(prev + amount, goal));
  };

  const tabs = [
    {
      title: 'Story',
      content: (
        <div className="prose prose-lg leading-relaxed font-serif text-charcoal max-w-none">
          <p>
            Welcome to the inner circle of <strong>POLUTEK.PL</strong>. This isn&apos;t just a project; it&apos;s a movement towards
            uncompromising transparency and shared success. We&apos;ve built this space for those who value
            authenticity over polish.
          </p>
          <p>
            Our vision is simple: create a platform where supporters aren&apos;t just spectators, but active
            participants in the journey. By joining us, you&apos;re securing early access to our most
            ambitious developments.
          </p>

          <SignedIn>
            <div className="mt-8 p-6 bg-primary/5 border-2 border-primary/20 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <h3 className="text-primary font-bold mb-4">Exclusive Patron Content</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video bg-neutral/10 rounded-xl flex items-center justify-center relative overflow-hidden group">
                  <img src="https://picsum.photos/seed/secret1/600/400" alt="Secret Video 1" className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary text-white p-3 rounded-full shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="aspect-video bg-neutral/10 rounded-xl flex items-center justify-center relative overflow-hidden group">
                  <img src="https://picsum.photos/seed/secret2/600/400" alt="Secret Video 2" className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform" />
                   <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary text-white p-3 rounded-full shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm italic opacity-70 italic text-center">These private materials are hosted securely on Vercel Blob.</p>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="mt-8 p-8 bg-cream border-2 border-dashed border-neutral/20 rounded-2xl flex flex-col items-center text-center shadow-inner">
              <div className="w-16 h-16 bg-neutral/5 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-40">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Restricted Content</h3>
              <p className="mb-6 opacity-70">
                Log in to see exclusive project videos, behind-the-scenes graphics, and
                detailed development updates reserved for our patrons.
              </p>
              <SignInButton mode="modal">
                <button className="btn btn-primary px-8">Sign In to Unlock</button>
              </SignInButton>
            </div>
          </SignedOut>
        </div>
      )
    },
    { title: 'Updates', content: <p className="prose prose-lg font-serif">Latest updates: We have reached 65% of our goal! Thank you for your support. Stay tuned for more news soon.</p> },
    { title: 'Comments', content: <p className="prose prose-lg font-serif italic opacity-60">Supporter comments will appear here. Be the first to leave a message!</p> }
  ];

  return (
    <div className="min-h-screen bg-cream text-charcoal">
      {/* TOPBAR */}
      <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-neutral/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter uppercase">
            POLUTEK<span className="text-primary">.PL</span>
          </div>
          <div>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn btn-ghost btn-sm font-bold uppercase tracking-widest">Sign In</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral/5">
              <figure className="aspect-[21/9] relative overflow-hidden">
                <img
                  src="https://picsum.photos/1200/600"
                  alt="Project Hero"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </figure>
              <div className="p-8 md:p-12">
                <h2 className="text-4xl font-black mb-4 tracking-tight">About Project</h2>
                <p className="text-xl opacity-80 leading-relaxed font-serif">
                  This is a secret project with global ambitions. By supporting us now, you are
                  claiming your stake in the next big revolution. Secure, transparent, and
                  community-driven.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div role="tablist" className="tabs tabs-lifted">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    role="tab"
                    className={`tab text-lg font-bold h-12 [--tab-bg:#FDFBF7] ${activeTab === index ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab(index)}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
              <div className="bg-white p-8 md:p-12 rounded-3xl border border-neutral/5 shadow-xl min-h-[400px]">
                {tabs[activeTab].content}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8 lg:sticky lg:top-28 self-start">
            <div className="bg-white p-8 rounded-3xl shadow-2xl border-t-8 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-black uppercase tracking-[0.2em] mb-6 opacity-40">Funding Progress</h3>
              <progress className="progress progress-primary w-full h-4 mb-6" value={progress} max="100"></progress>
              <div className="flex flex-col mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-charcoal">€{raised.toLocaleString()}</span>
                  <span className="text-xl font-bold opacity-40">EUR</span>
                </div>
                <span className="text-sm font-bold uppercase tracking-widest opacity-60 mt-2">Raised of €{goal.toLocaleString()} goal</span>
              </div>
              <button
                className="btn btn-primary btn-lg btn-block text-xl font-black tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                onClick={donate}
              >
                BACK THIS PROJECT
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-neutral/5">
              <h3 className="text-lg font-black uppercase tracking-widest mb-6 border-b border-neutral/10 pb-4">Patron Rewards</h3>
              <div className="space-y-6">
                {[
                  { amount: 10, title: 'Support Tier', desc: 'A personal thank you and digital badge.' },
                  { amount: 50, title: 'Patron Tier', desc: 'Early access to project insights and updates.' },
                  { amount: 100, title: 'VIP Founder', desc: 'Exclusive voting rights and lifetime status.' }
                ].map((reward, idx) => (
                  <div key={idx} className="group p-6 border-2 border-neutral/5 rounded-2xl hover:border-primary/30 transition-all cursor-pointer bg-cream/30">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-3xl font-black">€{reward.amount}</span>
                      <button
                        className="btn btn-xs btn-outline btn-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => donateFixed(reward.amount)}
                      >
                        SELECT
                      </button>
                    </div>
                    <h4 className="font-bold text-lg mb-1">{reward.title}</h4>
                    <p className="text-sm opacity-60 leading-relaxed">{reward.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-charcoal text-white py-20 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-3xl font-black tracking-tighter mb-8">POLUTEK.PL</div>
          <p className="opacity-50 max-w-md mx-auto leading-relaxed">
            The next generation of community-supported innovation.
            Join us in building something remarkable.
          </p>
        </div>
      </footer>
    </div>
  );
}
