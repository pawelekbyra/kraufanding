'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="footer py-12 px-8 bg-transparent text-white/20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 font-mono">
      <div className="flex flex-col items-center md:items-start">
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40">POLUTEK ARCHIVE</span>
        <span className="text-[8px] uppercase tracking-[0.2em] mt-1">EST. MMXXIV | {t.allRightsSecured}</span>
      </div>

      <nav className="flex flex-row gap-8">
        <Link href="/regulamin" className="hover:text-amber font-mono text-[9px] uppercase tracking-[0.2em] transition-all duration-300">{t.terms}</Link>
        <Link href="/polityka-prywatnosci" className="hover:text-amber font-mono text-[9px] uppercase tracking-[0.2em] transition-all duration-300">{t.privacy}</Link>
      </nav>

      <div className="flex flex-col items-center md:items-end">
        <div className="flex gap-2">
            <div className="w-1.5 h-1.5 bg-amber animate-pulse rounded-full" />
            <span className="text-[8px] uppercase tracking-[0.2em]">{t.systemStatus}: {t.online}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
