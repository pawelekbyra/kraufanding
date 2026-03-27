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
import { useLanguage } from './LanguageContext';

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

import { useSearchParams } from 'next/navigation';

export default function ChannelHome({ mainVideo, allVideos, currentVideoId, userProfile }: ChannelHomeProps) {
  const { t, language, setLanguage } = useLanguage();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q');
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

  // CUSTOM SORTING LOGIC:
  const sortedVideos = [...allVideos].sort((a, b) => {
      if (a.id === selectedVideo.id) return -1;
      if (b.id === selectedVideo.id) return 1;
      const aIsLoggedInGated = a.tier === 'LOGGED_IN';
      const bIsLoggedInGated = b.tier === 'LOGGED_IN';
      if (selectedVideo.id === mainVideo.id) {
          if (aIsLoggedInGated && !bIsLoggedInGated) return -1;
          if (!aIsLoggedInGated && bIsLoggedInGated) return 1;
      }
      const aIsPublic = a.tier === 'PUBLIC' || a.isMainFeatured;
      const bIsPublic = b.tier === 'PUBLIC' || b.isMainFeatured;
      if (aIsPublic && !bIsPublic) return -1;
      if (!aIsPublic && bIsPublic) return 1;
      return 0;
  });

  const playlistItems = sortedVideos.reduce((acc: any[], video, i) => {
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
              "group flex gap-3 p-1 transition-all relative border border-transparent",
              isCurrent ? "bg-white border-obsidian shadow-brutalist-sm" : "hover:bg-obsidian/5"
            )}
          >
            <Link
               href={video.id === mainVideo.id ? "/" : `/?v=${video.id}`}
               scroll={false}
               className="absolute inset-0 z-0"
            />
            <div className="w-[160px] h-[90px] shrink-0 overflow-hidden bg-black relative z-10 border border-obsidian/10 group-hover:border-obsidian transition-colors">
              <Link
                href={video.id === mainVideo.id ? "/" : `/?v=${video.id}`}
                scroll={false}
                className="absolute inset-0 z-20"
              />
              <PremiumWrapper videoId={video.id} videoUrl={video.videoUrl} requiredTier={video.tier} isMainFeatured={video.isMainFeatured} variant="thumbnail">
                 <VideoPlayer video={video} variant="thumbnail" />
              </PremiumWrapper>
              {video.duration && (
                <div className="absolute bottom-1 right-1 bg-obsidian text-white text-[9px] font-mono font-bold px-1 rounded-none z-30 pointer-events-none">
                   {video.duration}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 z-10">
              <Link
                href={video.id === mainVideo.id ? "/" : `/?v=${video.id}`}
                scroll={false}
                className="hover:text-ikb transition-colors"
              >
                <h4 className="text-[14px] font-black text-obsidian line-clamp-2 leading-[1.1] uppercase tracking-tighter italic">
                   {video.title}
                </h4>
              </Link>
              <div className="text-[10px] text-obsidian/50 font-mono font-bold flex flex-col mt-0.5 uppercase tracking-widest">
                 <Link
                   href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                   className="hover:text-ikb transition-colors w-fit relative z-20"
                 >
                   {video.creator?.name || 'Anonimowy Twórca'}
                 </Link>
                 <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-obsidian/80">{mounted ? video.views?.toLocaleString(language === 'pl' ? 'pl-PL' : 'en-US') : video.views} {t.views}</span>
                    {video.publishedAt && (
                        <>
                            <span className="opacity-30">/</span>
                            <span>{mounted ? formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true, locale: language === 'pl' ? pl : undefined }) : ''}</span>
                        </>
                    )}
                 </div>
              </div>
              {mounted && (
                hasAccess ? (
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-ikb mt-1 border-b border-ikb/20 w-fit">{t.available}</span>
                ) : (
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white bg-obsidian px-1.5 py-0.5 mt-1 w-fit">
                    {video.tier === 'LOGGED_IN' ? 'Zaloguj się' : 'Zostań Patronem'}
                  </span>
                )
              )}
            </div>
          </div>
      );

      if (i === 1) {
        acc.push(
          <div key="donate" className="py-4 border-y border-obsidian/10">
              <h3 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-obsidian/30 mb-3 px-2">WSPARCIE PROJEKTU</h3>
              <VideoPlaylist
                 videoTitle={selectedVideo.title}
              />
          </div>
        );
      }

      return acc;
  }, []);

  return (
    <main className="bg-linen min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <Hero
              video={selectedVideo}
              initialInteraction={userProfile?.initialInteraction}
              initialIsSubscribed={userProfile?.initialIsSubscribed}
            />

            <div className="lg:hidden flex border-b border-obsidian/10 mt-6 bg-white shadow-brutalist-sm">
               <button
                 onClick={() => setActiveTab('comments')}
                 className={cn(
                   "flex-1 py-4 text-[12px] font-mono font-black uppercase tracking-[0.2em] transition-all border-b-2",
                   activeTab === 'comments' ? "border-ikb text-ikb" : "border-transparent text-obsidian/40"
                 )}
               >
                 {t.comments}
               </button>
               <button
                 onClick={() => setActiveTab('videos')}
                 className={cn(
                   "flex-1 py-4 text-[12px] font-mono font-black uppercase tracking-[0.2em] transition-all border-b-2",
                   activeTab === 'videos' ? "border-ikb text-ikb" : "border-transparent text-obsidian/40"
                 )}
               >
                 Video
               </button>
            </div>

            <div className="lg:hidden mt-6">
               {activeTab === 'comments' ? (
                 <EmbeddedComments
                   videoId={selectedVideo.id}
                   userProfile={userProfile}
                 />
               ) : (
                 <div className="space-y-4">
                    {playlistItems}
                    {searchQuery && (
                      <div className="px-2 pt-6 border-t border-obsidian/10 mt-6">
                        <Link
                          href="/"
                          className="btn btn-sm btn-block rounded-none border border-obsidian bg-white text-obsidian hover:bg-obsidian hover:text-white transition-all font-mono font-bold uppercase tracking-widest italic shadow-brutalist-sm"
                        >
                          {language === 'pl' ? '← WRÓĆ DO WSZYSTKICH' : '← BACK TO ALL'}
                        </Link>
                      </div>
                    )}
                 </div>
               )}
            </div>

            <div className="hidden lg:block mt-8">
               <EmbeddedComments
                 videoId={selectedVideo.id}
                 userProfile={userProfile}
               />
            </div>
          </div>

          <aside className="hidden lg:block lg:col-span-4 space-y-4">
            <div className="flex justify-between items-end border-b-2 border-obsidian pb-2 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-ikb" />
                <h3 className="text-[12px] font-mono font-black uppercase tracking-[0.3em] text-obsidian">
                  {searchQuery ? (language === 'pl' ? 'WYNIKI WYSZUKIWANIA' : 'SEARCH RESULTS') : t.materials}
                </h3>
              </div>
              <div className="flex gap-4 mb-[-2px]">
                <button
                  onClick={() => { if (setLanguage) setLanguage('pl'); }}
                  className={cn(
                    "text-[10px] font-mono font-black tracking-widest uppercase transition-all",
                    language === 'pl' ? "text-ikb border-b-2 border-ikb pb-1" : "text-obsidian/30 hover:text-obsidian/60"
                  )}
                >
                  PL
                </button>
                <button
                  onClick={() => { if (setLanguage) setLanguage('en'); }}
                  className={cn(
                    "text-[10px] font-mono font-black tracking-widest uppercase transition-all",
                    language === 'en' ? "text-ikb border-b-2 border-ikb pb-1" : "text-obsidian/30 hover:text-obsidian/60"
                  )}
                >
                  EN
                </button>
              </div>
            </div>
            {playlistItems.length > 0 ? (
                <div className="space-y-3">
                  {playlistItems}
                  {searchQuery && (
                    <div className="pt-6 border-t border-obsidian/10 mt-6">
                      <Link
                        href="/"
                        className="btn btn-sm btn-block rounded-none border border-obsidian bg-white text-obsidian hover:bg-obsidian hover:text-white transition-all font-mono font-bold uppercase tracking-widest italic shadow-brutalist-sm"
                      >
                        {language === 'pl' ? '← WRÓĆ DO LISTY' : '← BACK TO LIST'}
                      </Link>
                    </div>
                  )}
                </div>
            ) : (
                <div className="py-16 text-center bg-white border border-obsidian/10 shadow-inner">
                    <p className="font-serif italic text-sm text-obsidian/40 mb-8">
                        {language === 'pl' ? 'Brak zeznań dla tej kwerendy.' : 'No evidence found for this query.'}
                    </p>
                    <Link
                      href="/"
                      className="btn btn-sm rounded-none border border-obsidian bg-white text-obsidian hover:bg-obsidian hover:text-white transition-all font-mono font-bold uppercase tracking-widest italic shadow-brutalist-sm px-8"
                    >
                      {language === 'pl' ? 'POKAŻ WSZYSTKO' : 'SHOW ALL'}
                    </Link>
                </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
