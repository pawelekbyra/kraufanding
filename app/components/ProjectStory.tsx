import React from 'react';
import { Project } from '../types/project';

interface ProjectStoryProps {
  project: Project;
}

const ProjectStory: React.FC<ProjectStoryProps> = ({ project }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-mono">
      <div className="card bg-white border-2 border-black shadow-brutalist overflow-hidden group rounded-none">
        <div className="card-body p-8 sm:p-12">
          <h2 className="card-title text-2xl font-black text-black mb-8 border-b-2 border-black border-dashed pb-6 uppercase tracking-tighter">
            FILE_01: PROJECT_OVERVIEW
          </h2>

          <div className="space-y-6">
            {project.story?.map((paragraph, index) => (
              <p key={index} className="text-black/80 text-base leading-relaxed font-bold antialiased">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-white border-2 border-black shadow-brutalist p-8 rounded-none">
          <h3 className="text-lg font-black text-black mb-4 uppercase tracking-widest bg-black text-white px-2 py-0.5 w-fit">MISSION_STATEMENT</h3>
          <p className="text-black/70 leading-relaxed font-bold">
            Establishing a primary node for truth acquisition and deep-level structural analysis of perceived reality.
          </p>
        </div>
        <div className="card bg-white border-2 border-black shadow-brutalist p-8 rounded-none">
          <h3 className="text-lg font-black text-black mb-4 uppercase tracking-widest bg-black text-white px-2 py-0.5 w-fit">UPLINK_BENEFITS</h3>
          <ul className="space-y-4 text-black/70 font-black text-xs">
            <li className="flex items-center gap-3 border-b border-black/5 pb-2">
              <div className="w-2 h-2 bg-primary"></div>
              Ekskluzywne materiały wideo
            </li>
            <li className="flex items-center gap-3 border-b border-black/5 pb-2">
              <div className="w-2 h-2 bg-primary"></div>
              Dostęp do tajnego archiwum
            </li>
            <li className="flex items-center gap-3 border-b border-black/5 pb-2">
              <div className="w-2 h-2 bg-primary"></div>
              Bezpośredni wpływ na treści
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectStory;
