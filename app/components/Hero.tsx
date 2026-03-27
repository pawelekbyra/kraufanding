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
      <div className="w-full aspect-video bg-onyx rounded-3xl animate-pulse" />
  );

  return (
    <section className="bg-transparent mb-8">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6">
        {/* FEATURED MEDIA */}
        <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 group bg-black mb-6">
          <PremiumWrapper videoId={video.id} videoUrl={video.videoUrl} requiredTier={video.tier} isMainFeatured={video.isMainFeatured}>
            <VideoPlayer video={video} />
          </PremiumWrapper>
        </div>

        {/* INFO SECTION */}
        <div className="space-y-4">
          <h1 className="text-3xl lg:text-4xl font-serif font-black text-white tracking-tight leading-tight uppercase text-gradient">
            {video.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-4 min-w-0">
               <Link
                 href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                 className="w-12 h-12 rounded-full bg-white/5 border border-amber/10 overflow-hidden shrink-0 hover:scale-110 transition-transform duration-300 ring-2 ring-amber/5"
               >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.creator?.name || 'Polutek'}`} alt={video.creator?.name} className="w-full h-full object-cover" />
               </Link>
               <div className="min-w-0 flex flex-col">
                  <Link
                    href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                    className="font-black text-white text-lg leading-tight truncate block hover:text-amber transition-colors"
                  >
                    {video.creator?.name || 'PAWEŁ POLUTEK'}
                  </Link>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-white/40">
                     {mounted ? (video.creator?.subscribersCount || 0).toLocaleString('pl-PL') : (video.creator?.subscribersCount || 0)} {t.subscribers}
                  </span>
               </div>
               <div className="ml-2">
                 <SubscribeButton
                   creatorId={video.creatorId}
                   initialSubscribersCount={video.creator?.subscribersCount || 0}
                   initialIsSubscribed={initialIsSubscribed}
                 />
               </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
               <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-11 shrink-0 overflow-hidden p-1">
                  <button
                    onClick={handleLike}
                    disabled={isPending}
                    className={cn(
                        "flex items-center gap-2 pl-4 pr-3 h-full hover:bg-white/10 transition-all rounded-l-full relative",
                        optimisticState.isLiked ? "text-amber bg-amber/10" : "text-white/60",
                        isPending && "opacity-50"
                    )}
                  >
                     <ThumbsUp size={18} className={cn(optimisticState.isLiked && "fill-amber")} />
                     <span className="text-sm font-black">{optimisticState.likesCount.toLocaleString('pl-PL')}</span>
                  </button>
                  <div className="w-[1px] h-4 bg-white/10" />
                  <button
                    onClick={handleDislike}
                    disabled={isPending}
                    className={cn(
                        "flex items-center px-4 h-full hover:bg-white/10 transition-all rounded-r-full",
                        optimisticState.isDisliked ? "text-amber bg-amber/10" : "text-white/60",
                        isPending && "opacity-50"
                    )}
                  >
                     <ThumbsDown size={18} className={cn(optimisticState.isDisliked && "fill-amber")} />
                  </button>
               </div>
               <button
                 onClick={handleShare}
                 className="flex items-center gap-2 px-5 h-11 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full transition-all text-white/60 hover:text-white shrink-0"
               >
                  <Share2 size={18} />
                  <span className="text-sm font-black uppercase tracking-widest">{t.share}</span>
               </button>
               <button className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 rounded-full transition-all text-white/60 shrink-0">
                  <MoreHorizontal size={18} />
               </button>
            </div>
          </div>
        </div>

        {/* DESCRIPTION BOX */}
        <div className="mt-6 glass-panel rounded-3xl p-6 hover:bg-white/10 transition-all cursor-pointer group border border-white/5" onClick={() => setIsExpanded(!isExpanded)}>
           <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
              <span className="text-sm font-mono uppercase tracking-widest text-amber">
                 {video.views.toLocaleString('pl-PL')} {t.views}
              </span>
              <span className="text-sm font-mono uppercase tracking-widest text-white/40">
                 {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' }) : t.noDate}
              </span>
           </div>

           <div className={cn(
              "text-base text-white/80 leading-relaxed font-sans",
              !isExpanded && "line-clamp-2"
           )}>
              {video.description || t.noDescription}
           </div>

           <button
             className="text-xs font-black uppercase tracking-[0.2em] text-amber mt-4 hover:underline block opacity-60 group-hover:opacity-100 transition-opacity"
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
