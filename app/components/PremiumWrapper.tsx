"use client";

import { useAuth, SignInButton } from "@clerk/nextjs";
import React, { useEffect, useState } from 'react';
import { Lock, Gem } from 'lucide-react';
import { AccessTier } from "@prisma/client";

interface PremiumWrapperProps {
  children: (videoUrl: string | null) => React.ReactNode;
  videoId: string;
  requiredTier?: AccessTier;
  isMainFeatured?: boolean;
  variant?: 'default' | 'thumbnail';
}

/**
 * Client-side PremiumWrapper that gates content based on user access.
 * Optimistically unlocks LOGGED_IN content if a userId is present.
 */
export default function PremiumWrapper({
  children,
  videoId,
  requiredTier: initialTier,
  isMainFeatured,
  variant = 'default'
}: PremiumWrapperProps) {
  const { userId, isLoaded } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [dbTier, setDbTier] = useState<AccessTier | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const effectiveTier = initialTier || dbTier || "PUBLIC";
  const isPublic = isMainFeatured || effectiveTier === "PUBLIC";

  // Optimistic unlock for LOGGED_IN tier if client-side auth is present
  const isUnlockedByAuth = !!userId && effectiveTier === "LOGGED_IN";

  useEffect(() => {
    async function checkAccess() {
      // For all videos (including public ones), we want to fetch the URL
      // from the access API to keep it secure/managed.

      try {
        const response = await fetch(`/api/access?videoId=${videoId}`);

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        setHasAccess(data.hasAccess);
        setVideoUrl(data.videoUrl);
        if (data.requiredTier) setDbTier(data.requiredTier);
      } catch (error) {
        console.error("Error checking video access:", error);
        // Fallback for public content if API fails
        if (isPublic) {
            setHasAccess(true);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoaded) {
        checkAccess();
    }
  }, [userId, isLoaded, videoId, isPublic]);

  // Priority: 1. Main Featured, 2. Public, 3. Account Gated + Signed In
  if (isPublic || isUnlockedByAuth || hasAccess) {
    return (
      <div className="animate-in fade-in duration-500 h-full w-full">
        {children(videoUrl)}
      </div>
    );
  }

  if (isLoading) {
    return <div className="animate-pulse bg-neutral/5 rounded-xl w-full h-full" />;
  }

  return <PaywallOverlay requiredTier={effectiveTier as AccessTier} isLoggedIn={!!userId} variant={variant} />;
}

function PaywallOverlay({ requiredTier, isLoggedIn, variant }: { requiredTier: AccessTier, isLoggedIn: boolean, variant: 'default' | 'thumbnail' }) {
  const isVIPGated = requiredTier === "VIP1" || requiredTier === "VIP2";

  const mainTitle = "TOP SECRET";
  const subTitle = (requiredTier === "LOGGED_IN" && !isLoggedIn)
    ? "Log in to watch"
    : "Become a Patron";

  if (variant === 'thumbnail') {
    return (
      <div className="w-full h-full relative group bg-black overflow-hidden rounded-lg border border-white/5">
         <div className="absolute inset-0 z-0">
            <div className={`w-full h-full opacity-70 blur-[4px] transition-all duration-700 group-hover:blur-[2px] ${isVIPGated ? 'bg-gradient-to-br from-amber-900/60 to-yellow-900/60' : 'bg-gradient-to-br from-blue-900/60 to-indigo-900/60'}`} />
         </div>
         <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-10 bg-black/20">
            {isVIPGated ? (
              <Gem className="w-6 h-6 text-yellow-500 mb-1 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
            ) : (
              <Lock className="w-6 h-6 text-blue-500 mb-1 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            )}
            <span className="text-[10px] font-black text-white uppercase tracking-[0.15em] leading-tight">
               {mainTitle}
            </span>
            <span className="text-[7px] font-black text-white/60 uppercase tracking-widest mt-1 border-t border-white/10 pt-1">
               {subTitle}
            </span>
         </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 h-full w-full relative">
      <div className="aspect-video bg-black rounded-2xl overflow-hidden relative group border-4 border-black h-full w-full shadow-2xl">
         <div className="absolute inset-0 z-0 opacity-40">
            <div className={`w-full h-full blur-[25px] transition-all duration-1000 group-hover:scale-110 ${isVIPGated ? 'bg-gradient-to-br from-amber-600 to-yellow-900' : 'bg-gradient-to-br from-blue-600 to-indigo-900'}`} />
         </div>

         <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10 bg-black/40 backdrop-blur-[6px]">
            <div className="flex flex-col items-center text-center space-y-3">
               <div className={`p-5 rounded-full mb-2 ${isVIPGated ? 'bg-yellow-500/10 text-yellow-400 border-2 border-yellow-500/20 shadow-[0_0_60px_rgba(234,179,8,0.3)]' : 'bg-blue-500/10 text-blue-400 border-2 border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.3)]'}`}>
                  {isVIPGated ? <Gem size={56} strokeWidth={2} /> : <Lock size={56} strokeWidth={2} />}
               </div>
               <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
                  {mainTitle}
               </h2>
               <p className={`text-base md:text-xl font-black uppercase tracking-[0.5em] ${isVIPGated ? 'text-yellow-400' : 'text-blue-400'}`}>
                  {subTitle}
               </p>
            </div>

            <div className="pt-6">
               {!isLoggedIn ? (
                 <SignInButton mode="modal">
                   <button className="btn bg-blue-600 hover:bg-blue-500 text-white border-none rounded-full px-14 h-16 text-xl font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95">
                     Sign In
                   </button>
                 </SignInButton>
               ) : (
                 <a href="#donations" className="btn bg-yellow-500 hover:bg-yellow-400 text-black border-none rounded-full px-14 h-16 text-xl font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(234,179,8,0.4)] transition-all hover:scale-105 active:scale-95">
                   Become a Patron
                 </a>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
