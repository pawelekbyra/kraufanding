"use client";

import { useAuth, SignInButton } from "@clerk/nextjs";
import React, { useEffect, useState } from 'react';
import { Lock, Gem } from 'lucide-react';
import { AccessTier } from "@prisma/client";

interface PremiumWrapperProps {
  children: React.ReactNode;
  videoId: string;
  variant?: 'default' | 'thumbnail';
}

/**
 * Client-side PremiumWrapper that checks video access via an API.
 * Gates content based on the user's lifetime 'totalPaid' amount.
 */
export default function PremiumWrapper({
  children,
  videoId,
  variant = 'default'
}: PremiumWrapperProps) {
  const { userId, isLoaded } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [requiredTier, setRequiredTier] = useState<AccessTier>(AccessTier.PUBLIC);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      if (!isLoaded) return;

      try {
        const response = await fetch(`/api/access?videoId=${videoId}`);
        const data = await response.json();
        setHasAccess(data.hasAccess);
        setRequiredTier(data.requiredTier);
      } catch (error) {
        console.error("Error checking video access:", error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAccess();
  }, [userId, isLoaded, videoId]);

  if (isLoading) {
    return <div className="animate-pulse bg-neutral/5 rounded-xl w-full h-full" />;
  }

  if (hasAccess) {
    return (
      <div className="animate-in fade-in duration-500 h-full w-full">
        {children}
      </div>
    );
  }

  const isLoggedIn = !!userId;
  return <PaywallOverlay requiredTier={requiredTier} isLoggedIn={isLoggedIn} variant={variant} />;
}

function PaywallOverlay({ requiredTier, isLoggedIn, variant }: { requiredTier: AccessTier, isLoggedIn: boolean, variant: 'default' | 'thumbnail' }) {
  const isVIPGated = requiredTier === AccessTier.VIP1 || requiredTier === AccessTier.VIP2;

  // Technical labels matching the requested "identical" thumbnail style
  const mainTitle = "TOP SECRET";

  // LOGIC:
  // 1. If not logged in and tier is LOGGED_IN -> "Sign in to unlock"
  // 2. If tier is VIP1/VIP2 -> "Become a Patron" (regardless of login state, but buttons differ)
  const subTitle = (requiredTier === AccessTier.LOGGED_IN && !isLoggedIn)
    ? "Sign in to unlock"
    : "Become a Patron";

  if (variant === 'thumbnail') {
    return (
      <div className="w-full h-full relative group bg-[#1a1a1a] overflow-hidden rounded-lg">
         <div className="absolute inset-0 z-0">
            <div className={`w-full h-full opacity-50 blur-[4px] transition-all duration-700 group-hover:blur-[2px] ${isVIPGated ? 'bg-gradient-to-br from-amber-500/20 to-yellow-600/20' : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20'}`} />
         </div>
         <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-10">
            {isVIPGated ? (
              <Gem className="w-5 h-5 text-yellow-400 mb-1 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
            ) : (
              <Lock className="w-5 h-5 text-blue-400 mb-1 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
            )}
            <span className="text-[8px] font-black text-white uppercase tracking-[0.1em] leading-tight">
               {mainTitle}
            </span>
            <span className="text-[6px] font-bold text-white/60 uppercase tracking-widest mt-0.5">
               {subTitle}
            </span>
         </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 h-full w-full relative">
      <div className="aspect-video bg-[#1a1a1a] rounded-2xl overflow-hidden relative group border-2 border-white/5 h-full w-full shadow-2xl">
         <div className="absolute inset-0 z-0">
            <div className={`w-full h-full opacity-50 blur-[15px] transition-all duration-1000 group-hover:scale-110 ${isVIPGated ? 'bg-gradient-to-br from-amber-500/20 to-yellow-600/20' : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20'}`} />
         </div>

         <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-black/10 backdrop-blur-[2px]">
            <div className="flex flex-col items-center text-center space-y-2">
               <div className={`p-4 rounded-full mb-1 ${isVIPGated ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_40px_rgba(250,204,21,0.4)]' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_40px_rgba(96,165,250,0.4)]'}`}>
                  {isVIPGated ? <Gem size={32} strokeWidth={1.5} /> : <Lock size={32} strokeWidth={1.5} />}
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  {mainTitle}
               </h2>
               <p className={`text-xs md:text-sm font-black uppercase tracking-[0.4em] ${isVIPGated ? 'text-yellow-400/90' : 'text-blue-400/90'}`}>
                  {subTitle}
               </p>
            </div>

            <div className="pt-2">
               {!isLoggedIn ? (
                 <SignInButton mode="modal">
                   <button className="btn bg-blue-600 hover:bg-blue-500 text-white border-none rounded-full px-10 h-12 text-sm font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95">
                     Sign In
                   </button>
                 </SignInButton>
               ) : (
                 <a href="#donations" className="btn bg-yellow-500 hover:bg-yellow-400 text-black border-none rounded-full px-10 h-12 text-sm font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(234,179,8,0.4)] transition-all hover:scale-105 active:scale-95">
                   Become a Patron
                 </a>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
