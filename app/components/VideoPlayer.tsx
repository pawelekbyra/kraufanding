"use client";

import React, { useState } from 'react';
import { useVideoAccess } from './PremiumWrapper';
import { Video } from '@/app/types/video';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

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

    // Reset playing state and trigger autoplay for new video if access is already present
    React.useEffect(() => {
        if (videoUrl) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    }, [video.id, videoUrl]);

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
                "relative w-full h-full group/player overflow-hidden",
                variant === 'hero' ? "cursor-pointer" : "cursor-default"
            )}
            onClick={() => {
                if (variant === 'hero' && videoUrl) setIsPlaying(true);
            }}
        >
            <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover transition duration-1000 grayscale hover:grayscale-0 scale-100 group-hover/player:scale-105"
            />

            {/* Minimalist Overlay */}
            <div className="absolute inset-0 bg-obsidian/10 transition-colors group-hover/player:bg-obsidian/0" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={cn(
                    "bg-white/90 border border-obsidian flex items-center justify-center transition-all duration-300 shadow-brutalist-sm",
                    variant === 'hero'
                        ? "w-20 h-20 group-hover/player:scale-110 group-hover/player:bg-ikb group-hover/player:text-white"
                        : "w-10 h-10 group-hover/player:scale-110 group-hover/player:opacity-100 opacity-0"
                )}>
                    <Play size={variant === 'hero' ? 40 : 20} className={cn("fill-current", variant === 'hero' ? "ml-2" : "ml-1")} />
                </div>
            </div>

            {!videoUrl && (
                <div className="absolute inset-0 bg-obsidian/60 flex items-center justify-center opacity-0 group-hover/player:opacity-100 transition-opacity">
                    <span className="text-white font-mono text-[10px] uppercase font-bold tracking-widest bg-obsidian px-6 py-3 border border-white/20 shadow-brutalist">
                        Archiwum Zastrzeżone
                    </span>
                </div>
            )}

            {/* Accent Border for Hero */}
            {variant === 'hero' && (
                <div className="absolute bottom-4 left-4 border-l-2 border-ikb pl-4 py-2 pointer-events-none opacity-0 group-hover/player:opacity-100 transition-opacity duration-500">
                    <span className="text-white font-mono text-[10px] uppercase tracking-[0.3em] font-bold bg-ikb px-2 py-0.5">
                        ODTWARZAJ
                    </span>
                </div>
            )}
        </div>
    );
}
