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
    <section className="bg-transparent animate-fade-in-up">
      <div className="w-full">
        {/* MEDIA PLAYER - ELEGANT BORDERS & SHADOWS */}
        <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-elegant border-4 border-white/50 mb-6 group bg-navy/5">
          <PremiumWrapper projectId={project.id} minTier={project.minTier || 0}>
            <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover opacity-95 transition-all duration-[2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-navy/10 group-hover:bg-transparent transition-colors duration-700"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-all border border-white/40 pointer-events-auto group-hover:bg-gold/90">
                    <svg className="w-10 h-10 text-white fill-current ml-1" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>
          </PremiumWrapper>
        </div>

        {/* METADATA - MODERN REFINED SCALE */}
        <div className="space-y-6 pt-2 px-2">
          <h2 className="text-3xl md:text-4xl font-black text-navy tracking-tight leading-tight uppercase font-serif">
            {project.title}
          </h2>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-navy/5">
            <div className="flex items-center gap-4 min-w-0">
               <div className="w-12 h-12 rounded-full bg-white border-2 border-gold/20 overflow-hidden shrink-0 shadow-soft">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.author}`} alt={project.author} className="w-full h-full object-cover" />
               </div>
               <div className="min-w-0 pr-2">
                  <p className="font-black text-navy text-lg leading-tight truncate font-serif">{project.author}</p>
                  <p className="text-[10px] text-gold font-black uppercase tracking-widest mt-0.5 opacity-60">1.2 M subskrajberów</p>
               </div>
               <button
                 onClick={handleSubscribe}
                 className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] rounded-full px-6 h-10 flex items-center transition-all ml-2 shrink-0 border",
                    optimisticSub
                        ? "bg-navy/5 text-navy border-navy/10 hover:bg-navy/10"
                        : "bg-navy text-white border-navy hover:bg-navy/90 hover:shadow-glow"
                 )}
               >
                 {optimisticSub ? 'Subskrajbujesz' : 'Subskrajbuj'}
               </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto md:overflow-visible no-scrollbar">
               <div className="flex items-center bg-navy/5 rounded-full h-10 shrink-0 p-1 border border-navy/5">
                  <button
                    onClick={handleLike}
                    className={cn(
                        "flex items-center gap-2 px-4 h-full hover:bg-white rounded-l-full transition-all group",
                        optimisticLike.isLiked ? "text-gold" : "text-navy/60 hover:text-gold"
                    )}
                  >
                     <ThumbsUp size={16} className={cn(optimisticLike.isLiked && "fill-gold")} />
                     <span className="text-[11px] font-black uppercase tracking-widest">{optimisticLike.count.toLocaleString('pl-PL')}</span>
                  </button>
                  <div className="w-[1px] h-4 bg-navy/10"></div>
                  <button className="px-4 h-full hover:bg-white rounded-r-full transition-all text-navy/60 hover:text-gold">
                     <ThumbsDown size={16} />
                  </button>
               </div>
               <button className="flex items-center gap-2 px-4 h-10 bg-navy/5 hover:bg-white border border-navy/5 rounded-full transition-all shrink-0 text-navy/60 hover:text-navy">
                  <Share2 size={16} />
                  <span className="text-[11px] font-black uppercase tracking-widest">Udostępnij</span>
               </button>
               <button className="w-10 h-10 flex items-center justify-center bg-navy/5 hover:bg-white border border-navy/5 rounded-full transition-all shrink-0 text-navy/60 hover:text-navy">
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
