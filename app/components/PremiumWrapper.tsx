"use client";

import { useAuth, SignInButton } from "@clerk/nextjs";
import React, { useEffect, useState } from 'react';
import { Lock, Gem } from 'lucide-react';

interface PremiumWrapperProps {
  children: React.ReactNode;
  minTier: number; // 0: Guest, 1: FREE, 2: OBSERVER, 3: WITNESS, 4: INSIDER, 5: ARCHITECT
  projectId: string;
  variant?: 'default' | 'thumbnail';
}

/**
 * Client-side PremiumWrapper that checks access via an API or props
 * For now, we'll use a simplified version that handles the UI gating.
 * In a real app, you'd fetch the user's tier level from an API.
 */
export default function PremiumWrapper({
  children,
  minTier,
  projectId,
  variant = 'default'
}: PremiumWrapperProps) {
  const { userId, isLoaded } = useAuth();
  const [userTierLevel, setUserTierLevel] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      if (!isLoaded) return;
      if (!userId) {
        setUserTierLevel(0);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/access?projectId=${projectId}`);
        const data = await response.json();
        setUserTierLevel(data.tierLevel || 1);
      } catch (error) {
        console.error("Error checking access:", error);
        setUserTierLevel(1); // Fallback to FREE if logged in
      } finally {
        setIsLoading(false);
      }
    }

    checkAccess();
  }, [userId, isLoaded, projectId]);

  if (isLoading) {
    return <div className="animate-pulse bg-neutral/5 rounded-xl w-full h-full" />;
  }

  const hasAccess = userTierLevel >= minTier;
  const isLoggedIn = !!userId;

  if (hasAccess) {
    return (
      <div className="animate-in fade-in duration-500 h-full w-full">
        {children}
      </div>
    );
  }

  return <PaywallOverlay minTier={minTier} isLoggedIn={isLoggedIn} variant={variant} />;
}

function PaywallOverlay({ minTier, isLoggedIn, variant }: { minTier: number, isLoggedIn: boolean, variant: 'default' | 'thumbnail' }) {
  const isPatronGated = minTier >= 2;

  // English text as requested
  const mainTitle = "TOP SECRET";
  const subTitle = isPatronGated ? "Patrons Only" : "Sign in to unlock";

  const buttonText = isPatronGated && isLoggedIn ? "Become a Patron" : "Sign In";

  if (variant === 'thumbnail') {
    return (
      <div className="w-full h-full relative group bg-[#1a1a1a] overflow-hidden rounded-lg">
         <div className="absolute inset-0 z-0">
            <div className={`w-full h-full opacity-50 blur-[4px] transition-all duration-700 group-hover:blur-[2px] ${isPatronGated ? 'bg-gradient-to-br from-amber-500/20 to-yellow-600/20' : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20'}`} />
         </div>
         <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-10">
            {isPatronGated ? (
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
      <div className="aspect-video bg-[#0f0f0f] rounded-2xl overflow-hidden relative group border-2 border-white/5 h-full w-full shadow-2xl">
         {/* Background with subtle color tint */}
         <div className="absolute inset-0 z-0">
            <div className={`w-full h-full opacity-40 blur-[15px] transition-all duration-1000 group-hover:scale-110 ${isPatronGated ? 'bg-gradient-to-tr from-amber-900/40 via-yellow-600/20 to-orange-900/40' : 'bg-gradient-to-tr from-blue-900/40 via-indigo-600/20 to-cyan-900/40'}`} />
         </div>

         <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10 bg-black/20 backdrop-blur-[2px]">
            <div className="flex flex-col items-center text-center space-y-2">
               <div className={`p-4 rounded-full mb-2 ${isPatronGated ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]'}`}>
                  {isPatronGated ? <Gem size={48} strokeWidth={1.5} /> : <Lock size={48} strokeWidth={1.5} />}
               </div>
               <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  {mainTitle}
               </h2>
               <p className={`text-sm md:text-base font-black uppercase tracking-[0.4em] ${isPatronGated ? 'text-yellow-500/80' : 'text-blue-500/80'}`}>
                  {subTitle}
               </p>
            </div>

            <div className="pt-4">
               {!isLoggedIn ? (
                 <SignInButton mode="modal">
                   <button className="btn bg-blue-600 hover:bg-blue-500 text-white border-none rounded-full px-12 h-14 text-lg font-black uppercase tracking-widest shadow-[0_8px_25px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95">
                     {buttonText}
                   </button>
                 </SignInButton>
               ) : isPatronGated ? (
                 <a href="#donations" className="btn bg-yellow-500 hover:bg-yellow-400 text-black border-none rounded-full px-12 h-14 text-lg font-black uppercase tracking-widest shadow-[0_8px_25px_rgba(234,179,8,0.4)] transition-all hover:scale-105 active:scale-95">
                   {buttonText}
                 </a>
               ) : null}
            </div>
         </div>
      </div>
    </div>
  );
}
