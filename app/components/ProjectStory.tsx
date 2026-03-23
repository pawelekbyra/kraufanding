import React from 'react';
import { Project } from '../types/project';

interface ProjectStoryProps {
  project: Project;
}

const ProjectStory: React.FC<ProjectStoryProps> = ({ project }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="card bg-base-100 border border-base-200 shadow-xl overflow-hidden group">
        <div className="card-body p-8 sm:p-12">
          <h2 className="card-title text-3xl font-black text-base-content mb-8 border-b border-base-200 pb-6">
            O Projekcie
          </h2>

          <div className="space-y-6">
            {project.story?.map((paragraph, index) => (
              <p key={index} className="text-base-content/70 text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-base-100 border border-base-200 shadow-lg p-8">
          <h3 className="text-xl font-black text-base-content mb-4">Misja</h3>
          <p className="text-base-content/70 leading-relaxed font-medium">
            Tworzymy unikalną przestrzeń dla tych, którzy szukają prawdy i głębszego zrozumienia otaczającej nas rzeczywistości.
          </p>
        </div>
        <div className="card bg-base-100 border border-base-200 shadow-lg p-8">
          <h3 className="text-xl font-black text-base-content mb-4">Dla Patronów</h3>
          <ul className="space-y-3 text-base-content/70 font-bold">
            <li className="flex items-center gap-3">
              <span className="badge badge-primary badge-xs"></span>
              Ekskluzywne materiały wideo
            </li>
            <li className="flex items-center gap-3">
              <span className="badge badge-secondary badge-xs"></span>
              Dostęp do tajnego archiwum
            </li>
            <li className="flex items-center gap-3">
              <span className="badge badge-accent badge-xs"></span>
              Bezpośredni wpływ na treści
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectStory;
