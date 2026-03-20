import React from 'react';
import { Campaign } from '../types/campaign';

interface HeroProps {
  campaign: Campaign;
}

const Hero: React.FC<HeroProps> = ({ campaign }) => {
  const percentage = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black tracking-widest uppercase">
              ✨ Wyróżniony Projekt
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-tight">
              {campaign.title}
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
              {campaign.description}
            </p>

            <div className="space-y-4 glass-card p-6 rounded-2xl border-white/5 shadow-2xl">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-4xl font-black text-white">{campaign.raised.toLocaleString()} PLN</span>
                  <span className="text-gray-500 ml-2 font-medium">z {campaign.goal.toLocaleString()} PLN</span>
                </div>
                <span className="text-blue-400 font-black text-xl">{percentage}%</span>
              </div>
              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full animate-glow transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                <span>{campaign.raised.toLocaleString()} Zebrano</span>
                <span>Cel: {campaign.goal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-white/20 active:scale-95">
                Wesprzyj Projekt
              </button>
              <button className="px-10 py-5 bg-white/5 text-white font-black rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:border-white/20 active:scale-95">
                Udostępnij
              </button>
            </div>
          </div>

          <div className="relative group animate-in fade-in slide-in-from-right duration-1000 delay-200">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative rounded-3xl overflow-hidden aspect-[16/10] border border-white/10 shadow-2xl">
              <img
                src={campaign.thumbnail}
                alt={campaign.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/100?u=${i}`}
                      className="w-10 h-10 rounded-full border-2 border-zinc-950"
                      alt="Backer"
                    />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-indigo-600 flex items-center justify-center text-[10px] font-bold">
                    +1.2k
                  </div>
                </div>
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-white uppercase tracking-widest">
                  {campaign.category}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
