"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { checkReferralStatus } from '@/lib/actions/referrals';

export default function ReferralTracker() {
  const searchParams = useSearchParams();
  const { userId, isLoaded } = useAuth();
  const ref = searchParams.get('ref');

  // 1. Save ref code to cookie if present in URL
  useEffect(() => {
    if (ref) {
      // Set a cookie that expires in 30 days
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `clerk_referrer_id=${ref}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      console.log(`[ReferralTracker] Saved referrer ID/Code: ${ref}`);
    }
  }, [ref]);

  // 2. If logged in, check if we should claim the referral
  useEffect(() => {
    if (isLoaded && userId) {
      const claimReferral = async () => {
        // Read cookie
        const cookies = document.cookie.split('; ');
        const refCookie = cookies.find(row => row.startsWith('clerk_referrer_id='));
        const refValue = refCookie ? refCookie.split('=')[1] : null;

        if (refValue) {
          try {
            // Check if user already has a referrer in DB to avoid redundant API calls
            const status = await checkReferralStatus();

            if (status.isLoggedIn && !status.hasReferrer) {
              console.log(`[ReferralTracker] Attempting to claim referral: ${refValue}`);

              const response = await fetch('/api/user/referrals/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ referralCode: refValue })
              });

              if (response.ok) {
                console.log(`[ReferralTracker] Referral claimed successfully!`);
                // Remove cookie after successful claim
                document.cookie = "clerk_referrer_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
              } else {
                const error = await response.json();
                console.warn(`[ReferralTracker] Failed to claim referral:`, error.error);

                // If it's a "self referral" or "already referred", we should also clear the cookie
                if (response.status === 400) {
                    document.cookie = "clerk_referrer_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
              }
            } else if (status.hasReferrer) {
              // Already referred, just clear the cookie
              document.cookie = "clerk_referrer_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
          } catch (err) {
            console.error(`[ReferralTracker] Error during claim process:`, err);
          }
        }
      };

      claimReferral();
    }
  }, [userId, isLoaded]);

  return null;
}
