"use client";

import React, { useState } from 'react';
import { useVideoAccess } from './PremiumWrapper';
import { Video } from '@/app/types/video';

interface VideoPlayerProps {
    video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
    const { videoUrl } = useVideoAccess();
    const [isPlaying, setIsPlaying] = useState(false);

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
            className="relative w-full h-full cursor-pointer group/player"
            onClick={() => { if (videoUrl) setIsPlaying(true); }}
        >
            <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover opacity-90 transition duration-1000 group-hover/player:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-primary/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(var(--p),0.5)] border-2 border-white/20 transition-all duration-300 group-hover/player:scale-110 group-hover/player:bg-primary">
                    <svg className="w-10 h-10 text-white fill-current ml-1" viewBox="0 0 24 24">
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
