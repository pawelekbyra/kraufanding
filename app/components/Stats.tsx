import React from 'react';

interface StatsProps {
  raised: number;
  goal: number;
  backers: number;
  daysLeft: number;
}

const Stats: React.FC<StatsProps> = ({ raised, goal, backers, daysLeft }) => {
  const percentage = Math.round((raised / goal) * 100);

  return (
    <section className="bg-transparent py-4">
      <div className="max-w-7xl mx-auto px-0">
        <div className="stats stats-vertical lg:stats-horizontal shadow-xl w-full bg-white border border-neutral/10 rounded-3xl">
          <div className="stat p-8">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title font-black uppercase tracking-widest text-xs opacity-40">Backers</div>
            <div className="stat-value text-primary font-black">{backers.toLocaleString()}</div>
            <div className="stat-desc font-bold text-neutral/40 uppercase tracking-tighter mt-1">Supporters</div>
          </div>

          <div className="stat p-8">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title font-black uppercase tracking-widest text-xs opacity-40">Time Left</div>
            <div className="stat-value text-secondary font-black">{daysLeft} Days</div>
            <div className="stat-desc font-bold text-neutral/40 uppercase tracking-tighter mt-1">Active Campaign</div>
          </div>

          <div className="stat p-8">
            <div className="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
            </div>
            <div className="stat-title font-black uppercase tracking-widest text-xs opacity-40">Funded</div>
            <div className="stat-value text-accent font-black">{percentage}%</div>
            <div className="stat-desc font-bold text-neutral/40 uppercase tracking-tighter mt-1">Goal: €{goal.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
