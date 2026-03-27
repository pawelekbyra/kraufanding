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
    <div className="navbar bg-obsidian-950/40 backdrop-blur-2xl sticky top-0 z-50 border-b border-white/5 px-4 lg:px-8 h-16 min-h-16 font-sans flex items-center justify-between gap-4 w-full">
      {isMobileSearchOpen ? (
        <div className="flex-1 flex items-center gap-4 px-2 animate-in fade-in slide-in-from-top-4 duration-300">
           <button
             onClick={() => setIsMobileSearchOpen(false)}
             className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0 text-white/60 hover:text-white"
           >
              <X size={20} />
           </button>
           <form onSubmit={handleSearch} className="flex-1 flex relative group">
              <input
                type="text"
                autoFocus
                placeholder="Szukaj..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-10 bg-white/5 border border-white/10 rounded-full px-5 text-sm focus:outline-none focus:border-primary/50 text-white placeholder:text-white/30"
              />
           </form>
        </div>
      ) : (
        <>
          <div className="navbar-start flex-1 md:w-64 md:flex-none">
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-xl md:text-2xl font-serif font-black tracking-tight text-white transition-all group-hover:text-primary">
                POLUTEK<span className="text-primary group-hover:text-white transition-colors duration-300">.PL</span>
              </span>
            </Link>
          </div>

          <div className="navbar-center flex-[2] max-w-[560px] hidden md:flex mx-4 min-w-0">
            <div className="relative w-full group">
              <form onSubmit={handleSearch} className="flex w-full items-center relative">
                <div className="absolute left-4 z-10 text-white/30 group-focus-within:text-primary transition-colors">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Eksploruj archiwum..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-full pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 text-white transition-all placeholder:text-white/20 hover:bg-white/10"
                />
              </form>
            </div>
          </div>

          <div className="navbar-end flex-1 md:w-80 md:flex-none justify-end gap-2 md:gap-4">
            <div className="hidden lg:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
                <button
                  onClick={() => { if (setLanguage) setLanguage('pl'); }}
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase transition-all",
                    language === 'pl' ? "bg-primary text-white shadow-glow" : "text-white/30 hover:text-white/60"
                  )}
                >
                  PL
                </button>
                <button
                  onClick={() => { if (setLanguage) setLanguage('en'); }}
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase transition-all",
                    language === 'en' ? "bg-primary text-white shadow-glow" : "text-white/30 hover:text-white/60"
                  )}
                >
                  EN
                </button>
            </div>

            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-white/60"
            >
                <Search size={20} />
            </button>

            {isAdmin && (
              <Link href="/admin" className="hidden sm:flex btn btn-ghost btn-xs md:btn-sm font-black uppercase tracking-[0.2em] text-primary/70 hover:text-primary transition-all hover:scale-105">
                Admin
              </Link>
            )}

            <SignedOut>
              <SignInButton mode="modal">
                <button className="h-10 px-6 rounded-full bg-white text-obsidian-950 font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all duration-300 shadow-brutalist active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                   {language === 'pl' ? 'Zaloguj się' : 'Sign In'}
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center bg-white/5 rounded-full p-0.5 border border-white/10 hover:border-white/20 transition-colors">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 rounded-full ring-2 ring-primary/20",
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
