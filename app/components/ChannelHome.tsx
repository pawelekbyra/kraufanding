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
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useLanguage } from './LanguageContext';
import { useSearchParams } from 'next/navigation';

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
  const { t, language } = useLanguage();
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
              "group flex gap-3 p-2 rounded-xl transition-all relative",
              isCurrent ? "bg-white/10 shadow-aurora" : "hover:bg-white/5"
            )}
          >
            <Link
               href={video.id === mainVideo.id ? "/" : `/?v=${video.id}`}
               scroll={false}
               className="absolute inset-0 z-0"
            />
            <div className="w-[160px] h-[90px] shrink-0 overflow-hidden rounded-lg bg-black relative z-10 shadow-sm border border-white/5">
              <Link
                href={video.id === mainVideo.id ? "/" : `/?v=${video.id}`}
                scroll={false}
                className="absolute inset-0 z-20"
              />
              <PremiumWrapper videoId={video.id} videoUrl={video.videoUrl} requiredTier={video.tier} isMainFeatured={video.isMainFeatured} variant="thumbnail">
                 <VideoPlayer video={video} variant="thumbnail" />
              </PremiumWrapper>
              {video.duration && (
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-black px-1.5 py-0.5 rounded z-30 pointer-events-none">
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
                <h4 className="text-sm font-black text-white line-clamp-2 leading-tight uppercase tracking-tight">
                   {video.title}
                </h4>
              </Link>
              <div className="text-[12px] text-white/50 font-medium">
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
                  <span className="text-[9px] font-black uppercase tracking-widest text-secondary mt-0.5">{language === 'pl' ? 'Zaloguj się aby obejrzeć' : 'Log in to watch'}</span>
                ) : (
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-0.5">{language === 'pl' ? 'Zostań Patronem' : 'Become a Patron'}</span>
                )
              )}
            </div>
          </div>
      );

      if (i === 1) {
        acc.push(
          <div key="donate" className="py-4 border-y border-white/5 my-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 px-2">{t.donate}</h3>
              <VideoPlaylist
                 videoTitle={selectedVideo.title}
              />
          </div>
        );
      }

      return acc;
  }, []);

  return (
    <main className="bg-transparent min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <Hero
              video={selectedVideo}
              initialInteraction={userProfile?.initialInteraction}
              initialIsSubscribed={userProfile?.initialIsSubscribed}
            />

            <div className="lg:hidden flex border-b border-white/5 mt-8">
               <button
                 onClick={() => setActiveTab('comments')}
                 className={cn(
                   "flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2",
                   activeTab === 'comments' ? "border-primary text-primary" : "border-transparent text-white/40"
                 )}
               >
                 {t.comments}
               </button>
               <button
                 onClick={() => setActiveTab('videos')}
                 className={cn(
                   "flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2",
                   activeTab === 'videos' ? "border-primary text-primary" : "border-transparent text-white/40"
                 )}
               >
                 {language === 'pl' ? 'Wideo' : 'Videos'}
               </button>
            </div>

            <div className="lg:hidden mt-8">
               {activeTab === 'comments' ? (
                 <EmbeddedComments
                   videoId={selectedVideo.id}
                   userProfile={userProfile}
                 />
               ) : (
                 <div className="space-y-4">
                    {playlistItems}
                    {searchQuery && (
                      <div className="px-2 pt-6 border-t border-white/5 mt-6">
                        <Link
                          href="/"
                          className="btn btn-primary btn-block rounded-full font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                        >
                          {language === 'pl' ? '← Wróć do wszystkich' : '← Back to all'}
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
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
                {searchQuery ? (language === 'pl' ? 'Wyniki wyszukiwania' : 'Search Results') : t.materials}
              </h3>
            </div>
            {playlistItems.length > 0 ? (
                <div className="space-y-1">
                  {playlistItems}
                  {searchQuery && (
                    <div className="pt-6 border-t border-white/5 mt-6">
                      <Link
                        href="/"
                        className="btn btn-primary btn-block rounded-full font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                      >
                        {language === 'pl' ? '← Wróć do listy' : '← Back to list'}
                      </Link>
                    </div>
                  )}
                </div>
            ) : (
                <div className="py-12 text-center bg-white/5 rounded-2xl border border-white/5">
                    <p className="font-sans text-sm text-white/30 mb-6 italic">
                        {language === 'pl' ? 'Brak zeznań dla tej kwerendy.' : 'No evidence found for this query.'}
                    </p>
                    <Link
                      href="/"
                      className="btn btn-primary btn-sm rounded-full font-black uppercase tracking-widest px-8 shadow-lg shadow-primary/20"
                    >
                      {language === 'pl' ? 'Pokaż wszystko' : 'Show all'}
                    </Link>
                </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
