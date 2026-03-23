"use client";

import React from 'react';
import Hero from './Hero';
import Rewards from './Rewards';
import PremiumWrapper from './PremiumWrapper';
import EmbeddedComments from './comments/EmbeddedComments';
import { Campaign } from '../types/campaign';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface ProjectViewProps {
  campaign: Campaign;
  videoId?: string;
  userProfile?: { id: string; email: string } | null;
  initialLikes?: { [videoId: string]: number };
}

export default function ProjectView({ campaign, videoId, userProfile, initialLikes }: ProjectViewProps) {
  const projectId = campaign.id;
  const currentVideoId = videoId || (campaign.videos?.[0]?.id || 'promo');
  const currentVideo = campaign.videos?.find(v => v.id === currentVideoId) || campaign.videos?.[0];

  const queryClient = useQueryClient();

  // Simple prefetch function for comments
  const prefetchVideo = (vidId: string) => {
    queryClient.prefetchInfiniteQuery({
        queryKey: ['comments', vidId, 'VIDEO'],
        queryFn: async () => {
            const url = new URL('/api/comments', window.location.origin);
            url.searchParams.append('entityId', vidId);
            url.searchParams.append('entityType', 'VIDEO');
            const res = await fetch(url.toString());
            return res.json();
        },
        initialPageParam: '',
    });
  };

  return (
    <main className="bg-[#FDFBF7] min-h-screen">
      {/* EXACT YOUTUBE WIDTH & MARGINS */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-4">

        {/* YOUTUBE STYLE GRID LAYOUT (12 COLS) */}
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT COLUMN (approx 68%): PLAYER + INFO + COMMENTS */}
          <div className="col-span-12 lg:col-span-8">

            {/* VIDEO PLAYER & METADATA */}
            <Hero campaign={{
                ...campaign,
                title: currentVideo?.title || campaign.title,
                thumbnail: currentVideo?.thumbnail || campaign.thumbnail,
                minTier: currentVideo?.minTier || 0,
                initialIsLiked: false, // These will be handled by Hero component internal state/actions
                initialIsSubscribed: false,
                likesCount: currentVideo?.likesCount ?? 0
            }} />

            {/* DESCRIPTION BOX (YOUTUBE STYLE) */}
            <div className="mt-3 bg-[#1a1a1a]/5 rounded-xl p-3 hover:bg-[#1a1a1a]/10 transition-colors cursor-pointer group">
               <div className="flex gap-4 text-[14px] font-bold">
                  <span>{(campaign as any).views?.toLocaleString('pl-PL') || '124 562'} wyświetleń</span>
                  <span>{currentVideo?.publishedAt || '21 mar 2025'}</span>
               </div>
               <div className="text-[14px] leading-relaxed whitespace-pre-wrap font-serif italic text-[#1a1a1a]/90 mt-1">
                  {currentVideo?.description || campaign.description}
                  <br />
                  Zapraszam do obczajenia moich nowych materiałów wideo. Wspierając ten projekt, zyskujesz stały dostęp do tajnych materiałów operacyjnych.
               </div>
               <button className="text-[12px] font-bold uppercase mt-2 opacity-60 group-hover:opacity-100">Pokaż więcej</button>
            </div>

            {/* COMMENTS SECTION */}
            <div className="mt-6">
               <EmbeddedComments
                 entityId={currentVideoId}
                 entityType="VIDEO"
                 userProfile={userProfile}
               />
            </div>
          </div>

          {/* RIGHT COLUMN (approx 32%): SIDEBAR PLAYLIST */}
          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1a1a1a] mb-2 border-b border-[#1a1a1a]/5 pb-1">Materiały</h3>

            {/* PLAYLIST ITEMS */}
            {(campaign.videos || []).sort((a, b) => {
                // Sort current video first
                if (a.id === currentVideoId) return -1;
                if (b.id === currentVideoId) return 1;
                // Then by minTier
                return a.minTier - b.minTier;
            }).reduce((acc: any[], video, i) => {
                const isLocked = video.minTier > 0;
                const isCurrent = video.id === currentVideoId;

                acc.push(
                    <Link
                      key={video.id}
                      href={`/projects/${campaign.slug}?v=${video.id}`}
                      scroll={false}
                      onMouseEnter={() => prefetchVideo(video.id)}
                      className={cn(
                        "group flex gap-2 p-1 rounded-lg transition-colors",
                        isCurrent ? "bg-[#1a1a1a]/10" : "hover:bg-[#1a1a1a]/5"
                      )}
                    >
                      <div className="w-[168px] h-[94px] shrink-0 overflow-hidden rounded-lg bg-black relative">
                        <PremiumWrapper projectId={projectId} minTier={video.minTier} variant="thumbnail">
                           <img
                             src={video.thumbnail}
                             alt={video.title}
                             className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                           />
                        </PremiumWrapper>
                        <div className="absolute bottom-1 right-1 bg-black text-white text-[10px] font-bold px-1 rounded">12:45</div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                        <h4 className="text-[13px] font-bold text-[#1a1a1a] line-clamp-2 leading-tight uppercase tracking-tight">
                           {video.title}
                        </h4>
                        <div className="text-[11px] text-[#1a1a1a]/60 flex flex-col">
                           <span>Polutek Archive</span>
                           <div className="flex items-center gap-1">
                              <span>12K wyświetleń</span>
                              <span>•</span>
                              <span>1 rok temu</span>
                           </div>
                        </div>
                        {isLocked ? (
                           <span className="text-[8px] font-black uppercase tracking-widest text-[#1a1a1a]/30 italic">Ściśle Tajne</span>
                        ) : (
                           <span className="text-[8px] font-black uppercase tracking-widest text-primary">Unlocked</span>
                        )}
                      </div>
                    </Link>
                );

                // Add donation button after 2 items
                if (i === 1) {
                  acc.push(
                    <div key="donate" className="py-2 border-y border-[#1a1a1a]/5">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/40 italic mb-2 px-2">Wesprzyj Twórcę</h3>
                        <Rewards rewards={campaign.rewards || []} projectId={projectId} />
                    </div>
                  );
                }

                return acc;
            }, [])}

          </aside>

        </div>

      </div>
    </main>
  );
}
