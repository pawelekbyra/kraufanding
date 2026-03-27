"use client";

import React, { useOptimistic, useState, useEffect, useTransition } from 'react';
import { Video } from '../types/video';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, Calendar, Eye } from 'lucide-react';
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
            await toggleVideoLike(video.id);
        } catch (error: any) {
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
            await toggleVideoDislike(video.id);
        } catch (error: any) {
            console.error("[Hero] DISLIKE Action failed:", error);
        }
    });
  };

  if (!mounted) return (
      <div className="w-full aspect-video bg-white/5 rounded-2xl animate-pulse" />
  );

  return (
    <section className="relative">
      <div className="w-full">
        {/* FEATURED MEDIA */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-6 group bg-black group-hover:shadow-glow transition-all duration-500">
          <PremiumWrapper videoId={video.id} videoUrl={video.videoUrl} requiredTier={video.tier} isMainFeatured={video.isMainFeatured}>
            <VideoPlayer video={video} />
          </PremiumWrapper>
        </div>

        {/* INFO SECTION */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-serif font-black text-white tracking-tight leading-tight uppercase text-glow">
            {video.title}
          </h1>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
               <Link
                 href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                 className="w-12 h-12 rounded-full ring-2 ring-primary/20 bg-white/5 overflow-hidden shrink-0 hover:scale-110 transition-transform"
               >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.creator?.name || 'Polutek'}`} alt={video.creator?.name} className="w-full h-full object-cover" />
               </Link>
               <div className="min-w-0 pr-4">
                  <Link
                    href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                    className="font-black text-white text-lg tracking-tight truncate block hover:text-primary transition-colors"
                  >
                    {video.creator?.name || 'Paweł Polutek'}
                  </Link>
                  <span className="text-[12px] font-mono text-white/40 uppercase tracking-widest">
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
               <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-11 shrink-0 overflow-hidden">
                  <button
                    onClick={handleLike}
                    disabled={isPending}
                    className={cn(
                        "flex items-center gap-2 pl-5 pr-4 h-full hover:bg-white/10 transition-all border-r border-white/10",
                        optimisticState.isLiked && "text-primary",
                        isPending && "opacity-50"
                    )}
                  >
                     <ThumbsUp size={18} className={cn(optimisticState.isLiked && "fill-primary")} />
                     <span className="text-sm font-black font-mono">{optimisticState.likesCount.toLocaleString('pl-PL')}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    disabled={isPending}
                    className={cn(
                        "flex items-center px-5 h-full hover:bg-white/10 transition-all",
                        optimisticState.isDisliked && "text-primary",
                        isPending && "opacity-50"
                    )}
                  >
                     <ThumbsDown size={18} className={cn(optimisticState.isDisliked && "fill-primary")} />
                  </button>
               </div>

               <button
                 onClick={handleShare}
                 className="flex items-center gap-2 px-5 h-11 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full transition-all shrink-0 text-white font-black text-xs uppercase tracking-widest"
               >
                  <Share2 size={16} />
                  <span>{t.share}</span>
               </button>

               <button className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 rounded-full transition-all shrink-0 text-white">
                  <MoreHorizontal size={18} />
               </button>
            </div>
          </div>
        </div>

        {/* DESCRIPTION BOX */}
        <div className="mt-8 glass-card rounded-2xl p-6 transition-all hover:border-white/20 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
           <div className="flex flex-wrap gap-6 mb-4">
              <div className="flex items-center gap-2 text-white/60 font-mono text-xs uppercase tracking-widest">
                 <Eye size={14} className="text-primary" />
                 <span className="font-black text-white">
                   {video.views.toLocaleString('pl-PL')}
                 </span>
                 <span>{t.views}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 font-mono text-xs uppercase tracking-widest">
                 <Calendar size={14} className="text-primary" />
                 <span className="font-black text-white">
                   {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' }) : t.noDate}
                 </span>
              </div>
           </div>

           <div className={cn(
              "text-base text-slate-300 leading-relaxed whitespace-pre-wrap font-sans",
              !isExpanded && "line-clamp-3"
           )}>
              {video.description || t.noDescription}
           </div>

           <button
             className="text-xs font-black uppercase tracking-[0.2em] text-primary mt-4 hover:underline block"
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
