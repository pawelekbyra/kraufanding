import React from 'react';
import { Campaign } from '../types/campaign';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from 'lucide-react';

interface HeroProps {
  campaign: Campaign;
}

const Hero: React.FC<HeroProps> = ({ campaign }) => {
  return (
    <section className="bg-[#FDFBF7]">
      <div className="w-full">
        {/* FEATURED MEDIA (VIDEO PLAYER) - SHARPER CORNERS */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-sm border border-[#1a1a1a]/5 mb-3 group bg-black">
          <img
            src={campaign.thumbnail}
            alt={campaign.title}
            className="w-full h-full object-cover opacity-90 transition duration-1000"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-16 h-16 bg-[#1a1a1a]/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform border border-white/10">
                <svg className="w-8 h-8 text-white fill-current ml-1" viewBox="0 0 24 24">
                   <path d="M8 5v14l11-7z" />
                </svg>
             </div>
          </div>
        </div>

        {/* YOUTUBE-STYLE INFO - SMALLER SCALE */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-[#1a1a1a] tracking-normal leading-tight">
            {campaign.title} - Cover (Official Music Video)
          </h2>

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-3">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 overflow-hidden shrink-0">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${campaign.author}`} alt={campaign.author} />
               </div>
               <div className="min-w-0 pr-4">
                  <p className="font-bold text-[#1a1a1a] text-[15px] leading-tight truncate">{campaign.author}</p>
                  <p className="text-[12px] opacity-60">1.2M subskrybentów</p>
               </div>
               <button className="bg-[#1a1a1a] text-white text-[14px] font-bold rounded-full px-4 py-2 hover:bg-[#1a1a1a]/90 transition-all ml-1">Subskrybuj</button>
            </div>

            <div className="flex items-center gap-2">
               <div className="flex items-center bg-[#1a1a1a]/5 rounded-full p-0.5">
                  <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#1a1a1a]/5 rounded-l-full transition-colors border-r border-[#1a1a1a]/10">
                     <ThumbsUp size={18} />
                     <span className="text-[13px] font-bold">42K</span>
                  </button>
                  <button className="px-3 py-1.5 hover:bg-[#1a1a1a]/5 rounded-r-full transition-colors">
                     <ThumbsDown size={18} />
                  </button>
               </div>
               <button className="flex items-center gap-2 px-4 py-1.5 bg-[#1a1a1a]/5 hover:bg-[#1a1a1a]/10 rounded-full transition-colors">
                  <Share2 size={18} />
                  <span className="text-[13px] font-bold">Udostępnij</span>
               </button>
               <button className="p-2 bg-[#1a1a1a]/5 hover:bg-[#1a1a1a]/10 rounded-full transition-colors">
                  <MoreHorizontal size={18} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
