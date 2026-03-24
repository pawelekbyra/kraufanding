"use client";

import React from 'react';
import Hero from './Hero';
import VideoPlaylist from './VideoPlaylist';
import PremiumWrapper from './PremiumWrapper';
import EmbeddedComments from './comments/EmbeddedComments';
import { Project } from '../types/project';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface ProjectViewProps {
  project: Project;
  videoId?: string;
  userProfile?: { id: string; email: string } | null;
  initialLikes?: { [videoId: string]: number };
}

export default function ProjectView({ project, videoId, userProfile, initialLikes }: ProjectViewProps) {
  const projectId = project.id;
  const currentVideoId = videoId || (project.materials?.[0]?.id || 'promo');
  const currentVideo = project.materials?.find(v => v.id === currentVideoId) || project.materials?.[0];

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
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-3">

        {/* YOUTUBE STYLE GRID LAYOUT (12 COLS) */}
        <div className="grid grid-cols-12 gap-5">

          {/* LEFT COLUMN (approx 68%): PLAYER + INFO + COMMENTS */}
          <div className="col-span-12 lg:col-span-8">

            {/* VIDEO PLAYER & METADATA */}
            <Hero project={{
                ...project,
                title: currentVideo?.title || project.title,
                thumbnail: currentVideo?.thumbnail || project.thumbnail,
                minTier: currentVideo?.minTier || 0,
                initialIsLiked: false,
                initialIsSubscribed: false,
                likesCount: currentVideo?.likesCount ?? 0
            }} />

            {/* DESCRIPTION BOX (YOUTUBE STYLE) */}
            <div className="mt-2.5 bg-[#1a1a1a]/5 rounded-xl p-3 hover:bg-[#1a1a1a]/10 transition-colors cursor-pointer group">
               <div className="flex gap-4 text-[13px] font-bold">
                  <span>{(project as any).views?.toLocaleString('pl-PL') || '124 562'} wyświetleń</span>
                  <span>{currentVideo?.publishedAt || '21 mar 2025'}</span>
               </div>
               <div className="text-[13px] leading-relaxed whitespace-pre-wrap font-serif text-[#1a1a1a]/90 mt-1">
                  {currentVideo?.description || project.description}
                  <br />
                  Zapraszam do obczajenia moich nowych materiałów wideo. Zostając Patronem, zyskujesz stały dostęp do tajnych materiałów operacyjnych.
               </div>
               <button className="text-[11px] font-bold uppercase mt-2 opacity-60 group-hover:opacity-100">Pokaż więcej</button>
            </div>

            {/* COMMENTS SECTION */}
            <div className="mt-5">
               <EmbeddedComments
                 entityId={currentVideoId}
                 entityType="VIDEO"
                 userProfile={userProfile}
                 showMocks={project.slug !== 'secret-project'}
               />
            </div>
          </div>

          {/* RIGHT COLUMN (approx 32%): SIDEBAR PLAYLIST */}
          <aside className="col-span-12 lg:col-span-4 space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1a1a1a] mb-1.5 border-b border-[#1a1a1a]/5 pb-1">Materiały</h3>

            {/* PLAYLIST ITEMS */}
            {(project.materials || []).sort((a, b) => {
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
                      href={`/projects/${project.slug}?v=${video.id}`}
                      scroll={false}
                      onMouseEnter={() => prefetchVideo(video.id)}
                      className={cn(
                        "group flex gap-2 p-0.5 rounded-lg transition-colors",
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
                        <h4 className="text-[14px] font-bold text-[#0f0f0f] line-clamp-2 leading-[1.2] uppercase tracking-tight">
                           {video.title}
                        </h4>
                        <div className="text-[12px] text-[#606060] flex flex-col mt-0.5">
                           <span>Polutek Archive</span>
                           <div className="flex items-center gap-1">
                              <span>12K wyświetleń</span>
                              <span>•</span>
                              <span>1 rok temu</span>
                           </div>
                        </div>
                        {isLocked ? (
                           <span className="text-[9px] font-black uppercase tracking-widest text-[#1a1a1a]/30 italic mt-0.5">Dla Patronów</span>
                        ) : (
                           <span className="text-[9px] font-black uppercase tracking-widest text-primary mt-0.5">Dostępne</span>
                        )}
                      </div>
                    </Link>
                );

                // Add donation button after 2 items
                if (i === 1) {
                  acc.push(
                    <div key="donate" className="py-2 border-y border-[#1a1a1a]/5">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/40 italic mb-1.5 px-2">Wesprzyj Twórcę</h3>
                        <VideoPlaylist
                           projectId={projectId}
                           projectSlug={project.slug}
                           projectTitle={project.title}
                        />
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
