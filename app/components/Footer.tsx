'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer py-10 px-8 bg-obsidian text-bone border-t border-gold/10 flex justify-between items-center font-mono">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">POLUTEK.PL</span>
        <span className="text-[8px] uppercase tracking-[0.1em] text-bone/20">© 2024 ARCHIVE. SYSTEM OPERATIONAL.</span>
      </div>
      <nav className="flex flex-row gap-10">
        <Link href="/regulamin" className="hover:text-gold font-bold text-[10px] uppercase tracking-[0.2em] text-bone/30 transition-all border-b border-transparent hover:border-gold pb-0.5">Regulamin</Link>
        <Link href="/polityka-prywatnosci" className="hover:text-gold font-bold text-[10px] uppercase tracking-[0.2em] text-bone/30 transition-all border-b border-transparent hover:border-gold pb-0.5">Prywatność</Link>
      </nav>
    </footer>
  );
};

export default Footer;
