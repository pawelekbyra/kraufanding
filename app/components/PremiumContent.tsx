import { auth } from "@clerk/nextjs/server";
import React from 'react';
import { SignInButton } from "@clerk/nextjs";
import { getProjectAccess } from '@/lib/access';

interface PremiumContentProps {
  children: React.ReactNode;
  minTier?: number;
  projectId: string;
  projectName?: string;
}

export default async function PremiumContent({
  children,
  minTier = 2,
  projectId,
  projectName = "POLUTEK.PL"
}: PremiumContentProps) {
  const { userId } = auth();
  const hasAccess = await getProjectAccess(userId, projectId, minTier);

  // 0. GUEST (Unauthenticated)
  if (!userId) {
    return (
      <div className="p-12 bg-cream border-2 border-dashed border-neutral/20 rounded-3xl flex flex-col items-center text-center shadow-inner">
        <div className="w-16 h-16 bg-neutral/5 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-40">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Locked Content</h3>
        <p className="mb-8 opacity-70 max-w-md font-serif italic text-lg leading-relaxed">
          Access to this confidential material is restricted. Please register for free
          to unlock our introductory content and join the {projectName} circle.
        </p>
        <SignInButton mode="modal">
          <button className="btn btn-primary btn-lg px-12 font-black tracking-widest shadow-xl">
            REGISTER FOR FREE
          </button>
        </SignInButton>
      </div>
    );
  }

  if (!hasAccess) {
    const tierNames = ["GUEST", "FREE", "OBSERVER", "WITNESS", "INSIDER", "ARCHITECT"];
    const targetTierName = tierNames[minTier] || "PATRON";

    return (
      <div className="space-y-12">
        {/* PAYWALL */}
        <div className="p-12 bg-white border-4 border-double border-neutral/10 rounded-3xl flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-primary/40"></div>
          <div className="w-16 h-16 bg-neutral/5 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Become {minTier >= 3 ? "a " + targetTierName : "an " + targetTierName}</h3>
          <p className="mb-8 opacity-70 max-w-md font-serif text-lg leading-relaxed">
            Support the project to unlock the full archive of evidence,
            high-resolution media, and exclusive project updates.
          </p>
          <button className="btn btn-primary btn-lg px-12 font-black tracking-widest shadow-xl group">
            UNLOCK {targetTierName} ACCESS
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
          <p className="mt-6 text-xs font-bold uppercase tracking-widest opacity-30 italic">One-time payment = Permanent Access</p>
        </div>
      </div>
    );
  }

  // PATRON (Verified Access)
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-primary/20">
        <div className="bg-primary text-white p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">Patron Verified Access</span>
      </div>
      {children}
    </div>
  );
}
