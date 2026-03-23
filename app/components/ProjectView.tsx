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
import { Lock, Eye, Clock } from 'lucide-react';

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
    <main className="bg-background min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-4">

        <div className="grid grid-cols-12 gap-6">

          {/* Main Content */}
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

            {/* Description Box */}
            <div className="mt-3 bg-card rounded-lg p-4 hover:bg-muted/50 transition-all duration-300 cursor-pointer group border border-border/50">
              <div className="flex items-center gap-3 font-sans text-sm font-medium text-foreground">
                <span className="flex items-center gap-1.5">
                  <Eye size={14} className="text-muted-foreground" />
                  {(project as any).views?.toLocaleString('pl-PL') || '124 562'} wyswietlen
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-muted-foreground" />
                  {currentVideo?.publishedAt || '21 mar 2025'}
                </span>
              </div>
              <div className="font-serif text-sm leading-relaxed text-foreground/80 mt-2">
                {currentVideo?.description || project.description}
                <br />
                <span className="text-muted-foreground italic">
                  Zapraszam do obczajenia moich nowych materialow wideo. Zostajac Patronem, zyskujesz staly dostep do tajnych materialow operacyjnych.
                </span>
              </div>
              <button className="font-sans text-xs font-semibold uppercase tracking-wider mt-3 text-muted-foreground group-hover:text-foreground transition-colors">
                Pokaz wiecej
              </button>
            </div>

            {/* Comments */}
            <div className="mt-6">
              <EmbeddedComments
                entityId={currentVideoId}
                entityType="VIDEO"
                userProfile={userProfile}
                showMocks={project.slug !== 'secret-project'}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-foreground">Materialy</h3>
              <span className="font-sans text-xs text-muted-foreground">{project.materials?.length || 0} wideo</span>
            </div>

            {/* Playlist */}
            <div className="space-y-2">
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
                          "group flex gap-3 p-2 rounded-lg transition-all duration-300",
                          isCurrent 
                            ? "bg-secondary border border-border" 
                            : "hover:bg-muted/50 border border-transparent"
                        )}
                      >
                        <div className="w-[160px] h-[90px] shrink-0 overflow-hidden rounded-md bg-foreground/5 relative">
                          <PremiumWrapper projectId={projectId} minTier={video.minTier} variant="thumbnail">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                            />
                          </PremiumWrapper>
                          <div className="absolute bottom-1.5 right-1.5 bg-foreground/90 text-background text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded">
                            12:45
                          </div>
                          {isCurrent && (
                            <div className="absolute inset-0 border-2 border-accent rounded-md" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                          <h4 className="font-serif text-sm font-medium text-foreground line-clamp-2 leading-snug">
                            {video.title}
                          </h4>
                          <div className="font-sans text-xs text-muted-foreground flex flex-col gap-0.5">
                            <span>Polutek Archive</span>
                            <div className="flex items-center gap-1">
                              <span>12K wyswietlen</span>
                              <span>-</span>
                              <span>1 rok temu</span>
                            </div>
                          </div>
                          {isLocked ? (
                            <span className="inline-flex items-center gap-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                              <Lock size={10} />
                              Dla Patronow
                            </span>
                          ) : (
                            <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-accent mt-0.5">
                              Dostepne
                            </span>
                          )}
                        </div>
                      </Link>
                  );

                  if (i === 1) {
                    acc.push(
                      <div key="donate" className="py-3 my-2 border-y border-border">
                        <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-2 px-1">
                          Wesprzyj Tworce
                        </h3>
                        <VideoPlaylist projectId={projectId} />
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
