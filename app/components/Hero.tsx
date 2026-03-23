"use client";

import React, { useOptimistic } from 'react';
import { Project } from '../types/project';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, Play } from 'lucide-react';
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
    <section className="bg-background">
      <div className="w-full">
        {/* Featured Media Player */}
        <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-border/50 mb-3 group bg-foreground/5">
          <PremiumWrapper projectId={project.id} minTier={project.minTier || 0}>
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-foreground/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform pointer-events-auto group/play">
                <Play className="w-7 h-7 text-background fill-background ml-1 group-hover/play:scale-110 transition-transform" />
              </div>
            </div>
          </PremiumWrapper>
        </div>

        {/* Video Info */}
        <div className="space-y-3 pt-3">
          <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground tracking-tight leading-tight text-balance">
            {project.title}
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            {/* Author Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-secondary border border-border overflow-hidden shrink-0 ring-2 ring-border/50">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.author}`} 
                  alt={project.author} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="min-w-0 pr-1">
                <p className="font-sans font-semibold text-foreground text-[15px] leading-tight truncate">{project.author}</p>
                <p className="font-sans text-xs text-muted-foreground whitespace-nowrap">1.2 M subskrybentow</p>
              </div>
              <button
                onClick={handleSubscribe}
                className={cn(
                  "font-sans text-sm font-semibold rounded-full px-5 h-9 flex items-center transition-all duration-300 ml-1 shrink-0",
                  optimisticSub
                    ? "bg-secondary text-foreground hover:bg-muted border border-border"
                    : "bg-foreground text-background hover:bg-foreground/90"
                )}
              >
                {optimisticSub ? 'Obserwujesz' : 'Obserwuj'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible no-scrollbar">
              <div className="flex items-center bg-secondary rounded-full h-9 shrink-0 border border-border/50">
                <button
                  onClick={handleLike}
                  className={cn(
                    "flex items-center gap-2 px-4 h-full hover:bg-muted rounded-l-full transition-colors border-r border-border/50",
                    optimisticLike.isLiked && "text-accent"
                  )}
                >
                  <ThumbsUp size={16} className={cn("transition-all", optimisticLike.isLiked && "fill-accent")} />
                  <span className="font-sans text-sm font-medium">{optimisticLike.count.toLocaleString('pl-PL')}</span>
                </button>
                <button className="px-3 h-full hover:bg-muted rounded-r-full transition-colors">
                  <ThumbsDown size={16} className="text-foreground/70" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 h-9 bg-secondary hover:bg-muted border border-border/50 rounded-full transition-colors shrink-0">
                <Share2 size={16} className="text-foreground/70" />
                <span className="font-sans text-sm font-medium">Udostepnij</span>
              </button>
              <button className="w-9 h-9 flex items-center justify-center bg-secondary hover:bg-muted border border-border/50 rounded-full transition-colors shrink-0">
                <MoreHorizontal size={16} className="text-foreground/70" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
