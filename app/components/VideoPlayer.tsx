"use client";

import React, { useState } from 'react';
import { useVideoAccess } from './PremiumWrapper';
import { Video } from '@/app/types/video';
import { cn } from '@/lib/utils';
import { Play } from './icons';

interface VideoPlayerProps {
    video: Video;
    variant?: 'hero' | 'thumbnail';
}

export default function VideoPlayer({ video, variant = 'hero' }: VideoPlayerProps) {
    const { videoUrl } = useVideoAccess();
    const [isPlaying, setIsPlaying] = React.useState(false);

    // Auto-play when video URL is available and it's the main player
    // This effect handles both the initial load and video changes in the hero player
    React.useEffect(() => {
        if (variant === 'hero' && videoUrl) {
            setIsPlaying(true);
        } else if (!videoUrl) {
            setIsPlaying(false);
        }
    }, [videoUrl, variant, video.id]);

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
                "relative w-full h-full group/player overflow-hidden bg-neutral-900",
                variant === 'hero' ? "cursor-pointer" : "cursor-default"
            )}
            onClick={() => {
                if (variant === 'hero' && videoUrl) setIsPlaying(true);
            }}
        >
            {/* Ambient background glow for hero */}
            {variant === 'hero' && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover/player:opacity-100 transition-opacity duration-500" />
            )}

            <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover opacity-90 transition duration-700 group-hover/player:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={cn(
                    "bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 transition-all duration-500",
                    variant === 'hero'
                        ? "w-16 h-16 md:w-24 md:h-24 shadow-2xl group-hover/player:scale-110 group-hover/player:bg-black/90"
                        : "w-10 h-10 shadow-lg group-hover/player:scale-110 opacity-60 group-hover/player:opacity-100"
                )}>
                    <Play
                        size={variant === 'hero' ? 48 : 24}
                        className={cn("text-white fill-current", variant === 'hero' ? "ml-1" : "ml-0.5")}
                    />
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
