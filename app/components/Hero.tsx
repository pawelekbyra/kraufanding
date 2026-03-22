import React from 'react';
import { Campaign } from '../types/campaign';
import { ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';

interface HeroProps {
  campaign: Campaign;
}

const Hero: React.FC<HeroProps> = ({ campaign }) => {
  return (
    <section className="bg-[#FDFBF7] pt-12 pb-4">
      <div className="w-full">
        {/* FEATURED MEDIA (VIDEO PLACEHOLDER) */}
        <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#1a1a1a]/5 mb-8 group bg-black">
          <img
            src={campaign.thumbnail}
            alt={campaign.title}
            className="w-full h-full object-cover opacity-80 transition duration-1000"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white fill-current" viewBox="0 0 24 24">
                   <path d="M8 5v14l11-7z" />
                </svg>
             </div>
          </div>
        </div>

        {/* YOUTUBE-STYLE INFO */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-[#1a1a1a] tracking-tight">
            {campaign.title} - Cover (Official Music Video)
          </h2>

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-[#1a1a1a]/5">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 overflow-hidden shrink-0">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${campaign.author}`} alt={campaign.author} />
               </div>
               <div>
                  <p className="font-black text-[#1a1a1a] uppercase text-lg leading-tight">{campaign.author}</p>
                  <p className="text-xs font-bold opacity-40 uppercase tracking-widest italic">1.2M subskrybentów</p>
               </div>
               <button className="btn btn-primary btn-sm rounded-full px-6 font-black uppercase tracking-widest ml-4">Subskrybuj</button>
            </div>

            <div className="flex items-center gap-2">
               <div className="flex items-center bg-[#1a1a1a]/5 rounded-full p-1">
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#1a1a1a]/5 rounded-l-full transition-colors border-r border-[#1a1a1a]/10">
                     <ThumbsUp size={18} />
                     <span className="text-xs font-black">42K</span>
                  </button>
                  <button className="px-4 py-2 hover:bg-[#1a1a1a]/5 rounded-r-full transition-colors">
                     <ThumbsDown size={18} />
                  </button>
               </div>
               <button className="flex items-center gap-2 px-6 py-2 bg-[#1a1a1a]/5 hover:bg-[#1a1a1a]/10 rounded-full transition-colors">
                  <Share2 size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Udostępnij</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
