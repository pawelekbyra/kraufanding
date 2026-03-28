"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ReferralTracker() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  useEffect(() => {
    if (ref) {
      // Set a cookie that expires in 30 days
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `clerk_referrer_id=${ref}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      console.log(`[ReferralTracker] Saved referrer ID: ${ref}`);
    }
  }, [ref]);

  return null;
}
