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

  // Render teaser if available
  if (teaser) {
    const teaserNode = typeof teaser === 'function' ? teaser(userTierLevel, isLoggedIn) : teaser;
    return (
      <div className="space-y-12">
        <div className="animate-in fade-in duration-700">
          {teaserNode}
        </div>
        {/* PAYWALL */}
        <PaywallOverlay minTier={minTier} isLoggedIn={isLoggedIn} />
      </div>
    );
  }

  // Paywall if no teaser
  return <PaywallOverlay minTier={minTier} isLoggedIn={isLoggedIn} />;
}

function PaywallOverlay({ minTier, isLoggedIn }: { minTier: number, isLoggedIn: boolean }) {
  return (
    <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2rem] overflow-hidden group">
      <h4 className="text-primary font-black mb-4 flex items-center gap-2 uppercase tracking-widest text-xs italic">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        ŚCIŚLE TAJNE
      </h4>
      <p className="font-serif italic opacity-70 mb-8 leading-relaxed text-lg">
        Dołącz do Patronów aby obczaić.
      </p>
      <div className="aspect-video bg-[#1a1a1a]/5 rounded-2xl overflow-hidden mb-4 relative">
         <img
           src="https://picsum.photos/seed/patron/1200/800"
           alt="Locked"
           className="object-cover w-full h-full opacity-40 blur-[10px] grayscale transform group-hover:scale-105 transition-all duration-1000"
         />
         <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="bg-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl border border-[#1a1a1a]/10 text-[#1a1a1a]">Ściśle Tajne</span>
            {!isLoggedIn ? (
              <SignInButton mode="modal">
                <div className="flex flex-col items-center cursor-pointer group/btn">
                   <button className="btn btn-primary btn-xs rounded-lg font-black uppercase tracking-widest px-4 shadow-xl mt-3 group-hover/btn:scale-105 transition-transform">Dołącz do Patronów</button>
                   <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest drop-shadow-md mt-1">aby obczaić</span>
                </div>
              </SignInButton>
            ) : (
              <div className="flex flex-col items-center">
                <a href="#rewards" className="btn btn-primary btn-xs rounded-lg font-black uppercase tracking-widest px-4 shadow-xl mt-3 hover:scale-105 transition-transform">
                  Dołącz do Patronów
                </a>
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest drop-shadow-md mt-1">aby obczaić</span>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
