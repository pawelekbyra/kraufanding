'use client';

import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, CircleUser, X } from "lucide-react";
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
    <div className="navbar glass sticky top-0 z-[100] px-4 lg:px-6 h-16 min-h-16 flex items-center justify-between gap-2 md:gap-4 w-full border-b border-white/5 shadow-aurora">
      {isMobileSearchOpen ? (
        <div className="flex-1 flex items-center gap-2 px-2 animate-in slide-in-from-top-4 duration-200">
           <button
             onClick={() => setIsMobileSearchOpen(false)}
             className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0"
           >
              <X size={20} className="text-white/70" />
           </button>
           <form onSubmit={handleSearch} className="flex-1 flex">
              <input
                type="text"
                autoFocus
                placeholder="Szukaj..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-10 bg-white/5 border border-white/10 rounded-full px-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-white placeholder:text-white/30"
              />
           </form>
        </div>
      ) : (
        <>
          <div className="navbar-start flex-1 md:w-64 md:flex-none">
            <Link href="/" className="group flex items-center gap-2 btn btn-ghost p-0 hover:bg-transparent min-h-0 h-10">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-xs">P</span>
              </div>
              <span className="text-xl font-black tracking-tighter uppercase text-white">POLUTEK<span className="text-primary">.PL</span></span>
            </Link>
          </div>

          <div className="navbar-center flex-[2] max-w-[580px] hidden md:flex mx-2 lg:mx-4 min-w-0">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-1 flex items-center min-w-0">
                <input
                  type="text"
                  placeholder="Odkrywaj..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-full px-5 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-white placeholder:text-white/30 pr-12"
                />
                <button type="submit" className="absolute right-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>

          <div className="navbar-end flex-1 md:w-80 md:flex-none justify-end gap-1 md:gap-3">
            <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 mr-2">
                <button
                  onClick={() => { if (setLanguage) setLanguage('pl'); }}
                  className={cn(
                    "px-3 py-1 text-[10px] font-black tracking-widest uppercase transition-all rounded-full",
                    language === 'pl' ? "bg-primary text-white shadow-lg" : "text-white/30 hover:text-white/60"
                  )}
                >
                  PL
                </button>
                <button
                  onClick={() => { if (setLanguage) setLanguage('en'); }}
                  className={cn(
                    "px-3 py-1 text-[10px] font-black tracking-widest uppercase transition-all rounded-full",
                    language === 'en' ? "bg-primary text-white shadow-lg" : "text-white/30 hover:text-white/60"
                  )}
                >
                  EN
                </button>
            </div>

            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-white/70"
            >
                <Search size={20} />
            </button>

            {isAdmin && (
              <Link href="/admin" className="btn btn-ghost btn-xs md:btn-sm font-black uppercase tracking-widest text-primary hover:text-primary-focus transition-all whitespace-nowrap hidden sm:flex">
                Admin
              </Link>
            )}

            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-sm rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 px-4 shadow-lg shadow-primary/20 border-none">
                  <CircleUser size={16} strokeWidth={2.5} />
                  <span>{language === 'pl' ? 'Zaloguj się' : 'Sign In'}</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center">
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary to-secondary">
                  <div className="rounded-full bg-base-100 p-0.5">
                    <UserButton afterSignOutUrl="/" />
                  </div>
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
