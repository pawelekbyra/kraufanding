"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import PremiumWrapper from './PremiumWrapper';
import { Video } from '@/app/types/video';
import VideoPlayer from './VideoPlayer';

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
        <div className="group cursor-pointer flex flex-col">
            <div className="block relative">
                <Link href={video.isMainFeatured ? "/" : `/?v=${video.id}`} className="absolute inset-0 z-0" />
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-2.5 z-10">
                    <PremiumWrapper
                        videoId={video.id}
                        videoUrl={video.videoUrl}
                        requiredTier={video.tier}
                        isMainFeatured={video.isMainFeatured}
                        variant="thumbnail"
                    >
                        <VideoPlayer video={video} variant="thumbnail" />
                    </PremiumWrapper>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[12px] font-bold px-1.5 py-0.5 rounded">
                        12:45
                    </div>
                    {/* Access Indicator Badge on Thumbnail */}
                    {mounted && !hasAccess && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase px-2 py-1 rounded-md border border-white/10 tracking-widest">
                            {video.tier === 'LOGGED_IN' ? 'Login Req' : 'Patron Only'}
                        </div>
                    )}
                </div>
                <div className="flex gap-2 relative z-10">
                    <div className="flex-1 min-w-0">
                        <Link href={video.isMainFeatured ? "/" : `/?v=${video.id}`}>
                            <h3 className="text-[14px] font-bold text-[#0f0f0f] leading-tight line-clamp-2 uppercase tracking-tight mb-1 hover:opacity-80 transition-opacity">
                                {video.title}
                            </h3>
                        </Link>
                        <div className="text-[12px] text-[#606060] font-sans leading-relaxed">
                            <div className="flex items-center gap-1">
                                <span>{mounted ? video.views.toLocaleString('pl-PL') : video.views} wyświetleń</span>
                                <span>•</span>
                                <span>2 tyg. temu</span>
                            </div>
                            <div className="mt-0.5">
                                {mounted && (
                                    hasAccess ? (
                                        <span className="text-[11px] font-black uppercase tracking-widest text-primary">Dostępne</span>
                                    ) : (
                                        <span className={cn(
                                            "text-[11px] font-black uppercase tracking-widest",
                                            video.tier === 'LOGGED_IN' ? "text-blue-600" : "text-[#1a1a1a]/40"
                                        )}>
                                            {video.tier === 'LOGGED_IN' ? 'Zaloguj się' : 'Dla Patronów'}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <button className="h-fit p-1 hover:bg-[#000000]/5 rounded-full transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
