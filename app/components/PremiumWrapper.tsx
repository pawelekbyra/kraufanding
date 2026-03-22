import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { getProjectAccess } from "@/lib/access";
import React from 'react';

interface PremiumWrapperProps {
  children: React.ReactNode;
  teaser?: React.ReactNode | ((userTierLevel: number, isLoggedIn: boolean) => React.ReactNode);
  minTier: number; // 0: Guest, 1: FREE, 2: OBSERVER, 3: WITNESS, 4: INSIDER, 5: ARCHITECT
  projectId: string;
  mediaPath?: string; // Optional path to a gated media asset (e.g., 'v0/video.mp4')
}

/**
 * PremiumWrapper decides whether to render children (premium content)
 * or a teaser/paywall based on the user's tier level for the project.
 */
export default async function PremiumWrapper({
  children,
  teaser,
  minTier,
  projectId,
  mediaPath
}: PremiumWrapperProps) {
  const { userId: clerkUserId } = auth();
  const userTierLevel = await getProjectAccess(clerkUserId, projectId);

  const hasAccess = userTierLevel >= minTier;
  const isLoggedIn = !!clerkUserId;

  if (hasAccess) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-primary/20">
          <div className="bg-primary text-white p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">Weryfikacja Patrona Pomyślna</span>
        </div>
        {mediaPath && (
          <div className="mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-xs font-black uppercase tracking-widest text-primary/60 mb-2">Bezpieczny link do streamu</p>
            <a
              href={`/api/media/${mediaPath}?projectId=${projectId}&minTier=${minTier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-serif italic hover:underline flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              Pobierz chroniony plik: {mediaPath.split('/').pop()}
            </a>
          </div>
        )}
        {children}
      </div>
    );
  }

  // Paywall if no access
  return <PaywallOverlay minTier={minTier} isLoggedIn={isLoggedIn} />;
}

function PaywallOverlay({ minTier, isLoggedIn }: { minTier: number, isLoggedIn: boolean }) {
  const isPatronGated = minTier >= 2;
  const headerText = isPatronGated
    ? "Dołącz do grona Patronów, aby obczaić"
    : "Zaloguj się, aby obczaić materiały operacyjne.";

  const overlayText = isPatronGated
    ? "Ściśle tajne Zostaw napiwek aby obczaić"
    : "Ściśle Tajne Zaloguj się aby obczaić";

  const buttonText = isPatronGated && isLoggedIn ? "Zostaw Napiwek" : (isLoggedIn ? "Dołącz" : "Zaloguj się");

  return (
    <div className="animate-in fade-in duration-700">
      <p className="font-serif italic text-[#1a1a1a]/60 mb-8 leading-relaxed text-lg">
        {headerText}
      </p>
      <div className="aspect-video bg-[#1a1a1a]/5 rounded-[2rem] overflow-hidden mb-4 relative group border border-[#1a1a1a]/10">
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
