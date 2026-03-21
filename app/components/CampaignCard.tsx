import React from 'react';
import { Campaign } from '../types/campaign';
import Image from 'next/image';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const percentage = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);

  return (
    <div className="group bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all hover:bg-zinc-900 shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={campaign.thumbnail}
          alt={campaign.title}
          fill
          className="object-cover transform group-hover:scale-110 transition duration-700"
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest text-white/80 border border-white/10">
          {campaign.category}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {campaign.title}
          </h3>
          <p className="text-gray-500 text-sm mt-1">przez <span className="text-gray-400 font-medium">{campaign.author}</span></p>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 min-h-[40px]">
          {campaign.description}
        </p>

        <div className="space-y-2">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs font-bold">
            <div className="flex flex-col">
              <span className="text-white">{percentage}%</span>
              <span className="text-gray-500 uppercase tracking-tighter text-[10px]">Zebrano</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-white">{campaign.raised.toLocaleString()} PLN</span>
              <span className="text-gray-500 uppercase tracking-tighter text-[10px]">Kwota</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
