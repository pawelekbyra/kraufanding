import React from 'react';
import { Campaign } from '../types/campaign';

interface HeroProps {
  campaign: Campaign;
}

const Hero: React.FC<HeroProps> = ({ campaign }) => {
  const percentage = campaign.goal > 0
    ? Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100)
    : 0;

  const daysLeft = () => {
    const end = new Date(campaign.endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <section className="relative pt-40 pb-24 overflow-hidden border-b border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black tracking-[0.2em] uppercase">
              🔥 Featured Campaign
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-white leading-[0.9] text-balance">
                {campaign.title}
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed max-w-xl font-medium">
                {campaign.description}
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <span className="block text-3xl font-black text-white">{campaign.raised.toLocaleString()}</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 block">PLN Raised</span>
                </div>
                <div>
                  <span className="block text-3xl font-black text-white">{percentage}%</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 block">Funded</span>
                </div>
                <div>
                  <span className="block text-3xl font-black text-white">{daysLeft()}</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 block">Days Left</span>
                </div>
              </div>

              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] animate-glow transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10">
                Back This Project
              </button>
              <button className="px-10 py-5 bg-white/5 text-white font-black rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 group">
                Follow
                <span className="text-gray-500 group-hover:text-indigo-400 transition-colors">♥</span>
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative rounded-3xl overflow-hidden aspect-video border border-white/10 shadow-2xl">
              <img
                src={campaign.thumbnail}
                alt={campaign.title}
                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
