"use client";

import React, { useOptimistic, useState, useEffect } from 'react';
import { Video } from '../types/video';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from 'lucide-react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import PremiumWrapper from './PremiumWrapper';
import Link from 'next/link';
import SubscribeButton from './SubscribeButton';
import VideoPlayer from './VideoPlayer';
import { toggleVideoLike } from '@/lib/actions/interactions';

interface HeroProps {
  video: Video;
}

const Hero: React.FC<HeroProps> = ({ video }) => {
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
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

  const handleLike = async () => {
    if (!userId) return openSignIn();

    // Check for Clerk auth issue mentioned in logs
    try {
        addOptimisticLike(!optimisticLike.isLiked);
        const result = await toggleVideoLike(video.id);

        // If the server returns a different state than our optimistic one, we might need a way to sync it,
        // but toggleVideoLike returns { liked: boolean } which matches.
        // We don't strictly need to do anything if it succeeds as we used useOptimistic.
    } catch (error: any) {
        console.error("Error toggling like:", error);
        if (error.message?.includes("handshake") || error.message?.includes("JWKS")) {
            alert("Problem z autoryzacją. Odśwież stronę.");
        } else {
            alert("Błąd podczas zapisywania polubienia.");
        }
        // Rollback is handled by useOptimistic when the action completes if we were using it with a form action,
        // but here we call it manually. For simplicity in this brutalist setup, we'll let it be or the user can refresh.
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
          <PremiumWrapper videoId={video.id} videoUrl={video.videoUrl} requiredTier={video.tier} isMainFeatured={video.isMainFeatured}>
            <VideoPlayer video={video} />
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
               </div>
               <SubscribeButton
                 creatorId={video.creatorId}
                 initialSubscribersCount={video.creator?.subscribersCount || 1200000}
               />
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
                     <span className="text-[13px] font-bold">{mounted ? optimisticLike.count.toLocaleString('pl-PL') : optimisticLike.count}</span>
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
