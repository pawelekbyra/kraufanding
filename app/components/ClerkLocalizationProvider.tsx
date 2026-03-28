'use client';

import { ClerkProvider, useUser } from '@clerk/nextjs';
import { plPL } from '@clerk/localizations';
import { useLanguage } from './LanguageContext';
import { updateUserLanguage } from '@/lib/actions/user';
import React, { useEffect } from 'react';

function LocalizationLogic({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, isInitialized } = useLanguage();
  const { user, isLoaded } = useUser();

  // Sync DB preference to Context ONLY ONCE on login
  useEffect(() => {
    if (isLoaded && user && isInitialized) {
      const dbLang = user.publicMetadata.preferredLanguage as 'pl' | 'en';
      if (dbLang && dbLang !== language) {
        setLanguage(dbLang);
      }
    }
  }, [user, isLoaded, isInitialized, language, setLanguage]);

  // Sync Context to DB/Metadata on change
  useEffect(() => {
    if (isLoaded && user && isInitialized) {
       updateUserLanguage(language);
    }
  }, [language, user, isLoaded, isInitialized]);

  return <>{children}</>;
}

export default function ClerkLocalizationProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      localization={(language === 'pl' ? plPL : undefined) as any}
      afterSignInUrl="/"
      afterSignUpUrl="/"
      signInForceRedirectUrl="/"
      signUpForceRedirectUrl="/"
    >
      <LocalizationLogic>
        {children}
      </LocalizationLogic>
    </ClerkProvider>
  );
}
