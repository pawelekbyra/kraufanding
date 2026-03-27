"use client";

import React, { useOptimistic, useState, useEffect, useTransition } from 'react';
import { Video } from '../types/video';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from 'lucide-react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import PremiumWrapper from './PremiumWrapper';
import Link from 'next/link';
import SubscribeButton from './SubscribeButton';
import VideoPlayer from './VideoPlayer';
import { toggleVideoLike, toggleVideoDislike } from '@/lib/actions/interactions';
import { useLanguage } from './LanguageContext';

interface HeroProps {
  video: Video;
  initialInteraction?: { liked: boolean; disliked: boolean };
  initialIsSubscribed?: boolean;
}

const Hero: React.FC<HeroProps> = ({ video, initialInteraction, initialIsSubscribed }) => {
  const { t, language } = useLanguage();
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [optimisticState, addOptimisticAction] = useOptimistic(
    {
        isLiked: (userId ? initialInteraction?.liked : false) || false,
        isDisliked: (userId ? initialInteraction?.disliked : false) || false,
        likesCount: video.likesCount || 0,
        dislikesCount: video.dislikesCount || 0
    },
    (state, action: 'LIKE' | 'DISLIKE') => {
      if (action === 'LIKE') {
        const wasLiked = state.isLiked;
        const wasDisliked = state.isDisliked;
        return {
          isLiked: !wasLiked,
          isDisliked: false,
          likesCount: wasLiked ? state.likesCount - 1 : state.likesCount + 1,
          dislikesCount: wasDisliked ? state.dislikesCount - 1 : state.dislikesCount
        };
      } else {
        const wasLiked = state.isLiked;
        const wasDisliked = state.isDisliked;
        return {
          isLiked: false,
          isDisliked: !wasDisliked,
          likesCount: wasLiked ? state.likesCount - 1 : state.likesCount,
          dislikesCount: wasDisliked ? state.dislikesCount - 1 : state.dislikesCount + 1
        };
      }
    }
  );

  const handleLike = async () => {
    if (!userId) return openSignIn();
    if (isPending) return;

    startTransition(async () => {
        try {
            addOptimisticAction('LIKE');
            const result = await toggleVideoLike(video.id) as any;
            if (result?.error === 'AUTH_REQUIRED') {
                openSignIn();
            }
        } catch (error: any) {
            console.error("[Hero] Transition error during LIKE:", error);
        }
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: video.title,
      text: video.description || "",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(language === 'pl' ? "Link skopiowany do schowka!" : "Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleDislike = async () => {
    if (!userId) return openSignIn();
    if (isPending) return;

    startTransition(async () => {
        try {
            addOptimisticAction('DISLIKE');
            const result = await toggleVideoDislike(video.id) as any;
            if (result?.error === 'AUTH_REQUIRED') {
                openSignIn();
            }
        } catch (error: any) {
            console.error("[Hero] Transition error during DISLIKE:", error);
        }
    });
  };

  if (!mounted) return (
      <div className="w-full aspect-video bg-slate-900 rounded-2xl animate-pulse" />
  );

  return (
    <section className="space-y-4">
      <div className="w-full">
        {/* VIDEO PLAYER AREA */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black group border border-white/5 ring-1 ring-white/5">
          <PremiumWrapper videoId={video.id} videoUrl={video.videoUrl} requiredTier={video.tier} isMainFeatured={video.isMainFeatured}>
            <VideoPlayer video={video} />
          </PremiumWrapper>
        </div>

        {/* INFO SECTION */}
        <div className="pt-4 space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
            {video.title}
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-white/5">
            <div className="flex items-center gap-4">
               <Link
                 href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                 className="relative w-11 h-11 rounded-full bg-slate-800 border border-white/10 overflow-hidden shrink-0 transition-transform active:scale-95"
               >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.creator?.name || 'Polutek'}`} alt={video.creator?.name} className="w-full h-full object-cover" />
               </Link>
               <div className="flex flex-col">
                  <Link
                    href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                    className="font-bold text-white text-base hover:text-primary transition-colors"
                  >
                    {video.creator?.name || 'Paweł Polutek'}
                  </Link>
                  <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                     {mounted ? (video.creator?.subscribersCount || 0).toLocaleString('pl-PL') : (video.creator?.subscribersCount || 0)} {t.subscribers}
                  </span>
               </div>
               <SubscribeButton
                 creatorId={video.creatorId}
                 initialSubscribersCount={video.creator?.subscribersCount || 0}
                 initialIsSubscribed={initialIsSubscribed}
               />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
               <div className="flex items-center bg-white/5 rounded-full h-10 border border-white/10">
                  <button
                    onClick={handleLike}
                    disabled={isPending}
                    className={cn(
                        "flex items-center gap-2 pl-4 pr-4 h-full hover:bg-white/5 transition-colors border-r border-white/10 relative",
                        optimisticState.isLiked && "text-primary",
                        isPending && "opacity-50"
                    )}
                  >
                     <ThumbsUp size={18} className={cn(optimisticState.isLiked && "fill-current")} />
                     <span className="text-sm font-bold">{optimisticState.likesCount.toLocaleString('pl-PL')}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    disabled={isPending}
                    className={cn(
                        "flex items-center px-4 h-full hover:bg-white/5 transition-colors rounded-r-full",
                        optimisticState.isDisliked && "text-primary",
                        isPending && "opacity-50"
                    )}
                  >
                     <ThumbsDown size={18} className={cn(optimisticState.isDisliked && "fill-current")} />
                  </button>
               </div>

               <button
                 onClick={handleShare}
                 className="flex items-center gap-2 px-4 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all active:scale-95"
               >
                  <Share2 size={16} className="text-slate-400" />
                  <span className="text-sm font-bold">{t.share}</span>
               </button>

               <button className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors">
                  <MoreHorizontal size={18} className="text-slate-400" />
               </button>
            </div>
          </div>
        </div>

        {/* DESCRIPTION BOX */}
        <div className="mt-4 bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4 group cursor-pointer transition-all hover:bg-slate-800/50" onClick={() => setIsExpanded(!isExpanded)}>
           <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
              <span className="text-sm font-black text-white/90">
                 {video.views.toLocaleString('pl-PL')} {t.views}
              </span>
              <span className="text-sm font-black text-white/90">
                 {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' }) : t.noDate}
              </span>
           </div>

           <div className={cn(
              "text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans transition-all",
              !isExpanded && "line-clamp-2"
           )}>
              {video.description || t.noDescription}
           </div>

           <button
             className="text-sm font-bold text-primary mt-2 hover:underline inline-block uppercase tracking-wider"
             onClick={(e) => {
               e.stopPropagation();
               setIsExpanded(!isExpanded);
             }}
           >
              {isExpanded ? t.showLess : t.showMore}
           </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
