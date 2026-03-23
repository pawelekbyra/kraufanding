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
    <main className="bg-transparent min-h-screen">
      <div className="max-w-[1340px] mx-auto px-4 md:px-8 py-8 animate-fade-in-up">

        {/* ELEGANT GRID LAYOUT */}
        <div className="grid grid-cols-12 gap-10">

          {/* LEFT COLUMN: PLAYER + INFO + COMMENTS */}
          <div className="col-span-12 lg:col-span-8">

            <Hero project={{
                ...project,
                title: currentVideo?.title || project.title,
                thumbnail: currentVideo?.thumbnail || project.thumbnail,
                minTier: currentVideo?.minTier || 0,
                initialIsLiked: false,
                initialIsSubscribed: false,
                likesCount: currentVideo?.likesCount ?? 0
            }} />

            {/* DESCRIPTION BOX - MODERN PREMIUM CARD */}
            <div className="mt-8 bg-white border border-navy/5 rounded-[2rem] p-8 shadow-soft hover:shadow-elegant transition-all cursor-default group">
               <div className="flex gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-gold mb-4 opacity-70">
                  <span>{(project as any).views?.toLocaleString('pl-PL') || '124 562'} Wyświetleń</span>
                  <span>{currentVideo?.publishedAt || '21 mar 2025'}</span>
               </div>
               <div className="text-lg leading-relaxed font-serif italic text-navy/80 mt-2 selection:bg-gold/20">
                  {currentVideo?.description || project.description}
                  <br /><br />
                  <p className="not-italic font-sans text-sm font-medium tracking-wide text-navy/60">
                    Zapraszam do obczajenia moich nowych materiałów wideo. Zostając Patronem, zyskujesz stały dostęp do tajnych materiałów operacyjnych.
                  </p>
               </div>
               <div className="mt-6 pt-6 border-t border-navy/5 flex items-center justify-between">
                  <button className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40 hover:text-gold transition-colors">Pokaż więcej szczegółów</button>
                  <div className="flex gap-4">
                     {/* Tags/Category */}
                     <span className="text-[9px] font-bold bg-navy/5 text-navy/40 px-3 py-1 rounded-full uppercase tracking-widest">Technologia</span>
                     <span className="text-[9px] font-bold bg-gold/5 text-gold/60 px-3 py-1 rounded-full uppercase tracking-widest">Archiwum</span>
                  </div>
               </div>
            </div>

            {/* COMMENTS SECTION */}
            <div className="mt-12">
               <div className="mb-10 flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-navy/5"></div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-navy/30">Dyskusja</h3>
                  <div className="h-[1px] flex-1 bg-navy/5"></div>
               </div>
               <div className="bg-white border border-navy/5 rounded-[2.5rem] p-10 shadow-soft">
                  <EmbeddedComments
                    entityId={currentVideoId}
                    entityType="VIDEO"
                    userProfile={userProfile}
                    showMocks={project.slug !== 'secret-project'}
                  />
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SIDEBAR PLAYLIST - REFINED */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between mb-4 border-b border-navy/5 pb-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-navy">Materiały Operacyjne</h3>
                <span className="text-[10px] font-bold text-gold opacity-50">{(project.materials || []).length} ODCINKÓW</span>
            </div>

            {/* PLAYLIST ITEMS */}
            <div className="space-y-4 max-h-[1200px] overflow-y-auto no-scrollbar pr-1">
                {(project.materials || []).sort((a, b) => {
                    if (a.id === currentVideoId) return -1;
                    if (b.id === currentVideoId) return 1;
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
                            "group flex gap-4 p-3 rounded-2xl transition-all duration-500 relative",
                            isCurrent ? "bg-white shadow-soft ring-1 ring-gold/20" : "hover:bg-white/60 hover:shadow-soft"
                          )}
                        >
                          <div className="w-[140px] h-[80px] shrink-0 overflow-hidden rounded-xl bg-navy/10 relative shadow-sm border border-white">
                            <PremiumWrapper projectId={projectId} minTier={video.minTier} variant="thumbnail">
                               <img
                                 src={video.thumbnail}
                                 alt={video.title}
                                 className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                               />
                            </PremiumWrapper>
                            <div className="absolute bottom-1 right-1 bg-navy text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md bg-opacity-80">12:45</div>
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                            <h4 className={cn(
                                "text-[13px] font-black line-clamp-2 leading-[1.3] uppercase tracking-tight transition-colors",
                                isCurrent ? "text-gold" : "text-navy group-hover:text-gold"
                            )}>
                               {video.title}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] font-bold text-navy/30 uppercase tracking-widest">Archiwum</span>
                                {isLocked ? (
                                   <span className="text-[9px] font-black uppercase tracking-[0.1em] text-gold italic">Tajne</span>
                                ) : (
                                   <span className="text-[9px] font-black uppercase tracking-[0.1em] text-navy/40">Dostępne</span>
                                )}
                            </div>
                          </div>
                        </Link>
                    );

                    // Add donation section after 3 items
                    if (i === 2) {
                      acc.push(
                        <div key="donate" className="py-6 border-y border-navy/5 px-2 my-4 bg-gold/5 rounded-[2rem] border-gold/10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                            <div className="relative">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-4 text-center">Dołącz do Patronów</h3>
                                <VideoPlaylist projectId={projectId} />
                            </div>
                        </div>
                      );
                    }

                    return acc;
                }, [])}
            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}
