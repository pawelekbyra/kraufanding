'use client';

import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Globe, CircleUser, Trophy, Star, X } from "lucide-react";
import { useLanguage } from './LanguageContext';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { language, setLanguage } = useLanguage();
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || "");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/?q=${encodeURIComponent(searchValue.trim())}`);
      setIsMobileSearchOpen(false);
    } else {
      router.push('/');
      setIsMobileSearchOpen(false);
    }
  };

  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'pawel.perfect@gmail.com';
  return (
    <div className="navbar bg-obsidian/80 backdrop-blur-md sticky top-0 z-50 border-b border-gold/10 px-4 lg:px-6 h-14 min-h-14 font-serif flex items-center justify-between gap-2 md:gap-4 w-full max-w-full overflow-hidden shadow-[0_4px_20px_-10px_rgba(197,160,89,0.2)]">
      {isMobileSearchOpen ? (
        <div className="flex-1 flex items-center gap-2 px-2 animate-in slide-in-from-top-4 duration-200">
           <button
             onClick={() => setIsMobileSearchOpen(false)}
             className="p-2 hover:bg-gold/10 rounded-none transition-colors shrink-0"
           >
              <X size={20} className="text-gold" />
           </button>
           <form onSubmit={handleSearch} className="flex-1 flex">
              <input
                type="text"
                autoFocus
                placeholder="SZUKAJ"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-9 bg-charcoal border border-gold/20 rounded-none px-4 text-sm focus:outline-none focus:border-gold/50 text-bone placeholder:text-bone/30 uppercase tracking-widest font-mono"
              />
           </form>
        </div>
      ) : (
        <>
          <div className="navbar-start flex-1 md:w-56 md:flex-none">
            <Link href="/" className="btn btn-ghost text-lg md:text-xl font-black tracking-tighter uppercase shrink-0 px-1 md:px-2 min-h-0 h-10 hover:bg-transparent">
              <span className="text-bone">POLUTEK</span>
              <span className="text-gold">.PL</span>
            </Link>
          </div>

          <div className="navbar-center flex-[2] max-w-[480px] hidden md:flex mx-2 lg:mx-4 min-w-0">
        <div className="relative w-full group">
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex-1 flex items-center min-w-0">
              <input
                type="text"
                placeholder="SZUKAJ"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-9 bg-charcoal border border-gold/20 rounded-none px-4 text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/40 transition-all placeholder:text-bone/20 text-bone font-mono uppercase tracking-widest"
              />
            </div>
            <button type="submit" className="h-9 bg-gold/10 border border-gold/20 border-l-0 rounded-none px-5 hover:bg-gold/20 transition-colors shrink-0 flex items-center justify-center" title="Szukaj">
              <Search size={18} className="text-gold/70" />
            </button>
          </form>
        </div>
      </div>
      <div className="navbar-end flex-1 md:w-80 md:flex-none justify-end gap-1 md:gap-3">
        <div className="md:hidden flex items-center gap-1">
            <div className="flex gap-4 items-center bg-gold/5 rounded-none px-3 py-1 mr-1 border border-gold/10 font-mono">
                <button
                  onClick={() => { if (setLanguage) setLanguage('pl'); }}
                  className={cn(
                    "text-[10px] font-black tracking-widest uppercase transition-all",
                    language === 'pl' ? "text-gold" : "text-bone/30"
                  )}
                >
                  PL
                </button>
                <button
                  onClick={() => { if (setLanguage) setLanguage('en'); }}
                  className={cn(
                    "text-[10px] font-black tracking-widest uppercase transition-all",
                    language === 'en' ? "text-gold" : "text-bone/30"
                  )}
                >
                  EN
                </button>
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="p-2 hover:bg-gold/10 rounded-none transition-colors"
            >
                <Search size={20} className="text-gold" />
            </button>
        </div>
        {isAdmin && (
          <Link href="/admin" className="btn btn-ghost btn-xs md:btn-sm font-black uppercase tracking-widest text-gold/60 hover:text-gold transition-colors whitespace-nowrap font-mono border border-gold/10 hover:bg-gold/10">
            Admin
          </Link>
        )}


        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn btn-ghost btn-sm font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 px-3 hover:bg-gold/10 rounded-none transition-colors border border-gold/20 text-gold font-mono">
              <CircleUser size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">{language === 'pl' ? 'WEJDŹ' : 'ENTER'}</span>
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex flex-col items-center pb-0.5">
             <div className="rounded-none inline-flex items-center justify-center bg-transparent aspect-square border border-gold/20 p-0.5 hover:border-gold/50 transition-colors">
                <UserButton afterSignOutUrl="/" />
             </div>
          </div>
        </SignedIn>
      </div>
      </>
      )}
    </div>
  );
};

export default Navbar;
