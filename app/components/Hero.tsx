"use client";

import React, { useOptimistic } from 'react';
import { Project } from '../types/project';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from 'lucide-react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { toggleProjectLike, toggleSubscription } from '@/lib/actions/interactions';
import { cn } from '@/lib/utils';
import PremiumWrapper from './PremiumWrapper';

interface HeroProps {
  project: Project & {
    views?: number;
    initialIsLiked?: boolean;
    initialIsSubscribed?: boolean;
    likesCount?: number;
    minTier?: number;
  };
}

const Hero: React.FC<HeroProps> = ({ project }) => {
  const { userId } = useAuth();
  const { openSignIn } = useClerk();

  const [optimisticLike, addOptimisticLike] = useOptimistic(
    { isLiked: project.initialIsLiked, count: project.likesCount || 0 },
    (state, newLiked: boolean) => ({
      isLiked: newLiked,
      count: newLiked ? state.count + 1 : Math.max(0, state.count - 1)
    })
  );

  const [optimisticSub, addOptimisticSub] = useOptimistic(
    project.initialIsSubscribed || false,
    (state, newSub: boolean) => newSub
  );

  const handleLike = async () => {
    if (!userId) return openSignIn();
    addOptimisticLike(!optimisticLike.isLiked);
    try {
      await toggleProjectLike(project.id);
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
    <section className="bg-[#FDFBF7] font-mono">
      <div className="w-full">
        {/* FEATURED MEDIA (VIDEO PLAYER) - BRUTALIST */}
        <div className="relative aspect-video w-full rounded-none overflow-hidden shadow-brutalist border-2 border-black mb-6 group bg-black">
          <PremiumWrapper projectId={project.id} minTier={project.minTier || 0}>
            <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover opacity-90 transition duration-1000"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 bg-primary border-2 border-black rounded-none flex items-center justify-center shadow-brutalist cursor-pointer hover:scale-105 transition-transform pointer-events-auto active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                    <svg className="w-8 h-8 text-black fill-current ml-1" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>
          </PremiumWrapper>
        </div>

        {/* YOUTUBE-STYLE INFO - BRUTALIST */}
        <div className="space-y-4 pt-2">
          <h2 className="text-[22px] font-black text-[#0f0f0f] tracking-tighter leading-tight uppercase bg-black text-white px-3 py-1 w-fit">
            {project.title}
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b-2 border-black border-dashed">
            <div className="flex items-center gap-3 min-w-0">
               <div className="w-10 h-10 rounded-none bg-white border-2 border-black overflow-hidden shrink-0 shadow-brutalist-sm">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.author}`} alt={project.author} className="w-full h-full object-cover" />
               </div>
               <div className="min-w-0 pr-1">
                  <p className="font-black text-[#0f0f0f] text-[14px] leading-tight truncate uppercase tracking-tighter">{project.author}</p>
                  <p className="text-[10px] text-black/50 font-bold uppercase">1.2 M OPS_DATA</p>
               </div>
               <button
                 onClick={handleSubscribe}
                 className={cn(
                    "text-[12px] font-black rounded-none px-4 h-8 flex items-center transition-all ml-1 shrink-0 border-2 border-black shadow-brutalist-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]",
                    optimisticSub
                        ? "bg-white text-black hover:bg-black/5"
                        : "bg-black text-white hover:bg-neutral"
                 )}
               >
                 {optimisticSub ? 'CONNECTED' : 'CONNECT'}
               </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible no-scrollbar">
               <div className="flex items-center border-2 border-black bg-white rounded-none h-8 shrink-0 shadow-brutalist-sm">
                  <button
                    onClick={handleLike}
                    className={cn(
                        "flex items-center gap-2 px-3 h-full hover:bg-black/5 transition-colors border-r-2 border-black",
                        optimisticLike.isLiked && "bg-primary/20"
                    )}
                  >
                     <ThumbsUp size={14} className={cn(optimisticLike.isLiked && "fill-black")} />
                     <span className="text-[12px] font-black">{optimisticLike.count.toLocaleString('pl-PL')}</span>
                  </button>
                  <button className="px-3 h-full hover:bg-black/5 transition-colors">
                     <ThumbsDown size={14} />
                  </button>
               </div>
               <button className="flex items-center gap-2 px-3 h-8 bg-white border-2 border-black rounded-none shadow-brutalist-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all shrink-0">
                  <Share2 size={14} />
                  <span className="text-[12px] font-black uppercase">SHARE</span>
               </button>
               <button className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-none shadow-brutalist-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all shrink-0">
                  <MoreHorizontal size={14} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
