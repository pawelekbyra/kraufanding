"use client";

import { useAuth, SignInButton, useClerk } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Star, Gem, Lock } from './icons';
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

function CustomAuthTrigger({ children }: { children: React.ReactNode }) {
  const { openSignUp } = useClerk();
  const { language } = useLanguage();

  const handleAuth = () => {
    // Check for referral cookie
    const cookies = document.cookie.split('; ');
    const refCookie = cookies.find(row => row.startsWith('clerk_referrer_id='));
    const referrerId = refCookie ? refCookie.split('=')[1] : undefined;

    openSignUp({
      unsafeMetadata: {
        referrerId,
        language: language
      }
    });
  };

  return (
    <div onClick={handleAuth} className="cursor-pointer contents">
      {children}
    </div>
  );
}

function PaywallOverlay({ requiredTier, isLoggedIn, variant }: { requiredTier: AccessTier, isLoggedIn: boolean, variant: 'default' | 'thumbnail' }) {
  const { t } = useLanguage();
  const isVIPGated = requiredTier === "VIP1" || requiredTier === "VIP2";

  const sharedBg = (
    <div className="absolute inset-0 z-0 opacity-50">
        <div className={`w-full h-full blur-[12px] transition-all duration-700 group-hover:scale-110 ${
            isVIPGated
            ? 'bg-gradient-to-br from-amber-900 via-black to-amber-950'
            : 'bg-gradient-to-br from-blue-900 via-black to-blue-950'
        }`} />
    </div>
  );

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 h-full w-full relative group">
      <div className={cn(
          "aspect-video bg-[#0a0a0a] overflow-hidden relative border flex items-center justify-center h-full w-full shadow-2xl",
          variant === 'thumbnail' ? "rounded-lg border-white/10" : "rounded-2xl border-[#1a1a1a]"
      )}>

         {sharedBg}

         <div className="relative z-10 flex flex-col items-center text-center px-4 md:px-6 max-w-4xl">
            <div className={cn(
                "transition-all duration-700 group-hover:scale-110",
                variant === 'thumbnail' ? "mb-2" : "mb-4 md:mb-8"
            )}>
               {isVIPGated ? (
                 <Gem className={cn(
                    "text-amber-500",
                    variant === 'thumbnail' ? "w-10 h-10" : "w-16 h-16 md:w-24 md:h-24"
                 )} />
               ) : (
                 <CustomAuthTrigger>
                    <button className="hover:opacity-40 transition-opacity cursor-pointer">
                      <Lock className={cn(
                        "text-blue-400",
                        variant === 'thumbnail' ? "w-10 h-10" : "w-16 h-16 md:w-24 md:h-24"
                      )} />
                    </button>
                 </CustomAuthTrigger>
               )}
            </div>

            <div className="flex flex-col gap-2 md:gap-6 items-center font-brand font-black">
                <div className="flex flex-col items-center italic">
                    <span className={cn(
                        "uppercase tracking-tighter leading-[0.8] text-center max-w-[90vw]",
                        isVIPGated ? 'text-amber-500' : 'text-white',
                        variant === 'thumbnail' ? "text-lg md:text-xl lg:text-2xl" : "text-[clamp(2rem,8vw,5rem)]"
                    )}>
                        {isVIPGated ? t.patronZone : t.paywallText}
                    </span>
                    {!isVIPGated && (
                         <span className={cn(
                            "uppercase tracking-tighter leading-[0.8] text-blue-400",
                            variant === 'thumbnail' ? "text-lg md:text-xl lg:text-2xl" : "text-[clamp(2rem,8vw,5rem)]"
                         )}>
                            {t.paywallAction}
                        </span>
                    )}
                </div>

                <div className={cn(
                    "group flex flex-col items-center gap-1.5 md:gap-2",
                    variant === 'thumbnail' ? "mt-2" : "mt-4 md:mt-6"
                )}>
                    {isVIPGated ? (
                        <a href="#donations" className="contents">
                            <div className={cn(
                                "h-px bg-white/10 group-hover:w-48 transition-all duration-500",
                                variant === 'thumbnail' ? "w-8" : "w-16 md:w-24"
                            )} />
                            <span className={cn(
                                "font-brand font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-amber-500 transition-colors",
                                variant === 'thumbnail' ? "text-[7px]" : "text-[8px] md:text-[10px] md:tracking-[0.5em]"
                            )}>
                                {t.paywallUnlock}
                            </span>
                        </a>
                    ) : (
                        <CustomAuthTrigger>
                            <button className="contents">
                                <div className={cn(
                                    "h-px bg-white/10 group-hover:w-48 transition-all duration-500",
                                    variant === 'thumbnail' ? "w-8" : "w-16 md:w-24"
                                )} />
                                <span className={cn(
                                    "font-brand font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-primary transition-colors",
                                    variant === 'thumbnail' ? "text-[7px]" : "text-[8px] md:text-[10px] md:tracking-[0.5em]"
                                )}>
                                    {t.loginGatedText}
                                </span>
                            </button>
                        </CustomAuthTrigger>
                    )}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
