'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isInitialized: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en'); // Default to English
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeLanguage = async () => {
      // 1. Check local storage
      const savedLang = localStorage.getItem('app-language') as Language;
      if (savedLang && (savedLang === 'pl' || savedLang === 'en')) {
        setLanguageState(savedLang);
        setIsInitialized(true);
        return;
      }

      // 2. Browser detection if no local preference
      if (typeof window !== 'undefined' && window.navigator) {
        const browserLang = window.navigator.language.toLowerCase();
        if (browserLang.startsWith('pl')) {
          setLanguageState('pl');
        }
      }
      setIsInitialized(true);
    };

    initializeLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);

    // Sync with database if user is logged in
    try {
      await fetch('/api/user/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang })
      });
    } catch (e) {
      console.warn('[LanguageContext] Failed to sync language with DB:', e);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isInitialized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const translations = {
  pl: {
    views: 'wyświetleń',
    showMore: '...więcej',
    showLess: 'Pokaż mniej',
    subscribe: 'Subskrajb',
    subscribed: 'Subskrajbd',
    subscribers: 'subskrypcji',
    share: 'Szeruj',
    noDate: 'Świeża sprawa',
    comments: 'Komentarze',
    replying: 'Wchodzisz w dyskusję',
    addComment: 'Zostaw ślad...',
    addReply: 'Odpowiedź...',
    cancel: 'Odpuść',
    comment: 'Wyślij',
    reply: 'Odpowiedz',
    signIn: 'WEJŚCIE',
    deleteComment: 'Wyciąć?',
    justNow: 'przed chwilą',
    noDescription: 'Cisza w eterze.',
    support: 'Mecenat',
    materials: 'Zasoby',
    donate: 'Bramka Napiwkowa',
    available: 'Odblokowane',
    loginToWatch: 'Pokaż dowód (zaloguj się)',
    loginReq: 'Logowanie',
    patronOnly: 'Dla Patronów',
    becomePatron: 'Zostań Patronem',
    topSecret: 'Ściśle Tajne',
    paywallText: 'Dla',
    paywallAction: 'zalogowanych',
    supportArtist: 'Wspieraj POLUTEK.PL',
    loginToWatchShort: 'Zaloguj się',
    independencyTitle: 'Nie masz psychy się zalogować',
    patronZone: 'Strefa Patrona',
    donationDescription: 'W podziękowaniu za napiwek zapraszam do Strefy Patrona.'
  },
  en: {
    views: 'views',
    showMore: '...more',
    showLess: 'Show less',
    subscribe: 'Subscribe',
    subscribed: 'Subscribed',
    subscribers: 'subscribers',
    share: 'Share',
    noDate: 'No date',
    comments: 'Comments',
    replying: 'Replying',
    addComment: 'Add a comment...',
    addReply: 'Add a reply...',
    cancel: 'Cancel',
    comment: 'Comment',
    reply: 'Reply',
    signIn: 'ENTER',
    deleteComment: 'Delete comment?',
    justNow: 'just now',
    noDescription: 'No description provided.',
    support: 'Support',
    materials: 'Content',
    donate: 'Support Creator',
    available: 'Available',
    loginToWatch: 'Log in to watch',
    loginReq: 'Login Req',
    patronOnly: 'Patron Only',
    becomePatron: 'Become a Patron',
    topSecret: 'TOP SECRET',
    paywallText: 'For',
    paywallAction: 'logged in users',
    supportArtist: 'Support POLUTEK.PL',
    loginToWatchShort: 'Log in',
    independencyTitle: "You don't have the guts to log in",
    patronZone: 'Patrons Only',
    donationDescription: 'A tip will unlock access to the Patron Zone. Support helps in the development of the project.'
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return {
    ...context,
    t: translations[context.language]
  };
};
