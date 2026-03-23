"use client";

import React, { useState } from 'react';
import { Project } from '../types/project';
import ProjectStory from './ProjectStory';
import VideoPlaylist from './VideoPlaylist';
import EmbeddedComments from './comments/EmbeddedComments';
import { useAuth, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

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
      <div className="flex gap-1 mb-8 overflow-x-auto no-scrollbar border-b border-border pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-3 font-sans text-sm font-medium transition-all relative whitespace-nowrap",
              activeTab === tab.id 
                ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
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
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {project.updates?.length ? (
              project.updates.map((update) => (
                <div key={update.id} className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-lg font-semibold text-foreground">{update.title}</h3>
                    <span className="font-sans text-xs text-muted-foreground border border-border px-2 py-1 rounded">{update.date}</span>
                  </div>
                  <p className="font-sans text-foreground/80 leading-relaxed">{update.content}</p>
                </div>
              ))
            ) : (
              <p className="text-center font-sans text-muted-foreground py-12">Brak aktualizacji.</p>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <EmbeddedComments
              entityId={project.id}
              entityType="PROJECT"
              userProfile={userId ? { id: userId, email: user?.primaryEmailAddress?.emailAddress || '' } : null}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTabs;
