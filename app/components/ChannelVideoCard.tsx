"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MoreVertical, Eye, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import PremiumWrapper from './PremiumWrapper';
import { Video } from '@/app/types/video';
import VideoPlayer from './VideoPlayer';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

interface ChannelVideoCardProps {
    video: Video;
    userTotalPaid: number;
    isLoggedIn: boolean;
}

export default function ChannelVideoCard({ video, userTotalPaid, isLoggedIn }: ChannelVideoCardProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const hasVIP1 = userTotalPaid >= 5;
    const hasVIP2 = userTotalPaid >= 10;

    const hasAccess = video.tier === 'PUBLIC' ||
                      (video.tier === 'LOGGED_IN' && isLoggedIn) ||
                      (video.tier === 'VIP1' && hasVIP1) ||
                      (video.tier === 'VIP2' && hasVIP2) ||
                      video.isMainFeatured;

    return (
        <div className="group cursor-pointer flex flex-col transition-all duration-500 hover:-translate-y-1">
            <div className="block relative">
                <Link href={video.isMainFeatured ? "/" : `/?v=${video.id}`} className="absolute inset-0 z-0" />
                <div className="relative aspect-video rounded-xl overflow-hidden bg-obsidian-900 border border-white/5 mb-3 z-10 group-hover:border-primary/30 group-hover:shadow-glow transition-all duration-500">
                    <PremiumWrapper
                        videoId={video.id}
                        videoUrl={video.videoUrl}
                        requiredTier={video.tier}
                        isMainFeatured={video.isMainFeatured}
                        variant="thumbnail"
                    >
                        <VideoPlayer video={video} variant="thumbnail" />
                    </PremiumWrapper>
                    {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-obsidian-950/80 backdrop-blur-md text-white text-[10px] font-black font-mono px-1.5 py-0.5 rounded border border-white/10">
                            {video.duration}
                        </div>
                    )}
                    {/* Access Indicator Badge on Thumbnail */}
                    {mounted && !hasAccess && (
                        <div className="absolute top-2 right-2 bg-primary/20 backdrop-blur-md text-primary text-[10px] font-black uppercase px-2 py-1 rounded-md border border-primary/30 tracking-widest shadow-lg">
                            {video.tier === 'LOGGED_IN' ? 'Login' : 'Premium'}
                        </div>
                    )}
                </div>
                <div className="flex gap-3 relative z-10 px-1">
                    <div className="flex-1 min-w-0">
                        <Link href={video.isMainFeatured ? "/" : `/?v=${video.id}`}>
                            <h3 className="text-sm md:text-base font-serif font-black text-white leading-tight line-clamp-2 uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">
                                {video.title}
                            </h3>
                        </Link>
                        <div className="flex flex-col gap-1 text-[11px] font-mono uppercase tracking-widest text-white/40">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                  <Eye size={12} className="text-primary/60" />
                                  {mounted ? video.views.toLocaleString('pl-PL') : video.views}
                                </span>
                                {video.publishedAt && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                          <Clock size={12} className="text-primary/60" />
                                          {mounted ? formatDistanceToNow(new Date(video.publishedAt), { addSuffix: false, locale: pl }) : ''}
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="mt-1">
                                {mounted && (
                                    hasAccess ? (
                                        <span className="text-[10px] font-black text-primary/80">Otwarty dostęp</span>
                                    ) : (
                                        <span className={cn(
                                            "text-[10px] font-black",
                                            video.tier === 'LOGGED_IN' ? "text-blue-400" : "text-amber-400"
                                        )}>
                                            {video.tier === 'LOGGED_IN' ? 'Zaloguj się' : 'Dla Patronów'}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <button className="h-fit p-1.5 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 shrink-0 text-white/40">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
