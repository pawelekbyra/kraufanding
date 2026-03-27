'use client';

import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Globe, CircleUser, X } from "lucide-react";
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
    <nav className="glass-panel sticky top-0 z-50 px-4 lg:px-6 h-14 min-h-14 flex items-center justify-between gap-2 md:gap-4 w-full">
      {isMobileSearchOpen ? (
        <div className="flex-1 flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
           <button
             onClick={() => setIsMobileSearchOpen(false)}
             className="p-2 hover:bg-white/5 rounded-full transition-colors shrink-0"
           >
              <X size={20} />
           </button>
           <form onSubmit={handleSearch} className="flex-1 flex">
              <input
                type="text"
                autoFocus
                placeholder="Szukaj..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-9 bg-slate-800/50 border border-white/10 rounded-full px-4 text-sm focus:outline-none focus:border-primary shadow-inner"
              />
           </form>
        </div>
      ) : (
        <>
          <div className="flex-1 md:w-56 md:flex-none">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-black tracking-tighter uppercase group-hover:text-primary transition-colors">
                POLUTEK<span className="text-primary group-hover:text-white transition-colors">.PL</span>
              </span>
            </Link>
          </div>

          <div className="flex-[2] max-w-[480px] hidden md:flex mx-2 lg:mx-4 min-w-0">
            <form onSubmit={handleSearch} className="flex w-full group">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Szukaj..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full h-9 bg-slate-800/50 border border-white/10 border-r-0 rounded-l-full px-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-slate-500"
                />
              </div>
              <button
                type="submit"
                className="h-9 bg-slate-800/50 border border-white/10 rounded-r-full px-5 hover:bg-slate-700/50 transition-colors shrink-0 flex items-center justify-center border-l-0"
              >
                <Search size={18} className="text-slate-400 group-focus-within:text-primary" />
              </button>
            </form>
          </div>

          <div className="flex-1 md:w-80 md:flex-none justify-end flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center bg-white/5 rounded-full px-3 py-1 border border-white/5">
                <button
                  onClick={() => { if (setLanguage) setLanguage('pl'); }}
                  className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-full transition-all",
                    language === 'pl' ? "bg-primary text-white" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  PL
                </button>
                <button
                  onClick={() => { if (setLanguage) setLanguage('en'); }}
                  className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-full transition-all",
                    language === 'en' ? "bg-primary text-white" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  EN
                </button>
            </div>

            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors"
            >
                <Search size={20} />
            </button>

            {isAdmin && (
              <Link href="/admin" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
                Admin
              </Link>
            )}

            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/80 text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all">
                  <CircleUser size={16} />
                  <span className="hidden sm:inline">{language === 'pl' ? 'Zaloguj się' : 'Sign In'}</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 border border-white/10"
                  }
                }}
              />
            </SignedIn>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
