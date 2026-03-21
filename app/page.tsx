'use client';

import React, { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [raised, setRaised] = useState(6500);
  const goal = 10000;
  const progress = (raised / goal) * 100;

  const donate = () => {
    setRaised(prev => Math.min(prev + 10, goal));
  };

  const donateFixed = (amount: number) => {
    setRaised(prev => Math.min(prev + amount, goal));
  };

  const tabs = [
    { title: 'Story', content: 'Long story about the project. This is where we describe our vision, our goals, and how we plan to achieve them. We appreciate every supporter who joins us on this journey.' },
    { title: 'Updates', content: 'Latest updates: We have reached 65% of our goal! Thank you for your support. Stay tuned for more news soon.' },
    { title: 'Comments', content: 'Supporter comments will appear here. Be the first to leave a message!' }
  ];

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2">I raise money for my secret project</h1>
          <p className="text-xl opacity-70">Support the next big thing.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card bg-base-100 shadow-xl overflow-hidden">
              <figure>
                <img src="https://picsum.photos/1000/400" alt="Project Hero" className="w-full object-cover h-64" />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-2xl">About Project</h2>
                <p>This is a secret project. Support now to be part of something big.</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div role="tablist" className="tabs tabs-bordered mb-4">
                  {tabs.map((tab, index) => (
                    <button
                      key={index}
                      role="tab"
                      className={`tab text-lg font-semibold gap-2 ${activeTab === index ? 'tab-active' : ''}`}
                      onClick={() => setActiveTab(index)}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>
                <div className="mt-6 p-6 bg-base-50 rounded-2xl min-h-[150px] border border-base-200">
                  <p className="text-lg leading-relaxed">{tabs[activeTab].content}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl border-t-8 border-primary">
              <div className="card-body">
                <h3 className="text-2xl font-black mb-4 uppercase tracking-wider">Funding</h3>
                <progress className="progress progress-primary w-full h-6 mb-4 shadow-inner" value={progress} max="100"></progress>
                <div className="flex flex-col mb-8">
                  <span className="text-5xl font-black text-primary mb-1">€{raised.toLocaleString()}</span>
                  <span className="text-lg opacity-60 font-bold uppercase tracking-tighter">raised of €{goal.toLocaleString()}</span>
                </div>
                <button className="btn btn-primary btn-lg btn-block text-xl font-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform" onClick={donate}>
                  BACK THIS PROJECT
                </button>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="text-xl font-bold mb-4">Rewards</h3>
                <div className="space-y-4">
                  {[
                    { amount: 10, title: 'Thank you email', desc: 'A personal thank you from the team.' },
                    { amount: 50, title: 'Early access', desc: 'Get to see the project before anyone else.' },
                    { amount: 100, title: 'VIP supporter', desc: 'Your name in the credits and more.' }
                  ].map((reward, idx) => (
                    <div key={idx} className="p-4 border border-base-300 rounded-xl hover:bg-base-200 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold">€{reward.amount}</span>
                        <button className="btn btn-sm btn-outline btn-primary" onClick={() => donateFixed(reward.amount)}>Select</button>
                      </div>
                      <h4 className="font-bold">{reward.title}</h4>
                      <p className="text-sm opacity-70">{reward.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
