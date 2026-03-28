'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer py-10 px-8 bg-linen text-ink border-t border-ink/10 flex justify-between items-center font-mono">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-[0.3em] text-oxblood font-bold">POLUTEK.PL</span>
        <span className="text-[8px] uppercase tracking-[0.1em] text-ink/20">© 2024 ARCHIVE. SYSTEM OPERATIONAL.</span>
      </div>
      <nav className="flex flex-row gap-10">
        <Link href="/regulamin" className="hover:text-oxblood font-bold text-[10px] uppercase tracking-[0.2em] text-ink/30 transition-all border-b border-transparent hover:border-oxblood pb-0.5">Regulamin</Link>
        <Link href="/polityka-prywatnosci" className="hover:text-oxblood font-bold text-[10px] uppercase tracking-[0.2em] text-ink/30 transition-all border-b border-transparent hover:border-oxblood pb-0.5">Prywatność</Link>
      </nav>
    </footer>
  );
};

export default Footer;
