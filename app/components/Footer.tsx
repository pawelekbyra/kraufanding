import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-0.5">
            <span className="font-serif text-sm font-semibold text-foreground/60">POLUTEK</span>
            <span className="font-serif text-sm font-semibold text-accent/60">.PL</span>
          </div>
          
          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link 
              href="/regulamin" 
              className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Regulamin
            </Link>
            <span className="w-1 h-1 rounded-full bg-border" />
            <Link 
              href="/polityka-prywatnosci" 
              className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Polityka prywatnosci
            </Link>
          </nav>
          
          {/* Copyright */}
          <p className="font-sans text-[11px] text-muted-foreground/60">
            2025 Polutek
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
