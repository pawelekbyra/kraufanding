'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { plPL } from '@clerk/localizations';
import { useLanguage } from './LanguageContext';
import React from 'react';

export default function ClerkLocalizationProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      localization={(language === 'pl' ? plPL : undefined) as any}
    >
      {children}
    </ClerkProvider>
  );
}
