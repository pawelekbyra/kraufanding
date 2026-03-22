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
    <div className="bg-white border-2 border-[#1a1a1a]/10 rounded-[2.5rem] p-10 shadow-xl space-y-10 font-serif">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-[#1a1a1a] tracking-tighter uppercase leading-none">
            {raised.toLocaleString()} €
          </h2>
          <p className="text-[#1a1a1a]/50 text-xl italic leading-relaxed">
            zebrane z {goal.toLocaleString()} €
          </p>
        </div>
        <div className="text-right">
          <p className="text-[#1a1a1a]/40 uppercase tracking-widest text-sm font-black mb-1">Cel:</p>
          <p className="text-3xl font-black text-[#1a1a1a] tracking-tight">{goal.toLocaleString()} €</p>
        </div>
      </div>

      <div className="relative h-4 bg-[#1a1a1a]/5 rounded-full overflow-hidden border border-[#1a1a1a]/5">
        <div
          className="absolute inset-y-0 left-0 bg-primary transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-3 gap-8 text-center">
        <div className="space-y-1">
          <p className="text-3xl font-black text-[#1a1a1a] tracking-tighter">{percentage}%</p>
          <p className="text-[#1a1a1a]/40 uppercase tracking-widest text-[10px] font-black italic">zrealizowano</p>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-black text-[#1a1a1a] tracking-tighter">{backers}</p>
          <p className="text-[#1a1a1a]/40 uppercase tracking-widest text-[10px] font-black italic">wspierających</p>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-black text-[#1a1a1a] tracking-tighter">{daysLeft}</p>
          <p className="text-[#1a1a1a]/40 uppercase tracking-widest text-[10px] font-black italic">dni do końca</p>
        </div>
      </div>

      <button className="btn bg-[#1a1a1a] text-[#FDFBF7] hover:bg-primary border-none btn-lg w-full rounded-2xl font-black tracking-widest text-lg shadow-xl shadow-[#1a1a1a]/10 group transition-all duration-500">
        WESPRZYJ PROJEKT
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  );
};

export default Stats;
