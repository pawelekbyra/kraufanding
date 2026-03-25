"use client";

import React, { useOptimistic, useState, useEffect } from 'react';
import { Video } from '../types/video';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from 'lucide-react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import PremiumWrapper from './PremiumWrapper';
import Link from 'next/link';

interface HeroProps {
  video: Video;
}

const Hero: React.FC<HeroProps> = ({ video }) => {
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(video.creator?.subscribersCount || 1200000);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [optimisticLike, addOptimisticLike] = useOptimistic(
    { isLiked: false, count: video.likesCount || 0 },
    (state, newLiked: boolean) => ({
      isLiked: newLiked,
      count: newLiked ? state.count + 1 : Math.max(0, state.count - 1)
    })
  );

  useEffect(() => {
    if (userId && video.creatorId) {
      fetch(`/api/subscriptions?creatorId=${video.creatorId}`)
        .then(res => res.json())
        .then(data => setIsSubscribed(data.isSubscribed))
        .catch(err => console.error("Error fetching subscription status:", err));
    }
  }, [userId, video.creatorId]);

  const handleLike = async () => {
    if (!userId) return openSignIn();
    addOptimisticLike(!optimisticLike.isLiked);
    // TODO: Implement toggleVideoLike
  };

  const handleSubscribe = async () => {
    if (!userId) {
        openSignIn();
        return;
    }
    if (!video.creatorId) return;

    // Optimistic UI update
    const prevSubscribed = isSubscribed;
    setIsSubscribed(!prevSubscribed);
    setSubscribersCount(prev => prevSubscribed ? prev - 1 : prev + 1);

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId: video.creatorId }),
      });

      if (!res.ok) {
        if (res.status === 401) {
            openSignIn();
            // Rollback on 401
            setIsSubscribed(prevSubscribed);
            setSubscribersCount(prev => prevSubscribed ? prev + 1 : prev - 1);
            return;
        }
        throw new Error("Subscription update failed");
      }
      const data = await res.json();
      setIsSubscribed(data.isSubscribed);
    } catch (err) {
      console.error("Error updating subscription:", err);
      // Rollback on error
      setIsSubscribed(prevSubscribed);
      setSubscribersCount(prev => prevSubscribed ? prev + 1 : prev - 1);
    }
  };

  if (!mounted) return (
      <div className="w-full aspect-video bg-black rounded-xl animate-pulse" />
  );

  return (
    <section className="bg-[#FDFBF7]">
      <div className="w-full">
        {/* FEATURED MEDIA (VIDEO PLAYER) */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-sm border border-[#1a1a1a]/5 mb-3 group bg-black">
          <PremiumWrapper videoId={video.id} requiredTier={video.tier} isMainFeatured={video.isMainFeatured}>
            {(videoUrl) => (
              <>
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <>
                    <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-90 transition duration-1000"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform border border-white/10 pointer-events-auto">
                            <svg className="w-8 h-8 text-white fill-current ml-1" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                  </>
                )}
              </>
            )}
          </PremiumWrapper>
        </div>

        {/* INFO SECTION */}
        <div className="space-y-3 pt-3">
          <h2 className="text-[20px] font-bold text-[#0f0f0f] tracking-tight leading-[1.2] uppercase">
            {video.title}
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div className="flex items-center gap-3 min-w-0">
               <Link
                 href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                 className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 overflow-hidden shrink-0 hover:opacity-80 transition-opacity"
               >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.creator?.name || 'Polutek'}`} alt={video.creator?.name} className="w-full h-full object-cover" />
               </Link>
               <div className="min-w-0 pr-1">
                  <Link
                    href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                    className="font-bold text-[#0f0f0f] text-[16px] leading-tight truncate block hover:underline"
                  >
                    {video.creator?.name || 'Paweł Polutek'}
                  </Link>
                  <p className="text-[12px] text-[#606060] whitespace-nowrap">{subscribersCount.toLocaleString('pl-PL')} subskrajberów</p>
               </div>
               <button
                 onClick={handleSubscribe}
                 className={cn(
                   "text-[14px] font-bold rounded-full px-4 h-9 flex items-center transition-all ml-1 shrink-0",
                   isSubscribed
                     ? "bg-[#000000]/5 text-[#0f0f0f] hover:bg-[#000000]/10"
                     : "bg-[#0f0f0f] text-white hover:bg-[#272727]"
                 )}
               >
                 {isSubscribed ? 'Subskrybujesz' : 'Subskrajb'}
               </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible no-scrollbar">
               <div className="flex items-center bg-[#000000]/5 rounded-full h-9 shrink-0">
                  <button
                    onClick={handleLike}
                    className={cn(
                        "flex items-center gap-2 px-3 h-full hover:bg-[#000000]/10 rounded-l-full transition-colors border-r border-black/10",
                        optimisticLike.isLiked && "text-primary"
                    )}
                  >
                     <ThumbsUp size={16} className={cn(optimisticLike.isLiked && "fill-primary")} />
                     <span className="text-[13px] font-bold">{optimisticLike.count.toLocaleString('pl-PL')}</span>
                  </button>
                  <button className="px-3 h-full hover:bg-[#000000]/10 rounded-r-full transition-colors">
                     <ThumbsDown size={16} />
                  </button>
               </div>
               <button className="flex items-center gap-2 px-3 h-9 bg-[#000000]/5 hover:bg-[#000000]/10 rounded-full transition-colors shrink-0">
                  <Share2 size={16} />
                  <span className="text-[13px] font-bold">Udostępnij</span>
               </button>
               <button className="w-9 h-9 flex items-center justify-center bg-[#000000]/5 hover:bg-[#000000]/10 rounded-full transition-colors shrink-0">
                  <MoreHorizontal size={16} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
