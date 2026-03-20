'use client';

import React, { useState } from 'react';
import { Campaign } from '../types/campaign';
import ProjectStory from './ProjectStory';

interface ProjectTabsProps {
  campaign: Campaign;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ campaign }) => {
  const [activeTab, setActiveTab] = useState<'story' | 'updates' | 'faq'>('story');

  const tabs = [
    { id: 'story', label: 'Opis' },
    { id: 'updates', label: `Aktualizacje (${campaign.updates?.length || 0})` },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex border-b border-white/10 sticky top-[88px] bg-black/80 backdrop-blur-xl z-20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-5 text-sm font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-blue-400' : 'text-gray-500 hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'story' && <ProjectStory story={campaign.story || []} />}

        {activeTab === 'updates' && (
          <div className="space-y-12">
             <h2 className="text-3xl font-black text-white mb-8 border-l-4 border-indigo-600 pl-4">Aktualizacje</h2>
             <div className="space-y-8">
               {campaign.updates?.map((update, index) => (
                 <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4 hover:border-blue-500/30 transition-colors">
                   <div className="flex justify-between items-center">
                     <h3 className="text-xl font-bold text-white">{update.title}</h3>
                     <span className="text-sm text-blue-400 font-mono uppercase tracking-tighter">{update.date}</span>
                   </div>
                   <p className="text-gray-400 leading-relaxed">{update.content}</p>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-12">
             <h2 className="text-3xl font-black text-white mb-8 border-l-4 border-purple-600 pl-4">Często Zadawane Pytania</h2>
             <div className="space-y-6">
               {campaign.faqs?.map((faq, index) => (
                 <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
                   <h3 className="text-lg font-black text-white">Q: {faq.question}</h3>
                   <div className="h-px bg-white/10 w-full"></div>
                   <p className="text-gray-400 leading-relaxed italic">A: {faq.answer}</p>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTabs;
