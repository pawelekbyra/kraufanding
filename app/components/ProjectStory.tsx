import React from 'react';
import { Campaign } from '../types/campaign';

interface ProjectStoryProps {
  campaign: Campaign;
}

const ProjectStory: React.FC<ProjectStoryProps> = ({ campaign }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="glass-card p-10 rounded-3xl border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -z-10 group-hover:bg-blue-600/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl -z-10 group-hover:bg-indigo-600/20 transition-all duration-700"></div>

        <h2 className="text-3xl font-black text-white mb-8 border-b border-white/5 pb-6">O Projekcie</h2>

        <div className="space-y-6">
          {campaign.story?.map((paragraph, index) => (
            <p key={index} className="text-gray-400 text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-2xl border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Dlaczego my?</h3>
          <p className="text-gray-400 leading-relaxed">
            Nasz zespół składa się z pasjonatów i ekspertów w dziedzinie technologii,
            którzy dążą do wprowadzenia realnych zmian w sposobie korzystania z urządzeń cyfrowych.
          </p>
        </div>
        <div className="glass-card p-8 rounded-2xl border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Plan Działania</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Zakończenie fazy prototypowania
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Rozpoczęcie masowej produkcji
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Wysyłka pierwszych zamówień
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectStory;
