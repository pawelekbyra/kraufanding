"use client";

import React, { useState, useEffect } from 'react';
import { useVideoAccess } from './PremiumWrapper';
import { Video as VideoType } from '@/app/types/video';
import { cn } from '@/lib/utils';
import { Play } from './icons';

// Vidstack Imports
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
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

    const isHero = variant === 'hero';

    return (
        <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center vds-yt-theme">
            <MediaPlayer
                title={video.title}
                src={videoUrl}
                crossOrigin
                playsInline
                autoplay={isHero}
                muted={isHero}
                className="w-full h-full aspect-video"
            >
                <MediaProvider>
                    <Poster
                        className="vds-poster absolute inset-0 w-full h-full object-cover opacity-0 data-[visible]:opacity-100 transition-opacity duration-500"
                        src={video.thumbnailUrl}
                        alt={video.title}
                    />
                </MediaProvider>
                <DefaultVideoLayout
                    icons={defaultLayoutIcons}
                />
            </MediaPlayer>

            <style jsx global>{`
                /* YouTube-style Customization for Vidstack */
                .vds-yt-theme {
                    --video-brand: #ff0000;
                    --video-controls-bg: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
                    --media-font-family: var(--font-space-grotesk), sans-serif;
                }

                .vds-player {
                    background-color: #000;
                    border-radius: 8px;
                }

                /* Minimalist seek bar that expands on hover - matching YT */
                .vds-time-slider {
                    --slider-track-height: 4px;
                    --slider-thumb-size: 0px;
                    --slider-active-track-bg: var(--video-brand);
                    --slider-buffer-bg: rgba(255, 255, 255, 0.3);
                    --slider-track-bg: rgba(255, 255, 255, 0.2);
                    transition: height 0.1s ease;
                }

                /* Increase hit area for easier scrubbing */
                .vds-time-slider .vds-slider-track {
                    margin-top: 10px;
                    margin-bottom: 10px;
                }

                .vds-player[data-hover] .vds-time-slider,
                .vds-time-slider[data-dragging],
                .vds-time-slider[data-hover] {
                    --slider-track-height: 6px;
                    --slider-thumb-size: 14px;
                }

                /* Controls Layout Overrides */
                .vds-controls-group {
                    padding-bottom: 2px !important;
                }

                /* Icon sizing to match YouTube's chunky feel */
                .vds-icon {
                    width: 26px;
                    height: 26px;
                }

                /* Volume slider behavior - hide unless hovering volume area */
                .vds-volume-slider {
                    width: 0;
                    transition: width 0.2s ease, margin 0.2s ease, opacity 0.2s ease;
                    opacity: 0;
                    margin-left: 0;
                }

                .vds-mute-button:hover + .vds-volume-slider,
                .vds-volume-slider:hover,
                .vds-volume-slider[data-dragging] {
                    width: 60px;
                    opacity: 1;
                    margin-left: 8px;
                }

                /* Tooltip styling - minimalist dark */
                .vds-tooltip-content {
                    background-color: rgba(28, 28, 28, 0.9) !important;
                    backdrop-filter: blur(4px);
                    border-radius: 2px !important;
                    font-size: 12px !important;
                    padding: 5px 8px !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                }

                /* Settings Menu styling */
                .vds-menu-items {
                    background-color: rgba(28, 28, 28, 0.95) !important;
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px !important;
                    padding: 4px !important;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.6);
                }

                .vds-menu-item {
                    font-size: 13px !important;
                    padding: 10px 14px !important;
                    border-radius: 4px !important;
                    transition: background-color 0.2s ease;
                }

                .vds-menu-item[data-focus] {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                }

                /* Big Play Button Fix */
                .vds-play-button[data-paused][data-active] .vds-icon {
                   width: 56px;
                   height: 56px;
                }

                /* Center the controls properly on mobile */
                @media (max-width: 640px) {
                    .vds-player {
                        border-radius: 0;
                    }
                    .vds-time-slider {
                        --slider-track-height: 3px;
                    }
                }
            `}</style>
        </div>
    );
}
