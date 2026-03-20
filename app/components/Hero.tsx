import React from 'react';
import { Campaign } from '../types/campaign';

interface HeroProps {
  campaign: Campaign;
}

const Hero: React.FC<HeroProps> = ({ campaign }) => {
  const percentage = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);

  return (
    <section className="hero min-h-[60vh] bg-base-100 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none -z-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="hero-content max-w-7xl flex-col lg:flex-row-reverse gap-12 py-12">
        <div className="relative group w-full lg:w-1/2">
          <div className="absolute -inset-2 bg-primary/20 rounded-3xl blur-2xl group-hover:bg-primary/30 transition duration-1000"></div>
          <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-200">
            <figure className="aspect-[16/10]">
              <img
                src={campaign.thumbnail}
                alt={campaign.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
              />
            </figure>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
              <div className="avatar-group -space-x-6 rtl:space-x-reverse bg-base-100/80 backdrop-blur-md p-1 rounded-full border border-base-300">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="avatar border-2 border-base-100">
                    <div className="w-10">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Backer" />
                    </div>
                  </div>
                ))}
                <div className="avatar placeholder border-2 border-base-100">
                  <div className="bg-neutral text-neutral-content w-10">
                    <span className="text-xs">+1.2k</span>
                  </div>
                </div>
              </div>
              <div className="badge badge-primary font-black uppercase tracking-wider p-3">
                {campaign.category}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <div className="badge badge-outline badge-primary font-black tracking-widest uppercase py-4 px-6 gap-2">
            ✨ Wyróżniony Projekt
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-base-content leading-tight">
            {campaign.title}
          </h1>
          <p className="text-xl text-base-content/70 leading-relaxed max-w-xl">
            {campaign.description}
          </p>

          <div className="card bg-base-100 border border-base-200 shadow-lg p-6 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-4xl font-black text-primary">{campaign.raised.toLocaleString()} PLN</span>
                <span className="text-base-content/50 ml-2 font-medium">z {campaign.goal.toLocaleString()} PLN</span>
              </div>
              <span className="text-primary font-black text-xl">{percentage}%</span>
            </div>

            <progress
              className="progress progress-primary h-4 shadow-inner"
              value={percentage}
              max="100"
            ></progress>

            <div className="flex justify-between text-xs font-bold text-base-content/50 uppercase tracking-widest">
              <span>{campaign.raised.toLocaleString()} Zebrano</span>
              <span>Cel: {campaign.goal.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="btn btn-primary btn-lg rounded-2xl px-12 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all font-black">
              Wesprzyj Projekt
            </button>
            <button className="btn btn-outline btn-lg rounded-2xl px-12 hover:scale-105 active:scale-95 transition-all font-black">
              Udostępnij
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
