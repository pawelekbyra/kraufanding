"use client";

import React, { useOptimistic, useState, useEffect, useTransition } from 'react';
import { Video } from '../types/video';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from './icons';
import { useAuth, useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import PremiumWrapper from './PremiumWrapper';
import Link from 'next/link';
import SubscribeButton from './SubscribeButton';
import VideoPlayer from './VideoPlayer';
import { toggleVideoLike, toggleVideoDislike } from '@/lib/actions/interactions';
import { useLanguage } from './LanguageContext';
import BrandName from './BrandName';

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
                } else if (result.error === 'CLERK_ERROR') {
                    alert(`BŁĄD KONFIGURACJI CLERK:\n\n${result.message}\n\nSprawdź klucze API w Vercel.`);
                } else if (result.error === 'DATABASE_ERROR') {
                    alert(`BŁĄD BAZY DANYCH:\n\n${result.message}\n\nJeśli problem nadal występuje, spróbuj uruchomić:\n'npx prisma db push --force'`);
                } else {
                    alert(`BŁĄD: ${result.message || result.error}\n\nSprawdź logi Vercela lub konsolę przeglądarki.`);
                }
            } else {
                console.log("[Hero] LIKE Action success:", result);
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
                } else if (result.error === 'CLERK_ERROR') {
                    alert(`BŁĄD KONFIGURACJI CLERK:\n\n${result.message}\n\nSprawdź klucze API w Vercel.`);
                } else if (result.error === 'DATABASE_ERROR') {
                    alert(`BŁĄD BAZY DANYCH:\n\n${result.message}\n\nJeśli problem nadal występuje, spróbuj uruchomić:\n'npx prisma db push --force'`);
                } else {
                    alert(`BŁĄD: ${result.message || result.error}\n\nSprawdź logi Vercela lub konsolę przeglądarki.`);
                }
            } else {
                console.log("[Hero] DISLIKE Action success:", result);
            }
        } catch (error: any) {
            console.error("[Hero] Transition error during DISLIKE:", error);
            alert("Błąd serwera podczas oceny. Sprawdź połączenie.");
        }
    });
  };

  if (!mounted) return (
      <div className="w-full aspect-video bg-black rounded-xl animate-pulse" />
  );

  return (
    <section className="bg-[#FDFBF7]">
      <div className="w-full">
        {/* FEATURED MEDIA */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-[#1a1a1a]/5 mb-3 group bg-black">
          <PremiumWrapper videoId={video.id} videoUrl={video.videoUrl} requiredTier={video.tier} isMainFeatured={video.isMainFeatured}>
            <VideoPlayer video={video} />
          </PremiumWrapper>
        </div>

        {/* INFO SECTION */}
        <div className="space-y-3 pt-3">
          <h2 className="text-[20px] font-bold text-[#0f0f0f] tracking-tight leading-[1.2]">
            {video.slug === 'independency-2024'
              ? (userId ? (
                <>{t.welcomeOn} <BrandName /></>
              ) : t.independencyTitle)
              : video.title}
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div className="flex items-center gap-3 min-w-0">
               <Link
                 href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                 className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 overflow-hidden shrink-0 hover:opacity-80 transition-opacity"
               >
                  <img
                    src={video.creator?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.creator?.email || video.creator?.name || 'POLUTEK'}`}
                    alt={video.creator?.name}
                    className="w-full h-full object-cover"
                  />
               </Link>
               <div className="min-w-0 pr-1 flex flex-col">
                  <Link
                    href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                    className="font-bold text-[#0f0f0f] text-[16px] leading-tight truncate block hover:underline"
                  >
                    {video.creator?.name || 'Anonimowy Twórca'}
                  </Link>
                  <span className="text-[12px] text-[#606060] whitespace-nowrap">
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
               <div className="flex items-center bg-[#000000]/5 rounded-full h-9 shrink-0 overflow-hidden border border-black/5">
                  <button
                    onClick={handleLike}
                    disabled={isPending}
                    className={cn(
                        "flex items-center gap-2 pl-4 pr-3 h-full hover:bg-[#000000]/10 transition-colors border-r border-black/10 relative",
                        optimisticState.isLiked && "text-primary",
                        isPending && "opacity-50"
                    )}
                    title="Lubię to"
                  >
                     <ThumbsUp size={18} className={cn(optimisticState.isLiked && "fill-primary")} />
                     <span className="text-[14px] font-semibold">{optimisticState.likesCount.toLocaleString('pl-PL')}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    disabled={isPending}
                    className={cn(
                        "flex items-center px-4 h-full hover:bg-[#000000]/10 transition-colors",
                        optimisticState.isDisliked && "text-red-500",
                        isPending && "opacity-50"
                    )}
                    title="Nie lubię"
                  >
                     <ThumbsDown size={18} className={cn(optimisticState.isDisliked && "fill-red-500")} />
                  </button>
               </div>
               <button
                 onClick={handleShare}
                 className="flex items-center gap-2 px-3 h-9 bg-[#000000]/5 hover:bg-[#000000]/10 rounded-full transition-colors shrink-0 border border-black/5"
               >
                  <Share2 size={16} />
                  <span className="text-[13px] font-semibold">{t.share}</span>
               </button>
               <button className="w-9 h-9 flex items-center justify-center bg-[#000000]/5 hover:bg-[#000000]/10 rounded-full transition-colors shrink-0">
                  <MoreHorizontal size={16} />
               </button>
            </div>
          </div>
        </div>

        {/* DESCRIPTION BOX */}
        <div className="mt-3 bg-[#000000]/5 rounded-2xl p-4 hover:bg-[#000000]/10 transition-colors cursor-pointer border border-black/5" onClick={() => setIsExpanded(!isExpanded)}>
           <div className="flex flex-wrap gap-x-2 gap-y-1 mb-1">
              <span className="text-[14px] font-semibold text-[#0f0f0f]">
                 {video.views.toLocaleString('pl-PL')} {t.views}
              </span>
              <span className="text-[14px] font-semibold text-[#0f0f0f]">
                 {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' }) : t.noDate}
              </span>
           </div>

           <div className={cn(
              "text-[14px] text-[#0f0f0f] leading-relaxed whitespace-pre-wrap",
              !isExpanded && "line-clamp-2"
           )}>
              {video.description || t.noDescription}
           </div>

           <button
             className="text-[14px] font-semibold text-[#0f0f0f] mt-1 hover:underline block"
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
