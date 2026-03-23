"use client";

import { useAuth, SignInButton } from "@clerk/nextjs";
import React, { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';

interface PremiumWrapperProps {
  children: React.ReactNode;
  minTier: number;
  projectId: string;
  variant?: 'default' | 'thumbnail';
}

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
        setUserTierLevel(1);
      } finally {
        setIsLoading(false);
      }
    }

    checkAccess();
  }, [userId, isLoaded, projectId]);

  if (isLoading) {
    return <div className="animate-pulse bg-muted rounded-lg w-full h-full" />;
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

  const overlayText = isPatronGated
    ? "Zostaw napiwek aby obczaic"
    : "Zaloguj sie aby obczaic";

  const buttonText = isPatronGated && isLoggedIn ? "Zostaw Napiwek" : "Zaloguj sie";

  if (variant === 'thumbnail') {
    return (
      <div className="w-full h-full relative group bg-foreground/10 overflow-hidden rounded-md">
         <img
           src={isPatronGated ? "https://picsum.photos/seed/secret-thumb/400/225" : "https://picsum.photos/seed/ops-thumb/400/225"}
           alt="Locked"
           className="object-cover w-full h-full opacity-30 blur-[3px] grayscale"
         />
         <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-foreground/20">
            <Lock className="w-5 h-5 text-background/60 mb-1" strokeWidth={2.5} />
            <span className="font-sans text-[8px] font-semibold text-background uppercase tracking-wider opacity-90 leading-tight">
               {overlayText}
            </span>
         </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 h-full w-full relative">
      <div className="aspect-video bg-muted rounded-lg overflow-hidden relative group border border-border h-full w-full">
         <img
           src={isPatronGated ? "https://picsum.photos/seed/secret/1200/800" : "https://picsum.photos/seed/operational/1200/800"}
           alt="Locked"
           className="object-cover w-full h-full opacity-40 blur-[8px] grayscale transform group-hover:scale-105 transition-all duration-1000"
         />
         <div className="absolute inset-0 bg-foreground/10 flex flex-col items-center justify-center gap-3">
            {!isLoggedIn ? (
              <SignInButton mode="modal">
                <div className="flex flex-col items-center cursor-pointer group/btn">
                   <button className="bg-foreground text-background font-sans text-sm font-semibold uppercase tracking-wider px-8 py-3 rounded-lg shadow-xl group-hover/btn:bg-accent group-hover/btn:scale-105 transition-all duration-300">
                     {buttonText}
                   </button>
                   <span className="font-sans text-xs font-semibold text-background uppercase tracking-wider drop-shadow-lg mt-3 bg-foreground/60 px-4 py-1.5 rounded-full backdrop-blur-sm">
                     {overlayText}
                   </span>
                </div>
              </SignInButton>
            ) : isPatronGated ? (
              <div className="flex flex-col items-center">
                <a 
                  href="#rewards" 
                  className="bg-foreground text-background font-sans text-sm font-semibold uppercase tracking-wider px-8 py-3 rounded-lg shadow-xl hover:bg-accent hover:scale-105 transition-all duration-300"
                >
                  {buttonText}
                </a>
                <span className="font-sans text-xs font-semibold text-background uppercase tracking-wider drop-shadow-lg mt-3 bg-foreground/60 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  {overlayText}
                </span>
              </div>
            ) : null}
         </div>
      </div>
    </div>
  );
}
