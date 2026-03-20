"use client";

import React, { useState } from 'react';
import { Campaign } from '../types/campaign';
import ProjectStory from './ProjectStory';
import Rewards from './Rewards';

interface ProjectTabsProps {
  campaign: Campaign;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ campaign }) => {
  const [activeTab, setActiveTab] = useState('story');

  const tabs = [
    { id: 'story', label: 'Story' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'updates', label: 'Updates' },
    { id: 'comments', label: 'Comments' },
  ];

  return (
    <div className="w-full">
      <div className="flex border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'story' && <ProjectStory campaign={campaign} />}

        {activeTab === 'rewards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Rewards rewards={campaign.rewards || []} />
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="space-y-8">
            {campaign.updates?.length ? (
              campaign.updates.map((update) => (
                <div key={update.id} className="glass-card p-8 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{update.title}</h3>
                    <span className="text-sm text-gray-500 font-medium">{update.date}</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{update.content}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-12">No updates yet.</p>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-8">
            {campaign.comments?.length ? (
              campaign.comments.map((comment) => (
                <div key={comment.id} className="glass-card p-8 rounded-2xl space-y-4">
                  <div className="flex items-center gap-4">
                    {comment.avatar && (
                      <img src={comment.avatar} alt={comment.author} className="w-12 h-12 rounded-full border border-white/10" />
                    )}
                    <div>
                      <h4 className="font-bold text-white">{comment.author}</h4>
                      <p className="text-xs text-gray-500">{comment.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-12">No comments yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTabs;
