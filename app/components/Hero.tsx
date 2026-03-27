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
        } catch (error) {
            console.error("[Hero] LIKE Action failed:", error);
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
        } catch (error) {
            console.error("[Hero] DISLIKE Action failed:", error);
        }
    });
  };

  if (!mounted) return (
      <div className="w-full aspect-video bg-base-200 rounded-2xl animate-pulse" />
  );

  return (
    <section className="bg-transparent">
      <div className="w-full">
        {/* FEATURED MEDIA */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-aurora-lg border border-white/5 mb-6 group bg-black">
          <PremiumWrapper videoId={video.id} videoUrl={video.videoUrl} requiredTier={video.tier} isMainFeatured={video.isMainFeatured}>
            <VideoPlayer video={video} />
          </PremiumWrapper>
        </div>

        {/* INFO SECTION */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-tight uppercase">
            {video.title}
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
            <div className="flex items-center gap-4 min-w-0">
               <Link
                 href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                 className="w-12 h-12 rounded-full bg-white/10 border border-white/10 overflow-hidden shrink-0 hover:opacity-80 transition-opacity p-0.5"
               >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.creator?.name || 'Polutek'}`}
                    alt={video.creator?.name}
                    className="w-full h-full object-cover rounded-full"
                  />
               </Link>
               <div className="min-w-0 pr-1 flex flex-col">
                  <Link
                    href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                    className="font-black text-white text-lg leading-tight truncate block hover:text-primary transition-colors"
                  >
                    {video.creator?.name || 'Paweł Polutek'}
                  </Link>
                  <span className="text-sm text-white/50 whitespace-nowrap font-medium">
                     {mounted ? (video.creator?.subscribersCount || 0).toLocaleString('pl-PL') : (video.creator?.subscribersCount || 0)} {t.subscribers}
                  </span>
               </div>
               <SubscribeButton
                 creatorId={video.creatorId}
                 initialSubscribersCount={video.creator?.subscribersCount || 0}
                 initialIsSubscribed={initialIsSubscribed}
               />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible no-scrollbar">
               <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-10 shrink-0 overflow-hidden backdrop-blur-sm">
                  <button
                    onClick={handleLike}
                    disabled={isPending}
                    className={cn(
                        "flex items-center gap-2 pl-5 pr-4 h-full hover:bg-white/10 transition-colors border-r border-white/10 relative",
                        optimisticState.isLiked && "text-primary",
                        isPending && "opacity-50"
                    )}
                  >
                     <ThumbsUp size={20} className={cn(optimisticState.isLiked && "fill-current")} />
                     <span className="text-sm font-black">{optimisticState.likesCount.toLocaleString('pl-PL')}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    disabled={isPending}
                    className={cn(
                        "flex items-center px-5 h-full hover:bg-white/10 transition-colors",
                        optimisticState.isDisliked && "text-primary",
                        isPending && "opacity-50"
                    )}
                  >
                     <ThumbsDown size={20} className={cn(optimisticState.isDisliked && "fill-current")} />
                  </button>
               </div>
               <button
                 onClick={handleShare}
                 className="flex items-center gap-2 px-4 h-10 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full transition-all shrink-0 font-black text-sm text-white/90 backdrop-blur-sm"
               >
                  <Share2 size={18} />
                  <span>{t.share}</span>
               </button>
               <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 rounded-full transition-all shrink-0 text-white/70 backdrop-blur-sm">
                  <MoreHorizontal size={20} />
               </button>
            </div>
          </div>
        </div>

        {/* DESCRIPTION BOX */}
        <div className="mt-6 bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/10 transition-all cursor-pointer shadow-sm group" onClick={() => setIsExpanded(!isExpanded)}>
           <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
              <span className="text-sm font-black text-white">
                 {video.views.toLocaleString('pl-PL')} {t.views}
              </span>
              <span className="text-sm font-black text-white/70">
                 {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' }) : t.noDate}
              </span>
           </div>

           <div className={cn(
              "text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-sans",
              !isExpanded && "line-clamp-2"
           )}>
              {video.description || t.noDescription}
           </div>

           <button
             className="text-sm font-black text-primary mt-3 hover:underline block"
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
