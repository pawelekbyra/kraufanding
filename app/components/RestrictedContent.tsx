import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/app/lib/prisma';
import { SignInButton } from '@clerk/nextjs';
import UpgradeButton from './UpgradeButton';

interface RestrictedContentProps {
  freeSample: React.ReactNode;
  premiumContent: React.ReactNode;
}

/**
 * Server Component for "Hermetic Protection" of premium content.
 * Conditionally renders content on the server so unauthorized users
 * never receive the premium RSC payload.
 */
export default async function RestrictedContent({
  freeSample,
  premiumContent
}: RestrictedContentProps) {
  const { userId } = auth();

  // 1. GUEST STATE (Unauthenticated)
  if (!userId) {
    return (
      <div className="mt-8 p-8 bg-cream border-2 border-dashed border-neutral/20 rounded-2xl flex flex-col items-center text-center shadow-inner">
        <div className="w-16 h-16 bg-neutral/5 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-40">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2 text-charcoal">Restricted Content</h3>
        <p className="mb-6 opacity-70 max-w-md text-charcoal">
          Join the movement. Register for free to unlock a sample of our premium materials and get on the list.
        </p>
        <SignInButton mode="modal">
          <button className="btn btn-primary px-8">Register for Free Access</button>
        </SignInButton>
      </div>
    );
  }

  // 2. FETCH STATUS FROM PRISMA
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { status: true }
  });

  const status = user?.status || 'FREE';

  // 3. PATRON STATE (Authorized)
  if (status === 'PATRON') {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm mb-4">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          Patron Access Unlocked
        </div>
        {premiumContent}
        <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl">
          <h4 className="font-bold mb-2 flex items-center gap-2 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            Vercel Blob Media
          </h4>
          <p className="text-sm opacity-70 text-charcoal">
            Securely hosted multimedia assets for our inner circle.
          </p>
        </div>
      </div>
    );
  }

  // 4. FREE STATE (Authenticated but not Patron)
  return (
    <div className="space-y-12">
      <div className="opacity-100 transition-opacity duration-1000">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-charcoal">
           <span className="w-8 h-[2px] bg-primary"></span>
           Free Sample
        </h3>
        {freeSample}
      </div>

      <div className="relative p-1 bg-gradient-to-br from-primary/30 via-neutral/5 to-primary/30 rounded-[2.5rem] overflow-hidden">
        <div className="bg-white p-10 md:p-14 rounded-[2.3rem] flex flex-col items-center text-center shadow-xl">
           <div className="mb-8 p-4 bg-primary/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black mb-4 text-charcoal">Unlock Full Archive</h3>
          <p className="mb-10 text-xl opacity-70 leading-relaxed max-w-xl text-charcoal">
            You&apos;re seeing a small sample. To access the full library of evidence,
            behind-the-scenes logs, and exclusive videos, become a patron today.
          </p>

          <div className="w-full max-w-sm space-y-4">
            <UpgradeButton
              amount={2500}
              mode="payment"
              className="btn btn-primary btn-lg btn-block text-xl font-black tracking-widest hover:scale-105 transition-transform shadow-xl"
            >
              UPGRADE TO PATRON
            </UpgradeButton>
            <p className="text-xs uppercase tracking-widest opacity-40 font-bold text-charcoal">
              Secure Checkout via Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
