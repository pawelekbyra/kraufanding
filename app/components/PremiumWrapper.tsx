"use client";

import { useAuth, SignInButton } from "@clerk/nextjs";
import React, { useEffect, useState } from 'react';

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
  const headerText = isPatronGated
    ? "Ten materiał jest dostępny tylko dla wspierających"
    : "Zaloguj się, aby obczaić materiały operacyjne.";

  const overlayText = isPatronGated
    ? "Ściśle tajne Zostaw napiwek aby obczaić"
    : "Ściśle Tajne Zaloguj się aby obczaić";

  const buttonText = isPatronGated && isLoggedIn ? "Zostaw Napiwek" : "Zaloguj się";

  if (variant === 'thumbnail') {
    return (
      <div className="w-full h-full relative group bg-black overflow-hidden rounded-lg">
         <img
           src={isPatronGated ? "https://picsum.photos/seed/secret-thumb/400/225" : "https://picsum.photos/seed/ops-thumb/400/225"}
           alt="Locked"
           className="object-cover w-full h-full opacity-30 blur-[4px] grayscale"
         />
         <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-white/40 mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <span className="text-[7px] font-black text-white uppercase tracking-[0.1em] opacity-80 leading-tight">
               {overlayText.replace("Ściśle tajne ", "").replace("Ściśle Tajne ", "")}
            </span>
         </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 h-full w-full relative">
      <div className="aspect-video bg-[#1a1a1a]/5 rounded-xl overflow-hidden relative group border border-[#1a1a1a]/10 h-full w-full">
         <img
           src={isPatronGated ? "https://picsum.photos/seed/secret/1200/800" : "https://picsum.photos/seed/operational/1200/800"}
           alt="Locked"
           className="object-cover w-full h-full opacity-40 blur-[10px] grayscale transform group-hover:scale-105 transition-all duration-1000"
         />
         <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {!isLoggedIn ? (
              <SignInButton mode="modal">
                <div className="flex flex-col items-center cursor-pointer group/btn">
                   <button className="btn btn-primary btn-md rounded-2xl font-black uppercase tracking-widest px-8 shadow-2xl group-hover/btn:scale-105 transition-transform">{buttonText}</button>
                   <span className="text-[12px] font-black text-white uppercase tracking-[0.2em] drop-shadow-lg mt-3 bg-[#1a1a1a]/40 px-4 py-1 rounded-full backdrop-blur-sm">{overlayText}</span>
                </div>
              </SignInButton>
            ) : isPatronGated ? (
              <div className="flex flex-col items-center">
                <a href="#rewards" className="btn btn-primary btn-md rounded-2xl font-black uppercase tracking-widest px-8 shadow-2xl hover:scale-105 transition-transform">
                  {buttonText}
                </a>
                <span className="text-[12px] font-black text-white uppercase tracking-[0.2em] drop-shadow-lg mt-3 bg-[#1a1a1a]/40 px-4 py-1 rounded-full backdrop-blur-sm">{overlayText}</span>
              </div>
            ) : null}
         </div>
      </div>
    </div>
  );
}
