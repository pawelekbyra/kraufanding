import React from 'react';
import { Campaign } from '../types/campaign';

interface ProjectStoryProps {
  campaign: Campaign;
}

const ProjectStory: React.FC<ProjectStoryProps> = ({ campaign }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="card bg-base-100/40 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden group">
        <div className="card-body p-8 sm:p-12">
          <h2 className="card-title text-3xl font-black text-base-content mb-8 border-b border-base-200 pb-6">
            O Projekcie
          </h2>

          <div className="space-y-6">
            {campaign.story?.map((paragraph, index) => (
              <p key={index} className="text-base-content/70 text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-base-100/40 backdrop-blur-md border border-white/10 shadow-lg p-8">
          <h3 className="text-xl font-black text-base-content mb-4">Dlaczego my?</h3>
          <p className="text-base-content/70 leading-relaxed font-medium">
            Nasz zespół składa się z pasjonatów i ekspertów w dziedzinie technologii,
            którzy dążą do wprowadzenia realnych zmian w sposobie korzystania z urządzeń cyfrowych.
          </p>
        </div>
        <div className="card bg-base-100/40 backdrop-blur-md border border-white/10 shadow-lg p-8">
          <h3 className="text-xl font-black text-base-content mb-4">Plan Działania</h3>
          <ul className="space-y-3 text-base-content/70 font-bold">
            <li className="flex items-center gap-3">
              <span className="badge badge-primary badge-xs"></span>
              Zakończenie fazy prototypowania
            </li>
            <li className="flex items-center gap-3">
              <span className="badge badge-secondary badge-xs"></span>
              Rozpoczęcie masowej produkcji
            </li>
            <li className="flex items-center gap-3">
              <span className="badge badge-accent badge-xs"></span>
              Wysyłka pierwszych zamówień
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectStory;
