"use client";

import React, { useState, useEffect } from 'react';
import { useVideoAccess } from './PremiumWrapper';
import { Video as VideoType } from '@/app/types/video';
import { cn } from '@/lib/utils';
import { Play } from './icons';

// Vidstack Imports
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';

interface VideoPlayerProps {
    video: VideoType;
    variant?: 'hero' | 'thumbnail';
}

export default function VideoPlayer({ video, variant = 'hero' }: VideoPlayerProps) {
    const { videoUrl } = useVideoAccess();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // If it's a thumbnail or we don't have access/URL, show the preview/restricted UI
    if (variant === 'thumbnail' || !videoUrl) {
        return (
            <div
                className={cn(
                    "relative w-full h-full group/player overflow-hidden bg-neutral-900",
                    variant === 'hero' ? "cursor-pointer" : "cursor-default"
                )}
            >
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
                        <Play className={cn("text-white", variant === 'hero' ? "w-8 h-8 md:w-12 md:h-12 ml-1" : "w-5 h-5 ml-0.5")} />
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

    if (!isMounted) return (
        <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center cursor-pointer">
            <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 md:w-24 md:h-24 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                    <Play className="text-white w-8 h-8 md:w-12 md:h-12 ml-1" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
            <MediaPlayer
                title={video.title}
                src={videoUrl}
                poster={video.thumbnailUrl}
                playsInline
                autoPlay={variant === 'hero'}
                muted={variant === 'hero'}
                viewType="video"
                streamType="on-demand"
                logLevel="warn"
                crossOrigin
                load="visible"
                className="w-full h-full bg-black"
                onCanPlay={() => console.log('[VideoPlayer] Media can play')}
                onError={(detail) => console.error('[VideoPlayer] Media error:', detail)}
            >
                <MediaProvider>
                    <img
                        className="vds-poster"
                        src={video.thumbnailUrl}
                        alt={video.title}
                    />
                </MediaProvider>
                <DefaultVideoLayout
                    icons={defaultLayoutIcons}
                />
            </MediaPlayer>

            <style jsx global>{`
                media-player {
                    /* Project accent color - teal */
                    --video-brand: #086f7a;
                    /* Project cream color */
                    --video-controls-color: #FDFBF7;
                    /* Match layout font */
                    --video-font-family: var(--font-space-grotesk), sans-serif;
                    --video-border-radius: 0;
                }

                /* Customizing the seek bar and other elements to feel more brutalist/cyber archive */
                .vds-video-layout {
                    --video-font-family: var(--font-space-grotesk), sans-serif;
                }

                /* Ensure controls have high contrast and fit the theme */
                .vds-controls {
                    --video-controls-bg: rgba(26, 26, 26, 0.7);
                    backdrop-filter: blur(8px);
                }

                .vds-slider-track {
                    background-color: rgba(253, 251, 247, 0.2) !important;
                }

                .vds-slider-track-fill {
                    background-color: #086f7a !important;
                }

                .vds-slider-thumb {
                    background-color: #FDFBF7 !important;
                    border: 1px solid #1a1a1a;
                    border-radius: 0 !important; /* Brutalist sharp edges */
                }
            `}</style>
        </div>
    );
}
