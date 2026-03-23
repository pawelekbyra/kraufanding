import React from 'react';
import { Project } from '../types/project';
import { Target, Archive, Sparkles } from 'lucide-react';

interface ProjectStoryProps {
  project: Project;
}

const ProjectStory: React.FC<ProjectStoryProps> = ({ project }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-6 pb-4 border-b border-border">
            O Projekcie
          </h2>

          <div className="space-y-4">
            {project.story?.map((paragraph, index) => (
              <p key={index} className="font-sans text-foreground/80 text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-foreground">Misja</h3>
          </div>
          <p className="font-sans text-foreground/70 leading-relaxed">
            Tworzymy unikalna przestrzen dla tych, ktorzy szukaja prawdy i glebszego zrozumienia otaczajacej nas rzeczywistosci.
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-foreground">Dla Patronow</h3>
          </div>
          <ul className="space-y-3 font-sans text-foreground/70">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              Ekskluzywne materialy wideo
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/30"></span>
              Dostep do tajnego archiwum
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></span>
              Bezposredni wplyw na tresci
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectStory;
