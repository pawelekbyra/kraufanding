'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('pl');

  useEffect(() => {
    const savedLang = localStorage.getItem('app-language') as Language;
    if (savedLang && (savedLang === 'pl' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
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
    available: 'Dostępne'
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
    available: 'Available'
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
