'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer py-12 px-8 lg:px-12 bg-obsidian-950/80 backdrop-blur-xl text-white/30 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10">© 2024 POLUTEK.PL ARCHIVE</span>
      </div>
      <nav className="flex flex-row gap-8">
        <Link href="/regulamin" className="hover:text-primary font-serif text-[10px] uppercase tracking-[0.2em] transition-all">Regulamin</Link>
        <Link href="/polityka-prywatnosci" className="hover:text-primary font-serif text-[10px] uppercase tracking-[0.2em] transition-all">Polityka prywatności</Link>
      </nav>
    </footer>
  );
};

export default Footer;
