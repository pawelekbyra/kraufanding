'use client';

import React from 'react';
import { ArrowRight, Target, Users, Clock } from 'lucide-react';

interface StatsProps {
  raised: number;
  goal: number;
  backers: number;
  daysLeft: number;
  compact?: boolean;
}

const Stats: React.FC<StatsProps> = ({ raised, goal, backers, daysLeft, compact }) => {
  const percentage = Math.round((raised / goal) * 100);

  const scrollToRewards = () => {
    const rewardsSection = document.getElementById('rewards');
    if (rewardsSection) {
      rewardsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (compact) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
             <div>
                <h2 className="font-serif text-2xl font-semibold text-foreground tracking-tight leading-none">
                  {raised.toLocaleString('pl-PL')} EUR
                </h2>
                <p className="font-sans text-xs text-muted-foreground mt-1">
                  z {goal.toLocaleString('pl-PL')} EUR
                </p>
             </div>
             <div className="h-10 w-px bg-border hidden md:block"></div>
             <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="font-serif text-xl font-semibold text-foreground">{percentage}%</p>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground">Cel</p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-xl font-semibold text-foreground">{backers}</p>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground">Ludzi</p>
                </div>
             </div>
          </div>
          <button
            onClick={scrollToRewards}
            className="bg-foreground text-background font-sans text-sm font-semibold uppercase tracking-wider px-6 py-2.5 rounded-lg hover:bg-accent transition-all w-full md:w-auto"
          >
            Wesprzyj
          </button>
        </div>

        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="font-serif text-4xl font-semibold text-foreground tracking-tight leading-none">
            {raised.toLocaleString('pl-PL')} EUR
          </h2>
          <p className="font-sans text-muted-foreground leading-relaxed">
            zebrane z {goal.toLocaleString('pl-PL')} EUR
          </p>
        </div>
        <div className="text-right">
          <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1">Cel:</p>
          <p className="font-serif text-2xl font-semibold text-foreground">{goal.toLocaleString('pl-PL')} EUR</p>
        </div>
      </div>

      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="text-center p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Target size={16} className="text-accent" />
          </div>
          <p className="font-serif text-2xl font-semibold text-foreground">{percentage}%</p>
          <p className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground">zrealizowano</p>
        </div>
        <div className="text-center p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Users size={16} className="text-accent" />
          </div>
          <p className="font-serif text-2xl font-semibold text-foreground">{backers}</p>
          <p className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground">wspierajacych</p>
        </div>
        <div className="text-center p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Clock size={16} className="text-accent" />
          </div>
          <p className="font-serif text-2xl font-semibold text-foreground">{daysLeft}</p>
          <p className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground">dni do konca</p>
        </div>
      </div>

      <button
        onClick={scrollToRewards}
        className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-sans text-sm font-semibold uppercase tracking-wider py-4 rounded-lg hover:bg-accent transition-all duration-300 group"
      >
        Wesprzyj Projekt
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default Stats;
