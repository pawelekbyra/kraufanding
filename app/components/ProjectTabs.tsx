"use client";

import { useState } from "react";
import { Campaign } from "../data/types/campaign";

export const ProjectTabs = ({ campaign }: { campaign: Campaign }) => {
  const [activeTab, setActiveTab] = useState("Story");

  const tabs = ["Story", "Updates", "FAQ", "Community"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex border-b border-white/10 gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === tab ? "text-white" : "text-zinc-500 hover:text-white"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-16 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
          {activeTab === "Story" && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-3xl font-black text-white leading-tight">Empowering the decentralized future.</h2>
              <p className="text-lg leading-relaxed text-zinc-400">
                {campaign.description}
              </p>
              <div className="rounded-3xl overflow-hidden border border-white/10 aspect-video group">
                 <img src={campaign.image} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt="Secret Project" />
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Why Secret Project?</h3>
                <p className="text-zinc-400">
                   Our team at {campaign.author.name} has spent the last five years researching the limits of existing collaboration tools. We discovered that for most organizations, the bottleneck isn&apos;t the skill set but the tools they use. Privacy concerns often lead to slower workflows and fragmented communication.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[
                      { title: "Privacy First", desc: "End-to-end encrypted everything." },
                      { title: "Decentralized", desc: "No central server, no single point of failure." },
                      { title: "Collaborative", desc: "Real-time sync across all devices." },
                      { title: "Open Source", desc: "Verify everything yourself." }
                   ].map((item, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-zinc-900 border border-white/5 space-y-2">
                         <h4 className="font-bold text-white">{item.title}</h4>
                         <p className="text-sm text-zinc-500">{item.desc}</p>
                      </div>
                   ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Updates" && (
            <div className="space-y-10 animate-fade-in">
              {campaign.updates.map((update, i) => (
                <div key={i} className="relative pl-8 border-l border-white/10 space-y-4">
                  <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-zinc-950"></div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{update.date}</p>
                  <h3 className="text-xl font-bold text-white">{update.title}</h3>
                  <p className="text-zinc-400">{update.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-10">
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Select a Reward</h3>
            {campaign.rewards.map((reward) => (
              <div key={reward.id} className="relative group p-6 rounded-2xl bg-zinc-900 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer">
                 <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-white group-hover:text-blue-400">{reward.title}</h4>
                    <span className="text-lg font-black text-white">${reward.amount}</span>
                 </div>
                 <p className="text-sm text-zinc-500 leading-relaxed mb-6 line-clamp-2">{reward.description}</p>
                 <button className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm transition-all hover:bg-zinc-200">Select Reward</button>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 space-y-6 shadow-2xl shadow-blue-500/20">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border-2 border-white/20 overflow-hidden">
                   <img src={campaign.author.avatar} alt="author" className="w-full h-full object-cover" />
                </div>
                <div>
                   <h4 className="font-bold text-white leading-tight">{campaign.author.name}</h4>
                   <p className="text-xs text-white/70">Creator</p>
                </div>
             </div>
             <p className="text-sm text-white/90 leading-relaxed italic">
                &quot;{campaign.author.bio}&quot;
             </p>
             <button className="w-full py-3 rounded-xl bg-black text-white font-bold text-sm transition-all hover:bg-zinc-900">Contact Creator</button>
          </div>
        </aside>
      </div>
    </div>
  );
};
