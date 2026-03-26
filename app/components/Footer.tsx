'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { cn } from '@/lib/utils';

const Footer = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <footer className="footer py-6 px-8 bg-white text-base-content border-t border-neutral/5 flex flex-col md:flex-row justify-between items-center gap-6">
      {/* Language Switcher - Left side on Desktop, Top on Mobile */}
      <div className="flex items-center bg-neutral/5 rounded-lg p-1 border border-neutral/10">
         <button
           onClick={() => setLanguage('pl')}
           className={cn(
             "px-4 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase tracking-widest",
             language === 'pl' ? "bg-black text-white shadow-md" : "text-neutral/40 hover:text-neutral/60"
           )}
         >
           PL
         </button>
         <button
           onClick={() => setLanguage('en')}
           className={cn(
             "px-4 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase tracking-widest",
             language === 'en' ? "bg-black text-white shadow-md" : "text-neutral/40 hover:text-neutral/60"
           )}
         >
           EN
         </button>
      </div>

      <nav className="flex flex-row gap-8">
        <Link href="/regulamin" className="hover:opacity-100 font-serif text-[10px] uppercase tracking-[0.2em] opacity-30 transition-opacity">Regulamin</Link>
        <Link href="/polityka-prywatnosci" className="hover:opacity-100 font-serif text-[10px] uppercase tracking-[0.2em] opacity-30 transition-opacity">Polityka prywatności</Link>
      </nav>
    </footer>
  );
};

export default Footer;
