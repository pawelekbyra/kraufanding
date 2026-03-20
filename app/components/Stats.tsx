import React from 'react';

const Stats = () => {
  return (
    <section className="bg-base-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="stats stats-vertical lg:stats-horizontal shadow-xl w-full bg-base-100 border border-base-200">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title font-bold uppercase tracking-widest text-xs">Wspierających</div>
            <div className="stat-value text-primary">1,240</div>
            <div className="stat-desc font-medium">Jan 1st - Feb 1st</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title font-bold uppercase tracking-widest text-xs">Czas do końca</div>
            <div className="stat-value text-secondary">14 dni</div>
            <div className="stat-desc font-medium">Do 15 marca 2025</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
            </div>
            <div className="stat-title font-bold uppercase tracking-widest text-xs">Zrealizowano</div>
            <div className="stat-value text-accent">85%</div>
            <div className="stat-desc font-medium">Cel: 100,000 PLN</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
