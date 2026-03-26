'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer py-8 px-8 bg-white text-base-content border-t border-neutral/5 flex justify-end items-center">
      <nav className="flex flex-row gap-8">
        <Link href="/regulamin" className="hover:opacity-100 font-serif text-[10px] uppercase tracking-[0.2em] opacity-30 transition-opacity">Regulamin</Link>
        <Link href="/polityka-prywatnosci" className="hover:opacity-100 font-serif text-[10px] uppercase tracking-[0.2em] opacity-30 transition-opacity">Polityka prywatności</Link>
      </nav>
    </footer>
  );
};

export default Footer;
