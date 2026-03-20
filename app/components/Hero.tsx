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
          <div className="space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider uppercase">
              ✨ Wyróżniony Projekt
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-tight">
              {campaign.title}
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
              {campaign.description}
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-4xl font-black text-white">{campaign.raised.toLocaleString()} PLN</span>
                  <span className="text-gray-500 ml-2">z {campaign.goal.toLocaleString()} PLN</span>
                </div>
                <span className="text-blue-400 font-bold">{percentage}%</span>
              </div>
              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)] animate-glow transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-4 bg-white text-black font-black rounded-xl hover:scale-105 transition-transform">
                Wesprzyj Projekt
              </button>
              <button className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                Udostępnij
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10">
              <img
                src={campaign.thumbnail}
                alt={campaign.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
