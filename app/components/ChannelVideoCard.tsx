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
        <div className="group cursor-pointer flex flex-col transition-all hover:translate-y-[-2px]">
            <div className="block relative">
                <Link href={video.isMainFeatured ? "/" : `/?v=${video.id}`} className="absolute inset-0 z-0" />
                <div className="relative aspect-video overflow-hidden bg-black mb-3 z-10 border border-obsidian/10 shadow-none group-hover:shadow-brutalist-sm group-hover:border-obsidian transition-all duration-300">
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
                        <div className="absolute bottom-2 right-2 bg-obsidian text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-none tracking-tighter">
                            {video.duration}
                        </div>
                    )}
                    {/* Access Indicator Badge on Thumbnail */}
                    {mounted && !hasAccess && (
                        <div className="absolute top-2 right-2 bg-ikb text-white text-[9px] font-mono font-black uppercase px-2 py-1 border border-white/20 tracking-[0.2em] shadow-brutalist-sm">
                            {video.tier === 'LOGGED_IN' ? 'LOGIN' : 'PATRON'}
                        </div>
                    )}
                </div>
                <div className="flex gap-2 relative z-10">
                    <div className="flex-1 min-w-0">
                        <Link href={video.isMainFeatured ? "/" : `/?v=${video.id}`}>
                            <h3 className="text-[15px] font-black text-obsidian leading-tight line-clamp-2 uppercase tracking-tighter mb-2 group-hover:text-ikb transition-colors italic">
                                {video.title}
                            </h3>
                        </Link>
                        <div className="text-[11px] text-obsidian/60 font-mono leading-relaxed uppercase tracking-widest">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-obsidian font-bold">{mounted ? video.views.toLocaleString('pl-PL') : video.views} WYŚWIETLEŃ</span>
                                {video.publishedAt && (
                                    <>
                                        <span className="opacity-30">•</span>
                                        <span>{mounted ? formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true, locale: pl }) : ''}</span>
                                    </>
                                )}
                            </div>
                            <div className="mt-1.5">
                                {mounted && (
                                    hasAccess ? (
                                        <span className="text-ikb font-black border-b-2 border-ikb/20">ARCHIWUM DOSTĘPNE</span>
                                    ) : (
                                        <span className={cn(
                                            "font-black px-1.5 py-0.5",
                                            video.tier === 'LOGGED_IN' ? "bg-ikb text-white" : "bg-obsidian text-white"
                                        )}>
                                            {video.tier === 'LOGGED_IN' ? 'WYMAGA LOGOWANIA' : 'DLA PATRONÓW'}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <button className="h-fit p-1 hover:bg-obsidian/5 rounded-none transition-colors opacity-0 group-hover:opacity-100 shrink-0 border border-transparent hover:border-obsidian/10">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
