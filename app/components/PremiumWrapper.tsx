"use client";

import { useAuth, SignInButton } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Lock, Gem } from 'lucide-react';
import { AccessTier } from "@prisma/client";
import { useLanguage } from './LanguageContext';

interface VideoAccessContextType {
  hasAccess: boolean;
  videoUrl: string | null;
  isLoading: boolean;
  effectiveTier: AccessTier;
}

const VideoAccessContext = createContext<VideoAccessContextType>({
  hasAccess: false,
  videoUrl: null,
  isLoading: true,
  effectiveTier: "PUBLIC" as AccessTier,
});

export const useVideoAccess = () => useContext(VideoAccessContext);

interface PremiumWrapperProps {
  children: React.ReactNode;
  videoId: string;
  videoUrl?: string;
  requiredTier?: AccessTier;
  isMainFeatured?: boolean;
  variant?: 'default' | 'thumbnail';
}

export default function PremiumWrapper({
  children,
  videoId,
  videoUrl: directUrl,
  requiredTier: initialTier,
  isMainFeatured,
  variant = 'default'
}: PremiumWrapperProps) {
  const { userId, isLoaded } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(directUrl || null);
  const [dbTier, setDbTier] = useState<AccessTier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const effectiveTier = initialTier || dbTier || ("PUBLIC" as AccessTier);
  const isPublic = isMainFeatured || effectiveTier === "PUBLIC";
  const isUnlockedByAuth = !!userId && effectiveTier === "LOGGED_IN";

  useEffect(() => {
    async function checkAccess() {
      if (isPublic) {
        setHasAccess(true);
        if (directUrl) setVideoUrl(directUrl);
        setIsLoading(false);
        return;
      }

      if (isLoaded && !userId) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      if (!isLoaded || !userId) return;

      try {
        const response = await fetch(`/api/access?videoId=${videoId}`);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        const data = await response.json();
        setHasAccess(data.hasAccess);
        setVideoUrl(data.videoUrl);
        if (data.requiredTier) setDbTier(data.requiredTier);
      } catch (error) {
        console.error("Error checking video access:", error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAccess();
  }, [userId, isLoaded, videoId, isPublic, directUrl]);

  if (!mounted) {
    return <div className="animate-pulse bg-neutral/5 rounded-xl w-full h-full" />;
  }

  const contextValue = { hasAccess: isPublic || isUnlockedByAuth || hasAccess, videoUrl, isLoading, effectiveTier };

  if (contextValue.hasAccess) {
    return (
      <VideoAccessContext.Provider value={contextValue}>
        <div className="animate-in fade-in duration-500 h-full w-full">
          {children}
        </div>
      </VideoAccessContext.Provider>
    );
  }

  if (isLoading) {
    if (isLoaded && !userId && !isPublic) {
        return <PaywallOverlay requiredTier={effectiveTier} isLoggedIn={false} variant={variant} />;
    }
    return <div className="animate-pulse bg-neutral/5 rounded-xl w-full h-full" />;
  }

  return (
    <VideoAccessContext.Provider value={contextValue}>
      <PaywallOverlay requiredTier={effectiveTier} isLoggedIn={!!userId} variant={variant} />
    </VideoAccessContext.Provider>
  );
}

function PaywallOverlay({ requiredTier, isLoggedIn, variant }: { requiredTier: AccessTier, isLoggedIn: boolean, variant: 'default' | 'thumbnail' }) {
  const { t } = useLanguage();
  const isVIPGated = requiredTier === "VIP1" || requiredTier === "VIP2";

  const subTitle = (requiredTier === "LOGGED_IN" && !isLoggedIn)
    ? t.loginToWatch
    : t.becomePatron;

  if (variant === 'thumbnail') {
    return (
      <div className="w-full h-full relative group bg-black overflow-hidden rounded-lg border border-white/10">
         <div className="absolute inset-0 z-0 opacity-40">
            <div className={`w-full h-full blur-[8px] transition-all duration-700 group-hover:scale-110 ${isVIPGated ? 'bg-gradient-to-br from-amber-900 to-black' : 'bg-gradient-to-br from-neutral-800 to-black'}`} />
         </div>
         <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-10 gap-1.5">
            {isVIPGated ? (
              <Gem className="w-5 h-5 text-yellow-500 mb-1 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
            ) : (
              <Lock className="w-5 h-5 text-white/40" />
            )}
            <div className="flex flex-col gap-0.5 leading-[0.9]">
               <span className="text-[10px] font-black text-white uppercase tracking-tighter italic">
                  {t.paywallText}
               </span>
               <span className="text-[10px] font-black text-primary uppercase tracking-tighter italic">
                  {t.paywallAction}
               </span>
            </div>
            <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em] mt-1 pt-1 border-t border-white/10 w-16">
               {subTitle}
            </span>
         </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 h-full w-full relative">
      <div className="aspect-video bg-black rounded-2xl overflow-hidden relative group border-4 border-black h-full w-full shadow-2xl">
         {/* Brutalist Investigative Background */}
         <div className="absolute inset-0 z-0">
            <div className={`w-full h-full opacity-20 blur-[40px] transition-all duration-1000 group-hover:scale-110 ${isVIPGated ? 'bg-amber-600' : 'bg-neutral-600'}`} />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
         </div>

         <div className="absolute inset-0 flex flex-col items-center justify-center gap-12 z-10 bg-black/60 backdrop-blur-[12px]">
            <div className="flex flex-col items-center text-center space-y-12 w-full max-w-2xl px-6">
               <div className={`relative ${isVIPGated ? 'text-yellow-500' : 'text-white'}`}>
                  {isVIPGated ? (
                    <Gem size={100} strokeWidth={1.5} className="drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]" />
                  ) : (
                    <Lock size={100} strokeWidth={1.5} className="drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] opacity-40" />
                  )}
               </div>

               <div className="flex flex-col gap-4 w-full">
                  {(!isLoggedIn && requiredTier === 'LOGGED_IN') ? (
                    <div className="flex flex-col gap-6 items-center">
                      <div className="flex flex-col gap-2">
                        <span className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic text-white leading-[0.8] drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                          {t.paywallText}
                        </span>
                        <SignInButton mode="modal">
                          <button className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic text-primary leading-[0.8] hover:scale-105 transition-transform cursor-pointer drop-shadow-[0_5px_15px_rgba(var(--p),0.3)] decoration-primary underline decoration-8 underline-offset-8">
                            {t.paywallAction}
                          </button>
                        </SignInButton>
                      </div>
                      <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.4em] pt-4">
                         Authentication Required // Evidence Gated
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 items-center">
                       <span className={`text-4xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.8] ${isVIPGated ? 'text-yellow-500' : 'text-white'}`}>
                          {subTitle}
                       </span>
                       <a href="#donations" className="btn btn-primary rounded-none px-12 h-14 font-black uppercase tracking-widest text-sm hover:translate-x-1 hover:translate-y-1 transition-all shadow-brutalist active:translate-x-2 active:translate-y-2">
                          Unlock Access
                       </a>
                    </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
