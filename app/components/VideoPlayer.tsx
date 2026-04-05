"use client";

import React, { useState, useEffect } from 'react';
import { useVideoAccess } from './PremiumWrapper';
import { Video as VideoType } from '@/app/types/video';
import { cn } from '@/lib/utils';
import { Play } from './icons';

// Plyr Imports
import { Plyr } from 'plyr-react';
import 'plyr/dist/plyr.css';

interface VideoPlayerProps {
    video: VideoType;
    variant?: 'hero' | 'thumbnail';
}

export default function VideoPlayer({ video, variant = 'hero' }: VideoPlayerProps) {
    const { videoUrl } = useVideoAccess();
    const [isMounted, setIsMounted] = useState(false);
    const plyrRef = React.useRef<any>(null);

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

    const plyrSource: any = {
        type: 'video',
        title: video.title,
        sources: [
            {
                src: videoUrl,
                type: 'video/mp4',
            },
        ],
        poster: video.thumbnailUrl,
    };

    const plyrOptions = {
        autoplay: variant === 'hero',
        muted: true, // Force muted for reliable initialization
        clickToPlay: true,
        controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'mute',
            'volume',
            'captions',
            'settings',
            'pip',
            'airplay',
            'fullscreen',
        ],
        ratio: '16:9',
        keyboard: { focused: true, global: true },
        tooltips: { controls: true, seek: true },
    };

    const handlePlayerClick = (e: React.MouseEvent) => {
        // Only toggle play if clicking on the video area or the overlay,
        // but NOT on the controls. Plyr controls are usually inside .plyr__controls
        const target = e.target as HTMLElement;
        if (target.closest('.plyr__controls')) return;

        if (plyrRef.current?.plyr) {
            plyrRef.current.plyr.togglePlay();
        }
    };

    return (
        <div
            className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center plyr-cyber-archive cursor-pointer"
            onClick={handlePlayerClick}
        >
            <div className="w-full max-w-full h-full flex items-center justify-center">
                 <Plyr ref={plyrRef} source={plyrSource} options={plyrOptions} />
            </div>

            <style jsx global>{`
                .plyr-cyber-archive {
                    --plyr-color-main: #3b82f6;
                    --plyr-video-background: #000;
                    --plyr-font-family: var(--font-space-grotesk), sans-serif;
                }
                .plyr--video {
                    height: 100%;
                    width: 100%;
                }
                .plyr__video-wrapper {
                    height: 100% !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .plyr--full-ui.plyr--video .plyr__control--overlaid {
                    background: #3b82f6;
                }
                .plyr--full-ui input[type=range] {
                    color: #3b82f6;
                }
                .plyr__poster {
                    background-size: cover;
                }
            `}</style>
        </div>
    );
}
