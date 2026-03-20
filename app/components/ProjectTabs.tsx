'use client';

import React, { useState } from 'react';
import { Campaign } from '../types/campaign';
import ProjectStory from './ProjectStory';

interface ProjectTabsProps {
  campaign: Campaign;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ campaign }) => {
  const [activeTab, setActiveTab] = useState('story');

  const tabs = [
    { id: 'story', label: 'Story' },
    { id: 'updates', label: `Updates (${campaign.updates?.length || 0})` },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="w-full">
      <div className="flex border-b border-white/10 mb-8 sticky top-[64px] bg-black/60 backdrop-blur-md z-30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'story' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProjectStory story={campaign.story || []} />
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
            {campaign.updates?.map((update) => (
              <div key={update.id} className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-indigo-500/30">
                <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                <span className="text-sm font-bold text-indigo-400 mb-2 block">{update.date}</span>
                <h3 className="text-2xl font-black text-white mb-4">{update.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed">{update.content}</p>
              </div>
            ))}
            {(!campaign.updates || campaign.updates.length === 0) && (
              <p className="text-gray-500 text-center py-20">No updates yet. Stay tuned!</p>
            )}
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            {campaign.faqs?.map((faq) => (
              <div key={faq.id} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
            {(!campaign.faqs || campaign.faqs.length === 0) && (
              <p className="text-gray-500 text-center py-20">No questions yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTabs;
