"use client";

import React, { useState } from 'react';
import { useVideoAccess } from './PremiumWrapper';
import { Video } from '@/app/types/video';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
    video: Video;
    variant?: 'hero' | 'thumbnail';
}

export default function VideoPlayer({ video, variant = 'hero' }: VideoPlayerProps) {
    const { videoUrl } = useVideoAccess();
    const [isPlaying, setIsPlaying] = React.useState(false);

    // Auto-play when video URL is available and it's the main player
    React.useEffect(() => {
        if (variant === 'hero' && videoUrl) {
            setIsPlaying(true);
        }
    }, [videoUrl, variant]);

    if (videoUrl && isPlaying) {
        return (
            <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
            />
        );
    }

    return (
        <div
            className={cn(
                "relative w-full h-full group/player",
                variant === 'hero' ? "cursor-pointer" : "cursor-default"
            )}
            onClick={() => {
                if (variant === 'hero' && videoUrl) setIsPlaying(true);
            }}
        >
            <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover opacity-90 transition duration-1000 group-hover/player:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={cn(
                    "bg-primary/90 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/20 transition-all duration-500",
                    variant === 'hero'
                        ? "w-20 h-20 shadow-[0_0_50px_rgba(var(--p),0.5)] group-hover/player:scale-110 group-hover/player:bg-primary"
                        : "w-10 h-10 shadow-[0_0_20px_rgba(var(--p),0.4)] group-hover/player:scale-110 group-hover/player:opacity-100 opacity-80"
                )}>
                    <svg className={cn("text-white fill-current", variant === 'hero' ? "w-10 h-10 ml-1" : "w-5 h-5 ml-0.5")} viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>
            {!videoUrl && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/player:opacity-100 transition-opacity">
                    <span className="text-white font-mono text-[10px] uppercase tracking-widest bg-black/60 px-4 py-2 border border-white/20">
                        Access Restricted
                    </span>
                </div>
            )}
        </div>
    );
}
