"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MoreVertical, Lock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import PremiumWrapper from './PremiumWrapper';
import { Video } from '@/app/types/video';
import VideoPlayer from './VideoPlayer';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useLanguage } from './LanguageContext';

interface ChannelVideoCardProps {
    video: Video;
    userTotalPaid: number;
    isLoggedIn: boolean;
}

export default function ChannelVideoCard({ video, userTotalPaid, isLoggedIn }: ChannelVideoCardProps) {
    const { t, language } = useLanguage();
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
        <div className="group cursor-pointer flex flex-col bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-500 rounded-3xl p-4 relative overflow-hidden">
            <div className="block relative">
                <Link href={video.isMainFeatured ? "/" : `/?v=${video.id}`} className="absolute inset-0 z-0" />
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black mb-4 z-10 border border-white/5">
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
                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono tracking-widest px-2 py-0.5 border border-white/10">
                            {video.duration}
                        </div>
                    )}
                    {/* Access Indicator Badge on Thumbnail */}
                    {mounted && !hasAccess && (
                        <div className="absolute top-3 right-3 bg-amber/90 backdrop-blur-md text-black text-[10px] font-black uppercase px-2 py-1 border border-white/20 tracking-widest shadow-lg">
                           <Lock size={12} className="inline mr-1 mb-0.5" />
                           {video.tier === 'LOGGED_IN' ? (language === 'pl' ? 'Login' : 'Login') : (language === 'pl' ? 'Patron' : 'Patron')}
                        </div>
                    )}
                </div>
                <div className="flex gap-2 relative z-10 px-1">
                    <div className="flex-1 min-w-0">
                        <Link href={video.isMainFeatured ? "/" : `/?v=${video.id}`}>
                            <h3 className="text-lg font-serif font-black text-white leading-tight line-clamp-2 uppercase tracking-tight mb-2 hover:text-amber transition-colors">
                                {video.title}
                            </h3>
                        </Link>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-[11px] font-mono text-white/40 uppercase tracking-widest">
                                <span>{mounted ? video.views.toLocaleString('pl-PL') : video.views} {t.views}</span>
                                {video.publishedAt && (
                                    <>
                                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                                        <span>{mounted ? formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true, locale: pl }) : ''}</span>
                                    </>
                                )}
                            </div>
                            <div className="mt-1">
                                {mounted && (
                                    hasAccess ? (
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber flex items-center gap-1.5 opacity-60">
                                            <Play size={10} className="fill-amber" /> {t.authorized}
                                        </span>
                                    ) : (
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5",
                                            video.tier === 'LOGGED_IN' ? "text-indigo" : "text-white/20"
                                        )}>
                                            <Lock size={10} /> {video.tier === 'LOGGED_IN' ? t.accessKeyRequired : t.restrictedEntry}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <button className="h-fit p-1.5 hover:bg-white/5 rounded-full transition-colors opacity-0 group-hover:opacity-100 shrink-0 text-white/40 hover:text-white">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Cinematic Noise & Glow Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-amber" />
        </div>
    );
}
