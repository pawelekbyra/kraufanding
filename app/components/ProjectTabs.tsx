"use client";

import React, { useState } from 'react';
import { Campaign } from '../types/campaign';
import ProjectStory from './ProjectStory';

interface ProjectTabsProps {
  campaign: Campaign;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ campaign }) => {
  const [activeTab, setActiveTab] = useState<'story' | 'updates' | 'faq'>('story');

  const tabs = [
    { id: 'story', label: 'Story' },
    { id: 'updates', label: `Updates (${campaign.updates?.length || 0})` },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="w-full">
      <div className="flex border-b border-white/10 mb-8 sticky top-16 bg-zinc-950/80 backdrop-blur-md z-20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 text-sm font-bold transition-all relative ${
              activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'story' && campaign.story && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProjectStory story={campaign.story} />
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {campaign.updates && campaign.updates.length > 0 ? (
              campaign.updates.map((update) => (
                <div key={update.id} className="glass-card p-8 rounded-2xl">
                  <span className="text-sm font-bold text-indigo-400">{update.date}</span>
                  <h3 className="text-2xl font-black mt-2 mb-4">{update.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{update.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No updates available yet.</p>
            )}
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {campaign.faqs && campaign.faqs.length > 0 ? (
              campaign.faqs.map((faq) => (
                <div key={faq.id} className="glass-card p-6 rounded-xl border-l-4 border-l-indigo-500">
                  <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No FAQs available yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTabs;
