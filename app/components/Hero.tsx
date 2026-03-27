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
            console.log("[Hero] Toggling LIKE for video:", video.id);
            addOptimisticAction('LIKE');
            const result = await toggleVideoLike(video.id) as any;

            if (result.error) {
                console.error("[Hero] LIKE Action failed:", result.error, result.message);
                if (result.error === 'AUTH_REQUIRED') {
                    openSignIn();
                } else {
                    alert(`BŁĄD: ${result.message || result.error}`);
                }
            }
        } catch (error: any) {
            console.error("[Hero] Transition error during LIKE:", error);
            alert("Błąd serwera podczas polubienia. Sprawdź połączenie.");
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
            console.log("[Hero] Toggling DISLIKE for video:", video.id);
            addOptimisticAction('DISLIKE');
            const result = await toggleVideoDislike(video.id) as any;

            if (result.error) {
                console.error("[Hero] DISLIKE Action failed:", result.error, result.message);
                if (result.error === 'AUTH_REQUIRED') {
                    openSignIn();
                } else {
                    alert(`BŁĄD: ${result.message || result.error}`);
                }
            }
        } catch (error: any) {
            console.error("[Hero] Transition error during DISLIKE:", error);
            alert("Błąd serwera podczas oceny. Sprawdź połączenie.");
        }
    });
  };

  if (!mounted) return (
      <div className="w-full aspect-video bg-obsidian/10 animate-pulse" />
  );

  return (
    <section className="bg-linen">
      <div className="w-full">
        {/* FEATURED MEDIA */}
        <div className="relative aspect-video w-full overflow-hidden shadow-brutalist border border-obsidian mb-6 group bg-black">
          <PremiumWrapper videoId={video.id} videoUrl={video.videoUrl} requiredTier={video.tier} isMainFeatured={video.isMainFeatured}>
            <VideoPlayer video={video} />
          </PremiumWrapper>
        </div>

        {/* INFO SECTION */}
        <div className="space-y-4 pt-2">
          <h2 className="text-[24px] md:text-[28px] font-black text-obsidian tracking-tighter leading-[1.1] uppercase italic">
            {video.title}
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-obsidian/10">
            <div className="flex items-center gap-4 min-w-0">
               <Link
                 href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                 className="w-12 h-12 bg-obsidian border border-obsidian overflow-hidden shrink-0 hover:opacity-80 transition-opacity"
               >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.creator?.name || 'Polutek'}`} alt={video.creator?.name} className="w-full h-full object-cover grayscale" />
               </Link>
               <div className="min-w-0 pr-1 flex flex-col">
                  <Link
                    href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                    className="font-black text-obsidian text-[18px] leading-tight truncate block hover:text-ikb transition-colors uppercase tracking-tight"
                  >
                    {video.creator?.name || 'Paweł Polutek'}
                  </Link>
                  <span className="text-[12px] font-mono font-bold text-obsidian/50 whitespace-nowrap uppercase tracking-widest mt-0.5">
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
               <div className="flex items-center bg-white border border-obsidian h-10 shrink-0 overflow-hidden shadow-brutalist-sm">
                  <button
                    onClick={handleLike}
                    disabled={isPending}
                    className={cn(
                        "flex items-center gap-2 pl-4 pr-3 h-full hover:bg-obsidian/5 transition-all border-r border-obsidian relative",
                        optimisticState.isLiked && "bg-ikb text-white",
                        isPending && "opacity-50"
                    )}
                    title="Lubię to"
                  >
                     <ThumbsUp size={18} className={cn(optimisticState.isLiked && "fill-white")} />
                     <span className="text-[14px] font-mono font-bold">{optimisticState.likesCount.toLocaleString('pl-PL')}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    disabled={isPending}
                    className={cn(
                        "flex items-center px-4 h-full hover:bg-obsidian/5 transition-all",
                        optimisticState.isDisliked && "bg-obsidian text-white",
                        isPending && "opacity-50"
                    )}
                    title="Nie lubię"
                  >
                     <ThumbsDown size={18} className={cn(optimisticState.isDisliked && "fill-white")} />
                  </button>
               </div>
               <button
                 onClick={handleShare}
                 className="flex items-center gap-2 px-4 h-10 bg-white border border-obsidian hover:bg-obsidian/5 transition-all shrink-0 shadow-brutalist-sm font-mono font-bold text-[13px] uppercase tracking-widest"
               >
                  <Share2 size={16} />
                  <span>{t.share}</span>
               </button>
               <button className="w-10 h-10 flex items-center justify-center bg-white border border-obsidian hover:bg-obsidian/5 transition-all shrink-0 shadow-brutalist-sm">
                  <MoreHorizontal size={16} />
               </button>
            </div>
          </div>
        </div>

        {/* DESCRIPTION BOX */}
        <div className="mt-6 bg-white border border-obsidian p-5 hover:bg-linen transition-colors cursor-pointer shadow-brutalist-sm relative overflow-hidden group" onClick={() => setIsExpanded(!isExpanded)}>
           <div className="absolute top-0 right-0 w-12 h-12 border-l border-b border-obsidian flex items-center justify-center bg-obsidian text-white font-mono text-[10px] uppercase rotate-0 origin-top-right group-hover:bg-ikb transition-colors">
              INFO
           </div>

           <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
              <span className="text-[14px] font-mono font-bold text-obsidian uppercase tracking-widest border-b-2 border-ikb">
                 {video.views.toLocaleString('pl-PL')} {t.views}
              </span>
              <span className="text-[14px] font-mono font-bold text-obsidian/60 uppercase tracking-widest">
                 {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' }) : t.noDate}
              </span>
           </div>

           <div className={cn(
              "text-[15px] text-obsidian/80 leading-relaxed whitespace-pre-wrap font-sans",
              !isExpanded && "line-clamp-2"
           )}>
              {video.description || t.noDescription}
           </div>

           <button
             className="text-[12px] font-mono font-bold text-ikb mt-3 hover:underline uppercase tracking-widest block"
             onClick={(e) => {
               e.stopPropagation();
               setIsExpanded(!isExpanded);
             }}
           >
              {isExpanded ? `[-] ${t.showLess}` : `[+] ${t.showMore}`}
           </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
