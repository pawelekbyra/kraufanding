import React from 'react';
import { Campaign } from '../types/campaign';

interface HeroProps {
  campaign: Campaign;
}

const Hero: React.FC<HeroProps> = ({ campaign }) => {
  return (
    <section className="bg-[#FDFBF7] pt-12 pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-[#1a1a1a] mb-4 leading-none">
            {campaign.title}
          </h1>
          <div className="text-lg italic text-[#1a1a1a]/60 font-serif">
            Autor: {campaign.author} • {campaign.category}
          </div>
        </div>

        {/* FEATURED IMAGE */}
        <div className="relative aspect-[21/9] w-full rounded-[3rem] overflow-hidden shadow-2xl border border-[#1a1a1a]/5 mb-12 group">
          <img
            src={campaign.thumbnail}
            alt={campaign.title}
            className="w-full h-full object-cover transform group-hover:scale-[1.02] transition duration-1000"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
