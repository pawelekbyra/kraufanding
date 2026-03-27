"use client";

import React, { useState } from 'react';
import { useVideoAccess } from './PremiumWrapper';
import { Video } from '@/app/types/video';
import { cn } from '@/lib/utils';
import { Play, Lock } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface VideoPlayerProps {
    video: Video;
    variant?: 'hero' | 'thumbnail';
}

export default function VideoPlayer({ video, variant = 'hero' }: VideoPlayerProps) {
    const { videoUrl } = useVideoAccess();
    const { t } = useLanguage();
    const [isPlaying, setIsPlaying] = React.useState(false);

    React.useEffect(() => {
        if (variant === 'hero' && videoUrl) {
            setIsPlaying(true);
        }
    }, [videoUrl, variant]);

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
                className="w-full h-full object-contain bg-black shadow-2xl"
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
                className="w-full h-full object-cover opacity-60 transition duration-1000 group-hover/player:scale-105 group-hover/player:opacity-40 filter grayscale-[20%]"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={cn(
                    "bg-amber/90 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transition-all duration-700 shadow-glow-amber",
                    variant === 'hero'
                        ? "w-24 h-24 group-hover/player:scale-110 group-hover/player:bg-amber"
                        : "w-12 h-12 group-hover/player:scale-110 opacity-0 group-hover/player:opacity-100"
                )}>
                    <Play className={cn("text-black fill-current transition-transform duration-500 group-hover/player:scale-110", variant === 'hero' ? "w-10 h-10 ml-1.5" : "w-6 h-6 ml-1")} />
                </div>
            </div>

            {!videoUrl && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/player:opacity-100 transition-all duration-500 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Lock className="text-amber w-6 h-6" />
                        </div>
                        <span className="text-white font-mono text-xs uppercase tracking-[0.3em] bg-white/5 px-6 py-2.5 border border-white/10 backdrop-blur-xl">
                            {t.archiveRestricted}
                        </span>
                    </div>
                </div>
            )}

            {/* Cinematic Frame */}
            <div className="absolute inset-0 border-[24px] border-black/5 pointer-events-none opacity-50" />
        </div>
    );
}
