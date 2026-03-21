import { auth } from "@clerk/nextjs/server";
import { UserTier } from "@prisma/client";
import React from 'react';
import { SignInButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { getProjectAccess } from "@/lib/access";
import Image from 'next/image';

interface PaywallProps {
  children: React.ReactNode;
  minTier?: number;
  projectId: string;
}

export default async function Paywall({
  children,
  minTier = 2, // Default to OBSERVER
  projectId
}: PaywallProps) {
  const { userId } = auth();
  const userTierLevel = await getProjectAccess(userId, projectId);

  // 0. GUEST (Unauthenticated)
  if (userTierLevel === 0) {
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
          to unlock our introductory content and join the POLUTEK circle.
        </p>
        <SignInButton mode="modal">
          <button className="btn btn-primary btn-lg px-12 font-black tracking-widest shadow-xl">
            REGISTER FOR FREE
          </button>
        </SignInButton>
      </div>
    );
  }

  const hasAccess = userTierLevel >= minTier;

  if (!hasAccess) {
    return (
      <div className="space-y-12">
        {/* FREE SAMPLE (shown to tier 1+) */}
        {userTierLevel >= 1 && (
            <div className="p-8 bg-primary/5 border border-primary/20 rounded-2xl animate-in fade-in duration-700">
            <h4 className="text-primary font-bold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                FREE PREVIEW UNLOCKED
            </h4>
            <p className="font-serif italic opacity-80 mb-6 leading-relaxed">
                As a registered user, you have access to this initial insight. The full investigation
                is reserved for our patrons.
            </p>
            <div className="aspect-video bg-neutral/10 rounded-xl overflow-hidden mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <Image src="https://picsum.photos/seed/sample/800/450" alt="Free Sample" fill className="object-cover opacity-90" />
            </div>
            </div>
        )}

        {/* PAYWALL */}
        <div className="p-12 bg-white border-4 border-double border-neutral/10 rounded-3xl flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-primary/40"></div>
          <div className="w-16 h-16 bg-neutral/5 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">
            {minTier <= 2 ? 'Become an Observer' : `Unlock Level ${minTier}`}
          </h3>
          <p className="mb-8 opacity-70 max-w-md font-serif text-lg leading-relaxed">
            Support the project to unlock the full archive of evidence,
            high-resolution media, and exclusive project updates.
          </p>
          <button className="btn btn-primary btn-lg px-12 font-black tracking-widest shadow-xl group">
            UPGRADE ACCESS
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
          <p className="mt-6 text-xs font-bold uppercase tracking-widest opacity-30 italic">One-time payment = Permanent Access</p>
        </div>
      </div>
    );
  }

  // PATRON (Level 2+)
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
