'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer py-12 px-8 bg-slate-950 text-slate-500 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col items-center md:items-start gap-2">
        <span className="text-sm font-black text-white/20 tracking-tighter uppercase">POLUTEK<span className="text-primary/20">.PL</span></span>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">© {new Date().getFullYear()} Paweł Polutek</p>
      </div>
      <nav className="flex flex-row gap-8">
        <Link href="/regulamin" className="hover:text-primary font-bold text-[10px] uppercase tracking-[0.2em] transition-colors">Regulamin</Link>
        <Link href="/polityka-prywatnosci" className="hover:text-primary font-bold text-[10px] uppercase tracking-[0.2em] transition-colors">Polityka prywatności</Link>
      </nav>
    </footer>
  );
};

export default Footer;
