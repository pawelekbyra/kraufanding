"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
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
        <div className="group cursor-pointer flex flex-col bg-white/5 rounded-2xl p-3 border border-white/5 hover:border-primary/50 transition-all hover:shadow-aurora">
            <div className="block relative">
                <Link href={video.isMainFeatured ? "/" : `/?v=${video.id}`} className="absolute inset-0 z-0" />
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-4 z-10 shadow-sm border border-white/5">
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
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-black px-1.5 py-0.5 rounded shadow-lg z-30 pointer-events-none">
                            {video.duration}
                        </div>
                    )}
                    {mounted && !hasAccess && (
                        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase px-2 py-1 rounded-md border border-white/10 tracking-widest z-30 shadow-lg">
                            {video.tier === 'LOGGED_IN' ? 'Login Req' : 'Patron Only'}
                        </div>
                    )}
                </div>
                <div className="flex gap-3 relative z-10 px-1">
                    <div className="flex-1 min-w-0">
                        <Link href={video.isMainFeatured ? "/" : `/?v=${video.id}`}>
                            <h3 className="text-sm font-black text-white leading-tight line-clamp-2 uppercase tracking-tight mb-2 hover:text-primary transition-colors">
                                {video.title}
                            </h3>
                        </Link>
                        <div className="text-[12px] text-white/50 font-medium leading-relaxed">
                            <div className="flex items-center gap-1.5">
                                <span>{mounted ? video.views.toLocaleString('pl-PL') : video.views} wyświetleń</span>
                                {video.publishedAt && (
                                    <>
                                        <span className="opacity-30">•</span>
                                        <span>{mounted ? formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true, locale: pl }) : ''}</span>
                                    </>
                                )}
                            </div>
                            <div className="mt-2">
                                {mounted && (
                                    hasAccess ? (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">Dostępne</span>
                                    ) : (
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                            video.tier === 'LOGGED_IN' ? "text-secondary bg-secondary/10" : "text-white/20 bg-white/5"
                                        )}>
                                            {video.tier === 'LOGGED_IN' ? 'Zaloguj się' : 'Dla Patronów'}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <button className="h-fit p-1.5 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 shrink-0 text-white/50 hover:text-white">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
