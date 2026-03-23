'use client';

import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { User, Search } from "lucide-react";
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { user } = useUser();
  const [searchValue, setSearchValue] = useState("");
  const [showMatrix, setShowMatrix] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setSearchValue("");
      setShowMatrix(true);
      setTimeout(() => setShowMatrix(false), 3000);
    }
  };

  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'pawel.perfect@protonmail.com' || user?.primaryEmailAddress?.emailAddress === 'pawel.perfect@gmail.com';

  return (
    <nav className={cn(
      "navbar sticky top-0 z-50 px-4 lg:px-8 h-16 transition-all duration-500",
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-soft" : "bg-transparent"
    )}>
      <div className="navbar-start flex-1 md:w-56 md:flex-none">
        <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
          <span className="text-xl font-black tracking-tighter uppercase font-serif">
            <span className="text-navy">POLUTEK</span><span className="text-gold">.PL</span>
          </span>
        </Link>
      </div>

      <div className="navbar-center flex-[2] max-w-[480px] hidden md:flex mx-4 min-w-0">
        <div className="relative w-full group">
          {showMatrix ? (
             <div className="absolute inset-0 flex items-center justify-center bg-navy rounded-xl overflow-hidden animate-in fade-in zoom-in duration-500 z-10 border border-gold/30">
                <span className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Connection Secured...</span>
             </div>
          ) : null}
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex-1 flex items-center min-w-0">
              <input
                type="text"
                placeholder="Szukaj materiałów..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-10 bg-white/50 border border-navy/5 rounded-xl px-4 text-sm focus:outline-none focus:border-gold/50 focus:bg-white transition-all placeholder:text-navy/30 font-sans"
              />
              <button type="submit" className="absolute right-3 text-navy/20 hover:text-gold transition-colors">
                <Search size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="navbar-end flex-1 md:w-64 md:flex-none justify-end gap-2 md:gap-6">
        {isAdmin && (
          <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40 hover:text-gold transition-colors whitespace-nowrap hidden sm:block">
            Dashboard
          </Link>
        )}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/60 hover:text-navy transition-colors px-4 py-2 border border-navy/5 rounded-full hover:border-navy/10">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/">
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Mój Profil"
                  href="/user-profile"
                  labelIcon={<User size={16} />}
                />
              </UserButton.MenuItems>
            </UserButton>
          </div>
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
