"use client";

import React, { useState, useOptimistic } from 'react';
import { Campaign } from '../types/campaign';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from 'lucide-react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { toggleProjectLike, toggleSubscription } from '@/lib/actions/interactions';
import { cn } from '@/lib/utils';
import PremiumWrapper from './PremiumWrapper';

interface HeroProps {
  campaign: Campaign & {
    views?: number;
    initialIsLiked?: boolean;
    initialIsSubscribed?: boolean;
    likesCount?: number;
    minTier?: number;
  };
}

const Hero: React.FC<HeroProps> = ({ campaign }) => {
  const { userId } = useAuth();
  const { openSignIn } = useClerk();

  const [optimisticLike, addOptimisticLike] = useOptimistic(
    { isLiked: campaign.initialIsLiked, count: campaign.likesCount || 0 },
    (state, newLiked: boolean) => ({
      isLiked: newLiked,
      count: newLiked ? state.count + 1 : Math.max(0, state.count - 1)
    })
  );

  const [optimisticSub, addOptimisticSub] = useOptimistic(
    campaign.initialIsSubscribed || false,
    (state, newSub: boolean) => newSub
  );

  const handleLike = async () => {
    if (!userId) return openSignIn();
    addOptimisticLike(!optimisticLike.isLiked);
    try {
      await toggleProjectLike(campaign.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async () => {
    if (!userId) return openSignIn();
    addOptimisticSub(!optimisticSub);
    try {
      await toggleSubscription();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="bg-[#FDFBF7]">
      <div className="w-full">
        {/* FEATURED MEDIA (VIDEO PLAYER) - SHARPER CORNERS */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-sm border border-[#1a1a1a]/5 mb-3 group bg-black">
          <PremiumWrapper projectId={campaign.id} minTier={campaign.minTier || 0}>
            <img
                src={campaign.thumbnail}
                alt={campaign.title}
                className="w-full h-full object-cover opacity-90 transition duration-1000"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 bg-[#1a1a1a]/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform border border-white/10 pointer-events-auto">
                    <svg className="w-8 h-8 text-white fill-current ml-1" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>
          </PremiumWrapper>
        </div>

        {/* YOUTUBE-STYLE INFO - EXACT SCALE */}
        <div className="space-y-3">
          <h2 className="text-[20px] font-bold text-[#0f0f0f] tracking-tight leading-tight">
            {campaign.title} - Cover (Official Music Video)
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
            <div className="flex items-center gap-3 min-w-0">
               <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 overflow-hidden shrink-0">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${campaign.author}`} alt={campaign.author} className="w-full h-full object-cover" />
               </div>
               <div className="min-w-0 pr-2">
                  <p className="font-bold text-[#0f0f0f] text-[15px] leading-tight truncate">{campaign.author}</p>
                  <p className="text-[11px] text-[#606060] whitespace-nowrap">1.2 M subskrajberów</p>
               </div>
               <button
                 onClick={handleSubscribe}
                 className={cn(
                    "text-[13px] font-bold rounded-full px-4 h-9 flex items-center transition-all ml-1 shrink-0",
                    optimisticSub
                        ? "bg-[#000000]/5 text-[#0f0f0f] hover:bg-[#000000]/10"
                        : "bg-[#0f0f0f] text-white hover:bg-[#272727]"
                 )}
               >
                 {optimisticSub ? 'Subskrajbujesz' : 'Subskrajb'}
               </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible no-scrollbar">
               <div className="flex items-center bg-[#000000]/5 rounded-full h-9 shrink-0">
                  <button
                    onClick={handleLike}
                    className={cn(
                        "flex items-center gap-2 px-3 h-full hover:bg-[#000000]/10 rounded-l-full transition-colors border-r border-black/10",
                        optimisticLike.isLiked && "text-primary"
                    )}
                  >
                     <ThumbsUp size={16} className={cn(optimisticLike.isLiked && "fill-primary")} />
                     <span className="text-[13px] font-bold">{optimisticLike.count.toLocaleString('pl-PL')}</span>
                  </button>
                  <button className="px-3 h-full hover:bg-[#000000]/10 rounded-r-full transition-colors">
                     <ThumbsDown size={16} />
                  </button>
               </div>
               <button className="flex items-center gap-2 px-3 h-9 bg-[#000000]/5 hover:bg-[#000000]/10 rounded-full transition-colors shrink-0">
                  <Share2 size={16} />
                  <span className="text-[13px] font-bold">Udostępnij</span>
               </button>
               <button className="w-9 h-9 flex items-center justify-center bg-[#000000]/5 hover:bg-[#000000]/10 rounded-full transition-colors shrink-0">
                  <MoreHorizontal size={16} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
