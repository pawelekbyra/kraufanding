'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { updateUserLanguage } from '@/lib/actions/user';

type Language = 'pl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en'); // Default to English
  const { userId, isLoaded } = useAuth();
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

  // Sync with DB if user logs in and we haven't synced their DB preference yet
  useEffect(() => {
    if (isLoaded && userId && isInitialized) {
      const fetchDbPreference = async () => {
        try {
          // We can call an API to get the current user's profile
          const res = await fetch('/api/user/profile');
          if (res.ok) {
            const data = await res.json();
            if (data.preferredLanguage && data.preferredLanguage !== language) {
              setLanguageState(data.preferredLanguage);
              localStorage.setItem('app-language', data.preferredLanguage);
            }
          }
        } catch (e) {
          console.error("Failed to fetch language preference from DB", e);
        }
      };
      fetchDbPreference();
    }
  }, [userId, isLoaded, isInitialized]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);

    // Persist to DB if user is logged in
    if (userId) {
      try {
        await updateUserLanguage(lang);
      } catch (error) {
        console.error("Failed to sync language to DB:", error);
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
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
    subscribed: 'Subskrybujesz',
    subscribers: 'subskrypcji',
    share: 'Udostępnij',
    noDate: 'Brak daty',
    comments: 'Komentarzy',
    replying: 'Odpowiadasz',
    addComment: 'Dodaj komentarz...',
    addReply: 'Dodaj odpowiedź...',
    cancel: 'Anuluj',
    comment: 'Skomentuj',
    reply: 'Odpowiedz',
    signIn: 'Zaloguj się',
    deleteComment: 'Usunąć komentarz?',
    justNow: 'niedawno',
    noDescription: 'Brak opisu filmu.',
    support: 'Wspieraj',
    materials: 'Materiały',
    donate: 'Wesprzyj Twórcę',
    available: 'Dostępne',
    loginToWatch: 'Zaloguj się aby obejrzeć',
    becomePatron: 'Zostań Patronem',
    paywallText: 'Nie masz psychy się',
    paywallAction: 'zalogować'
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
    signIn: 'Sign In',
    deleteComment: 'Delete comment?',
    justNow: 'just now',
    noDescription: 'No description provided.',
    support: 'Support',
    materials: 'Content',
    donate: 'Support Creator',
    available: 'Available',
    loginToWatch: 'Log in to watch',
    becomePatron: 'Become a Patron',
    paywallText: 'You dont have nuts to',
    paywallAction: 'log in'
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
