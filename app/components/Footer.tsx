import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer py-6 px-8 bg-white text-base-content border-t-2 border-black flex justify-end items-center font-mono">
      <nav className="flex flex-row gap-8">
        <Link href="/regulamin" className="hover:text-primary font-black text-[10px] uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-all">Regulamin_Protocol</Link>
        <Link href="/polityka-prywatnosci" className="hover:text-primary font-black text-[10px] uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-all">Privacy_Archival</Link>
      </nav>
    </footer>
  );
};

export default Footer;
