"use client";

import { useAuth, SignInButton, useClerk } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Star, Gem } from 'lucide-react';
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

  const handleAuth = () => {
    // Check for referral cookie
    const cookies = document.cookie.split('; ');
    const refCookie = cookies.find(row => row.startsWith('clerk_referrer_id='));
    const referrerId = refCookie ? refCookie.split('=')[1] : undefined;

    if (referrerId) {
      openSignUp({
        unsafeMetadata: {
          referrerId
        }
      });
    } else {
      openSignUp();
    }
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

  const subTitle = (requiredTier === "LOGGED_IN" && !isLoggedIn)
    ? t.loginToWatch
    : t.patronZone;

  if (variant === 'thumbnail') {
    return (
      <div className="w-full h-full relative group bg-black overflow-hidden rounded-lg border border-white/10">
         <div className="absolute inset-0 z-0 opacity-40">
            <div className={`w-full h-full blur-[8px] transition-all duration-700 group-hover:scale-110 ${isVIPGated ? 'bg-amber-950' : 'bg-neutral-900'}`} />
         </div>
         <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-10 gap-1.5">
            {isVIPGated ? (
              <Gem className="w-5 h-5 text-amber-500 mb-1" />
            ) : (
              <Star className="w-5 h-5 text-blue-400 mb-1" />
            )}
            <div className="flex flex-col leading-[1] italic text-center">
               {isVIPGated ? (
                 <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">
                   {t.patronZone}
                 </span>
               ) : (
                 <>
                   <span className="text-[10px] font-black text-white/90 uppercase tracking-tighter">
                      {t.paywallText}
                   </span>
                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">
                      {t.paywallAction}
                   </span>
                 </>
               )}
            </div>
            <span className="text-[6px] font-black text-white/20 uppercase tracking-[0.2em] mt-1 pt-1 border-t border-white/5 w-12">
               {requiredTier}
            </span>
         </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 h-full w-full relative">
      <div className="aspect-video bg-[#0a0a0a] rounded-2xl overflow-hidden relative group border-4 border-black h-full w-full shadow-2xl flex items-center justify-center">

         {/* Minimalist Grid Pattern Background */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

         <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
            <div className="mb-8 transition-all duration-700 group-hover:scale-110">
               {isVIPGated ? (
                 <Gem size={80} strokeWidth={1} className="text-amber-500 opacity-20" />
               ) : (
                 <CustomAuthTrigger>
                    <button className="hover:opacity-40 opacity-20 transition-opacity cursor-pointer">
                      <Star size={80} strokeWidth={1} className="text-blue-400" />
                    </button>
                 </CustomAuthTrigger>
               )}
            </div>

            <div className="flex flex-col gap-2 md:gap-4 mb-4">
               {(!isLoggedIn && requiredTier === 'LOGGED_IN') ? (
                  <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter italic text-white leading-[0.8]">
                        {t.paywallText}
                      </span>
                      <div className="h-px w-32 md:w-48 bg-white/10 my-4" />
                      <span className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter italic text-blue-400 leading-[0.8]">
                        {t.paywallAction}
                      </span>
                    </div>

                    <CustomAuthTrigger>
                       <button className="group flex flex-col items-center gap-2 mt-10">
                          <div className="h-px w-24 bg-white/10 group-hover:w-48 transition-all duration-500" />
                          <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/30 group-hover:text-accent transition-colors underline decoration-accent/60 underline-offset-4 decoration-[1.5px]">
                             {t.loginGatedText}
                          </span>
                       </button>
                    </CustomAuthTrigger>
                  </div>
               ) : (
                  <div className="flex flex-col gap-8 items-center">
                    <span className={`text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-[0.85] ${isVIPGated ? 'text-amber-500' : 'text-white'}`}>
                      {subTitle}
                    </span>
                    <a href="#donations" className="group flex flex-col items-center gap-2">
                       <div className="h-px w-24 bg-white/10 group-hover:w-48 transition-all duration-500" />
                       <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/30 group-hover:text-primary transition-colors">
                          {t.paywallUnlock}
                       </span>
                    </a>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
