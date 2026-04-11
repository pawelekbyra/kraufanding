'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer py-8 px-8 bg-base-100 text-base-content border-t border-neutral/10 flex justify-center items-center group">
      <span className="font-brand font-black text-[12px] uppercase tracking-[0.4em] opacity-20 group-hover:opacity-60 transition-all duration-700 group-hover:tracking-[0.6em] cursor-default">
        WWW.POLUTEK.PL
      </span>
    </footer>
  );
};

export default Footer;
