"use client";

import React, { useState } from 'react';
import { Project } from '../types/project';
import ProjectStory from './ProjectStory';
import VideoPlaylist from './VideoPlaylist';
import EmbeddedComments from './comments/EmbeddedComments';
import { useAuth, useUser } from '@clerk/nextjs';

interface ProjectTabsProps {
  project: Project;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState('story');
  const { userId } = useAuth();
  const { user } = useUser();

  const tabs = [
    { id: 'story', label: 'O Projekcie' },
    { id: 'donations', label: 'Wesprzyj' },
    { id: 'updates', label: 'Aktualizacje' },
    { id: 'comments', label: 'Komentarze' },
  ];

  return (
    <div className="w-full">
      <div role="tablist" className="tabs tabs-bordered mb-10 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            role="tab"
            onClick={() => setActiveTab(tab.id)}
            className={`tab h-14 text-sm font-black transition-all ${
              activeTab === tab.id ? 'tab-active text-primary border-primary' : 'text-base-content/50 hover:text-base-content'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'story' && <ProjectStory project={project} />}

        {activeTab === 'donations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VideoPlaylist projectId={project.id} />
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {project.updates?.length ? (
              project.updates.map((update) => (
                <div key={update.id} className="card bg-base-100 border border-base-200 shadow-lg p-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-base-content">{update.title}</h3>
                    <div className="badge badge-outline text-xs font-bold">{update.date}</div>
                  </div>
                  <p className="text-base-content/70 leading-relaxed">{update.content}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-base-content/50 py-12">Brak aktualizacji.</p>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <EmbeddedComments
              entityId={project.id}
              entityType="PROJECT"
              userProfile={userId ? {
                id: userId,
                email: user?.primaryEmailAddress?.emailAddress || '',
                imageUrl: user?.imageUrl || null
              } : null}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTabs;
