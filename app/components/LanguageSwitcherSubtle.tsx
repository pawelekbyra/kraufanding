'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';
import { cn } from '@/lib/utils';

export const LanguageSwitcherSubtle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="absolute top-[56px] right-4 lg:right-6 z-40 flex gap-3 pointer-events-auto items-center">
      <button
        onClick={() => setLanguage('pl')}
        className={cn(
          "font-serif text-[9px] uppercase tracking-[0.2em] transition-all hover:opacity-100",
          language === 'pl' ? "opacity-100 font-black border-b border-black/20 pb-0.5" : "opacity-20"
        )}
      >
        PL
      </button>
      <div className="w-[1px] h-2 bg-black/10" />
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "font-serif text-[9px] uppercase tracking-[0.2em] transition-all hover:opacity-100",
          language === 'en' ? "opacity-100 font-black border-b border-black/20 pb-0.5" : "opacity-20"
        )}
      >
        EN
      </button>
    </div>
  );
};
