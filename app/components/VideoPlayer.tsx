"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useVideoAccess } from './PremiumWrapper';
import { Video as VideoType } from '@/app/types/video';
import { cn } from '@/lib/utils';
import { Play } from './icons';
import Artplayer from 'artplayer';

interface VideoPlayerProps {
    video: VideoType;
    variant?: 'hero' | 'thumbnail';
}

export default function VideoPlayer({ video, variant = 'hero' }: VideoPlayerProps) {
    const { videoUrl } = useVideoAccess();
    const [isMounted, setIsMounted] = useState(false);
    const artRef = useRef<HTMLDivElement>(null);
    const playerInstance = useRef<Artplayer | null>(null);

    useEffect(() => {
        setIsMounted(true);
        return () => {
            if (playerInstance.current) {
                playerInstance.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (isMounted && videoUrl && artRef.current && variant === 'hero') {
            // Clean up previous instance if it exists
            if (playerInstance.current) {
                playerInstance.current.destroy();
            }

            const art = new Artplayer({
                container: artRef.current,
                url: videoUrl,
                poster: video.thumbnailUrl,
                title: video.title,
                volume: 0.5,
                isLive: false,
                muted: variant === 'hero',
                autoplay: variant === 'hero',
                pip: true,
                autoSize: false,
                autoMini: true,
                screenshot: true,
                setting: true,
                loop: false,
                flip: true,
                playbackRate: true,
                aspectRatio: true,
                fullscreen: true,
                fullscreenWeb: true,
                subtitleOffset: true,
                miniProgressBar: true,
                mutex: true,
                backdrop: true,
                playsInline: true,
                autoPlayback: true,
                airplay: true,
                theme: '#FF0000', // YouTube Red
                moreVideoAttr: {
                    crossOrigin: 'anonymous',
                    playsInline: true,
                },
                settings: [
                    {
                        width: 200,
                        html: 'Quality',
                        tooltip: '720P',
                        selector: [
                            {
                                default: true,
                                html: '720P',
                                url: videoUrl,
                            },
                        ],
                        onSelect: function (item) {
                            art.switchQuality(item.url, item.html);
                            return item.html;
                        },
                    },
                ],
                customHotkeys: [
                    {
                        key: ' ',
                        action: () => art.toggle(),
                    },
                ],
            });

            playerInstance.current = art;

            return () => {
                if (playerInstance.current) {
                    playerInstance.current.destroy();
                }
            };
        }
    }, [isMounted, videoUrl, variant, video.thumbnailUrl, video.title]);

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
        <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center cursor-pointer rounded-lg">
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
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group shadow-2xl art-player-container">
            <div ref={artRef} className="w-full h-full" />

            <style jsx global>{`
                .art-player-container .art-video-container {
                    background-color: #000 !important;
                }

                .art-player-container .art-control-progress-inner {
                    background: #FF0000 !important;
                }

                .art-player-container .art-control-progress-handle {
                    background: #FF0000 !important;
                    width: 12px;
                    height: 12px;
                }

                .art-player-container .art-bottom {
                    background: linear-gradient(transparent, rgba(0,0,0,0.7)) !important;
                }

                .art-player-container .art-control {
                    color: #fff !important;
                }

                /* YouTube-style hover effect on progress bar */
                .art-player-container .art-control-progress {
                    height: 4px !important;
                    transition: height 0.1s ease !important;
                }

                .art-player-container:hover .art-control-progress {
                    height: 6px !important;
                }

                @media (max-width: 640px) {
                    .art-player-container {
                        border-radius: 0;
                    }
                }
            `}</style>
        </div>
    );
}
