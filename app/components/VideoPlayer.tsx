"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useVideoAccess } from './PremiumWrapper';
import { Video as VideoType } from '@/app/types/video';
import { cn } from '@/lib/utils';
import {
    Play,
    Pause,
    VolumeUp,
    VolumeDown,
    Mute,
    Maximize,
    Minimize,
    X
} from './icons';

interface VideoPlayerProps {
    video: VideoType;
    variant?: 'hero' | 'thumbnail';
}

export default function VideoPlayer({ video, variant = 'hero' }: VideoPlayerProps) {
    const { videoUrl } = useVideoAccess();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (variant === 'hero' && videoUrl) {
            setIsPlaying(true);
        } else if (!videoUrl) {
            setIsPlaying(false);
        }
    }, [videoUrl, variant, video.id]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const togglePlay = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (videoRef.current) {
            videoRef.current.volume = val;
            videoRef.current.muted = val === 0;
            setIsMuted(val === 0);
        }
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (videoRef.current && !videoRef.current.paused) {
                setShowControls(false);
            }
        }, 3000);
    };

    if (variant === 'thumbnail' || (!videoUrl && !isPlaying)) {
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

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-black group/custom-player overflow-hidden flex items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={videoUrl || undefined}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
                autoPlay={variant === 'hero'}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* CUSTOM CONTROLS OVERLAY */}
            <div
                className={cn(
                    "absolute inset-0 z-20 flex flex-col justify-end transition-opacity duration-300 bg-black/5",
                    showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={togglePlay}
            >
                {/* Big play button in center when paused */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={80} className="text-white drop-shadow-2xl transition-all transform hover:scale-110 cursor-pointer" />
                    </div>
                )}

                {/* BOTTOM CONTROL BAR */}
                <div
                    className="bg-gradient-to-t from-black/90 to-transparent p-4 pt-12"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* PROGRESS BAR */}
                    <div className="relative mb-4 h-[4px] bg-white/10 cursor-pointer group/progress">
                        <div
                            className="absolute top-0 left-0 h-full bg-white transition-all duration-100 ease-out"
                            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                        >
                            {/* Seek handle appearing on hover */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="absolute -top-2 left-0 w-full h-5 opacity-0 cursor-pointer z-10"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button onClick={togglePlay} className="text-white hover:opacity-70 transition-opacity">
                                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                            </button>

                            <div className="flex items-center gap-3 group/volume">
                                <button onClick={toggleMute} className="text-white hover:opacity-70 transition-opacity">
                                    {isMuted || volume === 0 ? <Mute size={22} /> : volume < 0.5 ? <VolumeDown size={22} /> : <VolumeUp size={22} />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-0 group-hover/volume:w-24 transition-all duration-300 h-[2px] appearance-none bg-white/20 accent-white cursor-pointer [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:h-1 [&::-moz-range-thumb]:w-1 [&::-moz-range-thumb]:h-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full shadow-md"
                                />
                            </div>

                            <div className="text-white font-handwriting text-[13px] tracking-widest opacity-90 select-none">
                                {formatTime(currentTime)}<span className="opacity-90 mx-0.5">/</span>{formatTime(duration)}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={toggleFullscreen} className="text-white hover:opacity-80 transition-opacity flex items-center justify-center">
                                {isFullscreen ? <Minimize size={25} /> : <Maximize size={25} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
