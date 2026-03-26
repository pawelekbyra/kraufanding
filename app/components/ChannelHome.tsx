"use client";

import React, { useEffect, useState } from 'react';
import Hero from './Hero';
import VideoPlaylist from './VideoPlaylist';
import PremiumWrapper from './PremiumWrapper';
import VideoPlayer from './VideoPlayer';
import EmbeddedComments from './comments/EmbeddedComments';
import { Video } from '../types/video';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface ChannelHomeProps {
  mainVideo: Video;
  allVideos: Video[];
  currentVideoId?: string;
  userProfile?: {
    id: string;
    email: string;
    imageUrl?: string | null;
    totalPaid: number;
    initialInteraction?: { liked: boolean; disliked: boolean };
    initialIsSubscribed?: boolean;
  } | null;
}

export default function ChannelHome({ mainVideo, allVideos, currentVideoId, userProfile }: ChannelHomeProps) {
  const selectedVideo = allVideos.find(v => v.id === currentVideoId) || mainVideo;
  const [activeTab, setActiveTab] = useState<'comments' | 'videos'>('comments');
  const [mounted, setMounted] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [selectedVideo.id]);

  const prefetchVideoComments = (vidId: string) => {
    queryClient.prefetchInfiniteQuery({
        queryKey: ['comments', vidId],
        queryFn: async () => {
            const url = new URL('/api/comments', window.location.origin);
            url.searchParams.append('videoId', vidId);
            const res = await fetch(url.toString());
            return res.json();
        },
        initialPageParam: '',
    });
  };

  const playlistItems = [...allVideos].sort((a, b) => {
      if (a.id === selectedVideo.id) return -1;
      if (b.id === selectedVideo.id) return 1;
      return 0;
  }).reduce((acc: any[], video, i) => {
      const isCurrent = video.id === selectedVideo.id;
      const isLoggedIn = !!userProfile;
      const hasVIP1 = (userProfile?.totalPaid || 0) >= 5;
      const hasVIP2 = (userProfile?.totalPaid || 0) >= 10;

      const hasAccess = video.tier === 'PUBLIC' ||
                        (video.tier === 'LOGGED_IN' && isLoggedIn) ||
                        (video.tier === 'VIP1' && hasVIP1) ||
                        (video.tier === 'VIP2' && hasVIP2) ||
                        video.isMainFeatured;

      acc.push(
          <div
            key={video.id}
            onMouseEnter={() => prefetchVideoComments(video.id)}
            className={cn(
              "group flex gap-2 p-0.5 rounded-lg transition-colors relative",
              isCurrent ? "bg-[#1a1a1a]/10" : "hover:bg-[#1a1a1a]/5"
            )}
          >
            <Link
               href={video.id === mainVideo.id ? "/" : `/?v=${video.id}`}
               scroll={false}
               className="absolute inset-0 z-0"
            />
            <div className="w-[168px] h-[94px] shrink-0 overflow-hidden rounded-lg bg-black relative z-10">
              <PremiumWrapper videoId={video.id} videoUrl={video.videoUrl} requiredTier={video.tier} isMainFeatured={video.isMainFeatured} variant="thumbnail">
                 <VideoPlayer video={video} variant="thumbnail" />
              </PremiumWrapper>
              {video.duration && (
                <div className="absolute bottom-1 right-1 bg-black text-white text-[10px] font-bold px-1 rounded">
                   {video.duration}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 z-10">
              <Link
                href={video.id === mainVideo.id ? "/" : `/?v=${video.id}`}
                scroll={false}
                className="hover:opacity-80 transition-opacity"
              >
                <h4 className="text-[14px] font-bold text-[#0f0f0f] line-clamp-2 leading-[1.2] uppercase tracking-tight">
                   {video.title}
                </h4>
              </Link>
              <div className="text-[12px] text-[#606060] flex flex-col mt-0.5">
                 <Link
                   href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                   className="hover:text-[#0f0f0f] transition-colors hover:underline w-fit relative z-20"
                 >
                   {video.creator?.name || 'Anonimowy Twórca'}
                 </Link>
                 <div className="flex items-center gap-1">
                    <span>{mounted ? video.views?.toLocaleString('pl-PL') : video.views} wyświetleń</span>
                    {video.publishedAt && (
                        <>
                            <span>•</span>
                            <span>{mounted ? formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true, locale: pl }) : ''}</span>
                        </>
                    )}
                 </div>
              </div>
              {mounted && (
                hasAccess ? (
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary mt-0.5">Dostępne</span>
                ) : video.tier === 'LOGGED_IN' ? (
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 mt-0.5">Log in to watch</span>
                ) : (
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#1a1a1a]/30 mt-0.5">Become a Patron</span>
                )
              )}
            </div>
          </div>
      );

      if (i === 1) {
        acc.push(
          <div key="donate" className="py-2 border-y border-[#1a1a1a]/5">
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/40 mb-1.5 px-2">Wesprzyj Twórcę</h3>
              <VideoPlaylist
                 videoTitle={selectedVideo.title}
              />
          </div>
        );
      }

      return acc;
  }, []);

  return (
    <main className="bg-[#FDFBF7] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <Hero
              video={selectedVideo}
              initialInteraction={userProfile?.initialInteraction}
              initialIsSubscribed={userProfile?.initialIsSubscribed}
            />

            <div className="mt-2.5 bg-[#1a1a1a]/5 rounded-xl p-3 hover:bg-[#1a1a1a]/10 transition-colors cursor-pointer group">
               <div className="flex gap-4 text-[13px] font-bold not-italic">
                  <span className="not-italic">{mounted ? selectedVideo.views?.toLocaleString('pl-PL') : selectedVideo.views} wyświetleń</span>
                  {selectedVideo.publishedAt && (
                      <span className="not-italic">
                          {mounted ? format(new Date(selectedVideo.publishedAt), 'd MMM yyyy', { locale: pl }) : ''}
                      </span>
                  )}
               </div>
               <div className="text-[13px] leading-relaxed whitespace-pre-wrap font-serif text-[#1a1a1a]/90 mt-1">
                  {selectedVideo.description}
               </div>
               <button className="text-[11px] font-bold uppercase mt-2 opacity-60 group-hover:opacity-100">Pokaż więcej</button>
            </div>

            <div className="lg:hidden flex border-b border-[#1a1a1a]/5 mt-4">
               <button
                 onClick={() => setActiveTab('comments')}
                 className={cn(
                   "flex-1 py-3 text-sm font-black uppercase tracking-widest transition-all border-b-2",
                   activeTab === 'comments' ? "border-primary text-primary" : "border-transparent text-[#1a1a1a]/40"
                 )}
               >
                 Komentarze
               </button>
               <button
                 onClick={() => setActiveTab('videos')}
                 className={cn(
                   "flex-1 py-3 text-sm font-black uppercase tracking-widest transition-all border-b-2",
                   activeTab === 'videos' ? "border-primary text-primary" : "border-transparent text-[#1a1a1a]/40"
                 )}
               >
                 Filmy
               </button>
            </div>

            <div className="lg:hidden mt-5">
               {activeTab === 'comments' ? (
                 <EmbeddedComments
                   videoId={selectedVideo.id}
                   userProfile={userProfile}
                 />
               ) : (
                 <div className="space-y-3">
                    {playlistItems}
                 </div>
               )}
            </div>

            <div className="hidden lg:block mt-5">
               <EmbeddedComments
                 videoId={selectedVideo.id}
                 userProfile={userProfile}
               />
            </div>
          </div>

          <aside className="hidden lg:block lg:col-span-4 space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1a1a1a] mb-1.5 border-b border-[#1a1a1a]/5 pb-1">Materiały</h3>
            {playlistItems}
          </aside>
        </div>
      </div>
    </main>
  );
}
