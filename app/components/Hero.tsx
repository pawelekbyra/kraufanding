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
            if (result.error) {
              if (result.error === 'AUTH_REQUIRED') openSignIn();
              console.error("[Hero] LIKE Action failed:", result.error);
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
        alert(language === 'pl' ? "ŁĄCZE SKOPIOWANE DO SCHOWKA" : "LINK COPIED TO ARCHIVE");
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
            if (result.error) {
              if (result.error === 'AUTH_REQUIRED') openSignIn();
              console.error("[Hero] DISLIKE Action failed:", result.error);
            }
        } catch (error: any) {
            console.error("[Hero] Transition error during DISLIKE:", error);
        }
    });
  };

  if (!mounted) return (
      <div className="w-full aspect-video bg-bone rounded-none animate-pulse border border-ink/5" />
  );

  return (
    <section className="bg-transparent">
      <div className="w-full">
        {/* FEATURED MEDIA */}
        <div className="relative aspect-video w-full rounded-none overflow-hidden shadow-md border border-ink/10 mb-6 group bg-black">
          <PremiumWrapper videoId={video.id} videoUrl={video.videoUrl} requiredTier={video.tier} isMainFeatured={video.isMainFeatured}>
            <VideoPlayer video={video} />
          </PremiumWrapper>
          <div className="absolute top-4 left-4 z-40 bg-linen/90 backdrop-blur-md px-3 py-1 border border-ink/10 text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-ink pointer-events-none">
             {video.tier === 'PUBLIC' || video.isMainFeatured ? 'Zeznanie jawne' : 'Zeznanie zastrzeżone'}
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="space-y-4 pt-2">
          <h2 className="text-[28px] md:text-[36px] font-bold text-ink tracking-tight leading-[1.1] uppercase font-serif drop-shadow-sm">
            {video.title}
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-ink/5">
            <div className="flex items-center gap-4 min-w-0">
               <Link
                 href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                 className="w-12 h-12 rounded-none bg-bone border border-ink/10 overflow-hidden shrink-0 hover:border-ink/30 transition-colors p-0.5"
               >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.creator?.name || 'Polutek'}`} alt={video.creator?.name} className="w-full h-full object-cover grayscale opacity-60" />
               </Link>
               <div className="min-w-0 pr-1 flex flex-col">
                  <Link
                    href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                    className="font-bold text-ink text-[18px] leading-tight truncate block hover:text-oxblood transition-colors uppercase font-mono tracking-tight"
                  >
                    {video.creator?.name || 'Paweł Polutek'}
                  </Link>
                  <span className="text-[12px] text-ink/40 whitespace-nowrap font-mono mt-0.5 tracking-wider">
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

            <div className="flex items-center gap-3 overflow-x-auto sm:overflow-visible no-scrollbar">
               <div className="flex items-center bg-ink/5 rounded-none h-10 shrink-0 overflow-hidden border border-ink/10">
                  <button
                    onClick={handleLike}
                    disabled={isPending}
                    className={cn(
                        "flex items-center gap-3 pl-5 pr-4 h-full hover:bg-ink/10 transition-colors border-r border-ink/10 relative",
                        optimisticState.isLiked && "text-oxblood",
                        isPending && "opacity-50"
                    )}
                    title="Lubię to"
                  >
                     <ThumbsUp size={18} className={cn(optimisticState.isLiked && "fill-oxblood")} />
                     <span className="text-[14px] font-bold font-mono">{optimisticState.likesCount.toLocaleString('pl-PL')}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    disabled={isPending}
                    className={cn(
                        "flex items-center px-5 h-full hover:bg-ink/10 transition-colors",
                        optimisticState.isDisliked && "text-ink",
                        isPending && "opacity-50"
                    )}
                    title="Nie lubię"
                  >
                     <ThumbsDown size={18} className={cn(optimisticState.isDisliked && "fill-ink")} />
                  </button>
               </div>
               <button
                 onClick={handleShare}
                 className="flex items-center gap-3 px-4 h-10 bg-ink/5 border border-ink/10 hover:bg-ink/10 rounded-none transition-colors shrink-0 text-ink uppercase text-[12px] font-bold font-mono tracking-widest"
               >
                  <Share2 size={16} className="text-oxblood" />
                  <span className="hidden xs:inline">{t.share}</span>
               </button>
               <button className="w-10 h-10 flex items-center justify-center bg-bone border border-ink/5 hover:border-ink/20 rounded-none transition-colors shrink-0">
                  <MoreHorizontal size={18} className="text-ink/20" />
               </button>
            </div>
          </div>
        </div>

        {/* DESCRIPTION BOX */}
        <div className="mt-6 bg-bone/30 border border-ink/5 rounded-none p-5 hover:border-ink/10 transition-all cursor-pointer group shadow-inner" onClick={() => setIsExpanded(!isExpanded)}>
           <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3 border-b border-ink/5 pb-3 font-mono">
              <span className="text-[14px] font-bold text-ink/80 tracking-wide uppercase">
                 {video.views.toLocaleString('pl-PL')} {t.views}
              </span>
              <span className="text-[14px] font-bold text-ink/30 tracking-wide uppercase">
                 {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' }) : t.noDate}
              </span>
           </div>

           <div className={cn(
              "text-[15px] text-ink/80 leading-relaxed whitespace-pre-wrap font-sans transition-all duration-300",
              !isExpanded && "line-clamp-2 opacity-60"
           )}>
              {video.description || t.noDescription}
           </div>

           <button
             className="text-[12px] font-bold text-oxblood mt-4 hover:underline block uppercase tracking-[0.2em] font-mono italic"
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
