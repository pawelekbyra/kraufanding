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
import BrandName from './BrandName';

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
  // 1. Current (selected) video always first
  // 2. LOGGED_IN video (with "nie masz psychy sie zalogować" overlay) second
  // 3. Other videos (PUBLIC first, then VIP)
  const sortedVideos = [...allVideos].sort((a, b) => {
      // Rule 1: Selected video first
      if (a.id === selectedVideo.id) return -1;
      if (b.id === selectedVideo.id) return 1;

      // Rule 2: "LOGGED_IN" video (with paywall overlay) second
      const aIsLoggedInGated = a.tier === 'LOGGED_IN';
      const bIsLoggedInGated = b.tier === 'LOGGED_IN';

      // If we're on the main video, we want a LOGGED_IN video at index 1
      if (selectedVideo.id === mainVideo.id) {
          if (aIsLoggedInGated && !bIsLoggedInGated) return -1;
          if (!aIsLoggedInGated && bIsLoggedInGated) return 1;
      }

      // Rule 3: PUBLIC videos first among others
      const aIsPublic = a.tier === 'PUBLIC' || a.isMainFeatured;
      const bIsPublic = b.tier === 'PUBLIC' || b.isMainFeatured;

      if (aIsPublic && !bIsPublic) return -1;
      if (!aIsPublic && bIsPublic) return 1;

      // Default: keep existing order (createdAt desc)
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
              "group flex gap-2 p-0.5 rounded-lg transition-colors relative",
              isCurrent ? "bg-base-content/10" : "hover:bg-base-content/5"
            )}
          >
            <Link
               href={video.id === mainVideo.id ? "/" : `/?v=${video.id}`}
               scroll={false}
               className="absolute inset-0 z-0"
            />
            <div className="w-[168px] h-[94px] shrink-0 overflow-hidden rounded-lg bg-black relative z-10 group/thumb">
              <Link
                href={video.id === mainVideo.id ? "/" : `/?v=${video.id}`}
                scroll={false}
                className="absolute inset-0 z-20"
              />
              <PremiumWrapper videoId={video.id} videoUrl={video.videoUrl} requiredTier={video.tier} isMainFeatured={video.isMainFeatured} variant="thumbnail">
                 <VideoPlayer video={video} variant="thumbnail" />
              </PremiumWrapper>
              {video.duration && (
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1 rounded z-30 pointer-events-none">
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
                <h4 className="text-[14px] font-bold text-base-content line-clamp-2 leading-[1.2] uppercase tracking-tight">
                   {video.slug === 'independency-2024'
                    ? (isLoggedIn ? (
                        <>{t.welcomeOn} <BrandName /></>
                    ) : t.independencyTitle)
                    : video.title}
                </h4>
              </Link>
              <div className="text-[12px] text-base-content/60 flex flex-col mt-0.5">
                 <Link
                   href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                   className="hover:text-base-content transition-colors hover:underline w-fit relative z-20"
                 >
                   {video.creator?.slug === 'polutek' ? <BrandName /> : (video.creator?.name || 'Anonimowy Twórca')}
                 </Link>
                 <div className="flex items-center gap-1">
                    <span>{mounted ? video.views?.toLocaleString(language === 'pl' ? 'pl-PL' : 'en-US') : video.views} {t.views}</span>
                    {video.publishedAt && (
                        <>
                            <span>•</span>
                            <span>{mounted ? formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true, locale: language === 'pl' ? pl : undefined }) : ''}</span>
                        </>
                    )}
                 </div>
              </div>
              {mounted && (
                hasAccess ? (
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary mt-0.5">{t.available}</span>
                ) : video.tier === 'LOGGED_IN' ? (
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 mt-0.5">{t.loginToWatchShort}</span>
                ) : (
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#1a1a1a]/30 mt-0.5">{t.becomePatron}</span>
                )
              )}
            </div>
          </div>
      );

      // Rule: Donate section always appears after the 2nd item (index 1) in the visual list
      if (i === 1) {
        acc.push(
          <div key="donate" className="py-2 border-y border-base-content/5">
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 mb-1.5 px-2">{t.donate}</h3>
              <VideoPlaylist
                 videoTitle={selectedVideo.title}
              />
          </div>
        );
      }

      return acc;
  }, []);

  return (
    <main className="bg-base-100 min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-6 py-6">


        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <Hero
              video={selectedVideo}
              initialInteraction={userProfile?.initialInteraction}
              initialIsSubscribed={userProfile?.initialIsSubscribed}
            />

            <div className="lg:hidden flex border-b border-base-content/5 mt-4">
               <button
                 onClick={() => setActiveTab('comments')}
                 className={cn(
                   "flex-1 py-3 text-sm font-black uppercase tracking-widest transition-all border-b-2",
                   activeTab === 'comments' ? "border-primary text-primary" : "border-transparent text-base-content/40"
                 )}
               >
                 {t.comments}
               </button>
               <button
                 onClick={() => setActiveTab('videos')}
                 className={cn(
                   "flex-1 py-3 text-sm font-black uppercase tracking-widest transition-all border-b-2",
                   activeTab === 'videos' ? "border-primary text-primary" : "border-transparent text-base-content/40"
                 )}
               >
                 Video
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
                    {searchQuery && (
                      <div className="px-2 pt-4 border-t border-[#1a1a1a]/5 mt-4">
                        <Link
                          href="/"
                          className="btn btn-sm btn-block rounded-none border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all font-black uppercase tracking-widest italic shadow-brutalist-sm"
                        >
                          {language === 'pl' ? '← Wróć do wszystkich' : '← Back to all'}
                        </Link>
                      </div>
                    )}
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
            <div className="flex justify-between items-end border-b border-base-content/5 pb-1 mb-1.5">
              <div className="flex items-center gap-3">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-base-content">
                  {searchQuery ? (language === 'pl' ? 'Wyniki wyszukiwania' : 'Search Results') : t.materials}
                </h3>
              </div>
              <div className="flex gap-5 mb-[-2px]">
                <button
                  onClick={() => { if (setLanguage) setLanguage('pl'); }}
                  className={cn(
                    "text-xs font-black tracking-widest uppercase transition-all",
                    language === 'pl' ? "text-primary border-b-2 border-primary pb-0.5" : "text-base-content/30 hover:text-base-content/60"
                  )}
                >
                  PL
                </button>
                <button
                  onClick={() => { if (setLanguage) setLanguage('en'); }}
                  className={cn(
                    "text-xs font-black tracking-widest uppercase transition-all",
                    language === 'en' ? "text-primary border-b-2 border-primary pb-0.5" : "text-base-content/30 hover:text-base-content/60"
                  )}
                >
                  EN
                </button>
              </div>
            </div>
            {playlistItems.length > 0 ? (
                <>
                  {playlistItems}
                  {searchQuery && (
                    <div className="pt-4 border-t border-base-content/5 mt-4">
                      <Link
                        href="/"
                        className="btn btn-sm btn-block rounded-none border-2 border-base-content bg-base-100 text-base-content hover:bg-base-content hover:text-base-100 transition-all font-black uppercase tracking-widest italic shadow-brutalist-sm"
                      >
                        {language === 'pl' ? '← Wróć do listy' : '← Back to list'}
                      </Link>
                    </div>
                  )}
                </>
            ) : (
                <div className="py-10 text-center">
                    <p className="font-serif italic text-sm opacity-30 mb-6">
                        {language === 'pl' ? 'Brak zeznań dla tej kwerendy.' : 'No evidence found for this query.'}
                    </p>
                    <Link
                      href="/"
                      className="btn btn-sm rounded-none border-2 border-base-content bg-base-100 text-base-content hover:bg-base-content hover:text-base-100 transition-all font-black uppercase tracking-widest italic shadow-brutalist-sm px-6"
                    >
                      {t.showAll}
                    </Link>
                </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
