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
              "group flex gap-3 p-1 rounded-none transition-all relative border border-transparent",
              isCurrent ? "bg-bone/50 border-ink/10 shadow-sm" : "hover:bg-bone/30 hover:border-ink/5"
            )}
          >
            <Link
               href={video.id === mainVideo.id ? "/" : `/?v=${video.id}`}
               scroll={false}
               className="absolute inset-0 z-0"
            />
            <div className="w-[160px] h-[90px] shrink-0 overflow-hidden rounded-none bg-black relative z-10 group/thumb border border-ink/5 group-hover:border-ink/20 transition-colors shadow-sm">
              <Link
                href={video.id === mainVideo.id ? "/" : `/?v=${video.id}`}
                scroll={false}
                className="absolute inset-0 z-20"
              />
              <PremiumWrapper videoId={video.id} videoUrl={video.videoUrl} requiredTier={video.tier} isMainFeatured={video.isMainFeatured} variant="thumbnail">
                 <VideoPlayer video={video} variant="thumbnail" />
              </PremiumWrapper>
              {video.duration && (
                <div className="absolute bottom-1 right-1 bg-linen/90 text-ink text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-none border border-ink/10 z-30 pointer-events-none tracking-tighter">
                   {video.duration}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 z-10">
              <Link
                href={video.id === mainVideo.id ? "/" : `/?v=${video.id}`}
                scroll={false}
                className="hover:opacity-80 transition-opacity"
              >
                <h4 className={cn(
                  "text-[14px] font-bold line-clamp-2 leading-[1.2] uppercase tracking-tight",
                  isCurrent ? "text-oxblood" : "text-ink"
                )}>
                   {video.title}
                </h4>
              </Link>
              <div className="text-[12px] text-ink/40 flex flex-col mt-0.5 font-mono">
                 <Link
                   href={video.creator?.slug ? `/channel/${video.creator.slug}` : "#"}
                   className="hover:text-ink transition-colors hover:underline w-fit relative z-20"
                 >
                   {video.creator?.name || 'Anonimowy Twórca'}
                 </Link>
                 <div className="flex items-center gap-1.5 opacity-60">
                    <span>{mounted ? video.views?.toLocaleString(language === 'pl' ? 'pl-PL' : 'en-US') : video.views} {t.views}</span>
                    {video.publishedAt && (
                        <>
                            <span>/</span>
                            <span>{mounted ? formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true, locale: language === 'pl' ? pl : undefined }) : ''}</span>
                        </>
                    )}
                 </div>
              </div>
              {mounted && (
                hasAccess ? (
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/60 mt-1">{t.available}</span>
                ) : video.tier === 'LOGGED_IN' ? (
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600/60 mt-1">{language === 'pl' ? 'Pokaż Dowód' : 'Identify'}</span>
                ) : (
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-oxblood/60 mt-1">{language === 'pl' ? 'Zasoby Zastrzeżone' : 'Restricted Access'}</span>
                )
              )}
            </div>
          </div>
      );

      if (i === 1) {
        acc.push(
          <div key="donate" className="py-4 border-y border-ink/5 bg-bone/20">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/30 mb-3 px-2 font-mono">{t.donate}</h3>
              <div className="px-1">
                <VideoPlaylist
                   videoTitle={selectedVideo.title}
                />
              </div>
          </div>
        );
      }

      return acc;
  }, []);

  return (
    <main className="bg-linen min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-8">


        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Hero
              video={selectedVideo}
              initialInteraction={userProfile?.initialInteraction}
              initialIsSubscribed={userProfile?.initialIsSubscribed}
            />

            <div className="lg:hidden flex border-b border-ink/10">
               <button
                 onClick={() => setActiveTab('comments')}
                 className={cn(
                   "flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 font-mono",
                   activeTab === 'comments' ? "border-ink text-ink" : "border-transparent text-ink/20"
                 )}
               >
                 {t.comments}
               </button>
               <button
                 onClick={() => setActiveTab('videos')}
                 className={cn(
                   "flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 font-mono",
                   activeTab === 'videos' ? "border-ink text-ink" : "border-transparent text-ink/20"
                 )}
               >
                 {language === 'pl' ? 'MATERIAŁY' : 'MATERIALS'}
               </button>
            </div>

            <div className="lg:hidden">
               {activeTab === 'comments' ? (
                 <div className="bg-bone/20 p-4 border border-ink/5">
                   <EmbeddedComments
                     videoId={selectedVideo.id}
                     userProfile={userProfile}
                   />
                 </div>
               ) : (
                 <div className="space-y-4">
                    {playlistItems}
                    {searchQuery && (
                      <div className="pt-6 border-t border-ink/10 mt-4">
                        <Link
                          href="/"
                          className="btn btn-block brutalist-button"
                        >
                          {language === 'pl' ? '← WSZYSTKIE ZEZNANIA' : '← ALL EVIDENCE'}
                        </Link>
                      </div>
                    )}
                 </div>
               )}
            </div>

            <div className="hidden lg:block">
               <div className="bg-bone/20 p-6 border border-ink/5 shadow-inner">
                 <EmbeddedComments
                   videoId={selectedVideo.id}
                   userProfile={userProfile}
                 />
               </div>
            </div>
          </div>

          <aside className="hidden lg:block lg:col-span-4 space-y-4 sticky top-24 h-fit">
            <div className="flex justify-between items-end border-b border-ink/10 pb-2 mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-ink/60 font-mono">
                  {searchQuery ? (language === 'pl' ? 'WYNIKI KWERENDY' : 'QUERY RESULTS') : t.materials}
                </h3>
              </div>
              <div className="flex gap-6 mb-[-2px] font-mono">
                <button
                  onClick={() => { if (setLanguage) setLanguage('pl'); }}
                  className={cn(
                    "text-[10px] font-black tracking-[0.2em] uppercase transition-all",
                    language === 'pl' ? "text-oxblood border-b border-oxblood pb-0.5" : "text-ink/20 hover:text-ink/40"
                  )}
                >
                  PL
                </button>
                <button
                  onClick={() => { if (setLanguage) setLanguage('en'); }}
                  className={cn(
                    "text-[10px] font-black tracking-[0.2em] uppercase transition-all",
                    language === 'en' ? "text-oxblood border-b border-oxblood pb-0.5" : "text-ink/20 hover:text-ink/40"
                  )}
                >
                  EN
                </button>
              </div>
            </div>
            {playlistItems.length > 0 ? (
                <div className="space-y-4">
                  {playlistItems}
                  {searchQuery && (
                    <div className="pt-6 border-t border-ink/10 mt-6">
                      <Link
                        href="/"
                        className="btn btn-block brutalist-button italic shadow-sm"
                      >
                        {language === 'pl' ? '← POWRÓT DO KWERENDY' : '← BACK TO QUERY'}
                      </Link>
                    </div>
                  )}
                </div>
            ) : (
                <div className="py-20 text-center border border-ink/10 bg-bone/30">
                    <p className="font-serif italic text-base text-ink/30 mb-8">
                        {language === 'pl' ? 'Brak zeznań dla tej kwerendy.' : 'No evidence found for this query.'}
                    </p>
                    <Link
                      href="/"
                      className="btn brutalist-button px-8 italic shadow-sm"
                    >
                      {language === 'pl' ? 'RESTART KWERENDY' : 'RESTART QUERY'}
                    </Link>
                </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
