import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer p-10 bg-base-100 text-base-content border-t border-base-200 flex flex-col md:flex-row justify-center items-center gap-8">
      <nav className="flex flex-row gap-8">
        <Link href="/regulamin" className="link link-hover font-medium uppercase tracking-widest text-xs opacity-50">Regulamin</Link>
        <Link href="/polityka-prywatnosci" className="link link-hover font-medium uppercase tracking-widest text-xs opacity-50">Polityka prywatności</Link>
      </nav>
    </footer>
  );
};

export default Footer;
