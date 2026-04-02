'use client';

import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Globe, LogIn, Trophy, Star, X, Bell, Youtube } from "./icons";
import { useLanguage } from './LanguageContext';
import { cn } from '@/lib/utils';
import BrandName from './BrandName';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
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
    <div className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral/10 px-4 lg:px-6 h-14 min-h-14 font-sans flex items-center justify-between gap-2 md:gap-4 w-full max-w-full overflow-hidden">
      {isMobileSearchOpen ? (
        <div className="flex-1 flex items-center gap-2 px-2 animate-in slide-in-from-top-4 duration-200">
           <button
             onClick={() => setIsMobileSearchOpen(false)}
             className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors shrink-0"
           >
              <X size={20} />
           </button>
           <form onSubmit={handleSearch} className="flex-1 flex">
              <input
                type="text"
                autoFocus
                placeholder="Szukaj"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-9 bg-[#1a1a1a]/[0.02] border border-[#1a1a1a] rounded-full px-4 text-sm focus:outline-none focus:border-blue-500 shadow-inner"
              />
           </form>
        </div>
      ) : (
        <>
          <div className="navbar-start flex-1 md:w-56 md:flex-none">
            <Link href="/" className="btn btn-ghost shrink-0 px-1 md:px-2 min-h-0 h-12 flex items-center gap-0.5 hover:bg-transparent">
              <BrandName className="text-lg md:text-xl" variant="handwriting" />
            </Link>
          </div>

          <div className="navbar-center flex-[2] max-w-[480px] hidden md:flex mx-2 lg:mx-4 min-w-0">
        <div className="relative w-full group">
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex-1 flex items-center min-w-0">
              <input
                type="text"
                placeholder="Szukaj"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-9 bg-[#1a1a1a]/[0.02] border border-[#1a1a1a] rounded-l-full px-4 text-sm focus:outline-none focus:border-blue-500 shadow-inner focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-[#888]"
              />
            </div>
            <button type="submit" className="h-9 bg-[#1a1a1a]/[0.02] border border-[#1a1a1a] border-l-0 rounded-r-full px-5 hover:bg-[#1a1a1a]/10 transition-colors shrink-0 flex items-center justify-center" title="Szukaj">
              <Search size={18} className="text-[#1a1a1a]/70" />
            </button>
          </form>
        </div>
      </div>
      <div className="navbar-end flex-1 md:w-80 md:flex-none justify-end gap-1 md:gap-3">
        {/* Language Switcher - Mobile only as requested */}
        <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors md:hidden"
            >
                <Search size={20} />
            </button>

            <div className="flex gap-4 items-center bg-[#1a1a1a]/[0.02] rounded-full px-3 py-1 mr-1 border border-[#1a1a1a] h-9">
                <button
                  onClick={() => { if (setLanguage) setLanguage('pl'); }}
                  className={cn(
                    "text-[10px] font-black tracking-widest uppercase transition-all",
                    language === 'pl' ? "text-primary" : "text-[#1a1a1a]/30"
                  )}
                >
                  PL
                </button>
                <button
                  onClick={() => { if (setLanguage) setLanguage('en'); }}
                  className={cn(
                    "text-[10px] font-black tracking-widest uppercase transition-all",
                    language === 'en' ? "text-primary" : "text-[#1a1a1a]/30"
                  )}
                >
                  EN
                </button>
            </div>
        </div>

        {isAdmin && (
          <Link href="/admin" className="btn btn-ghost btn-xs md:btn-sm font-bold uppercase tracking-widest text-primary/60 hover:text-primary transition-colors whitespace-nowrap">
            Admin
          </Link>
        )}


        <SignedOut>
          <SignInButton mode="modal">
            <button className="hover:bg-[#1a1a1a]/10 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1 md:gap-2 px-2 md:px-3 h-9 bg-[#1a1a1a]/[0.02] rounded-full border border-[#1a1a1a] transition-all">
              <LogIn size={18} />
              <span className="hidden md:inline">{t.signIn}</span>
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-2 md:gap-4 mr-1 md:mr-2">
            <div className="flex flex-col items-center pb-0.5">
               <div className="rounded-full inline-flex items-center justify-center bg-transparent aspect-square border border-[#1a1a1a] overflow-hidden">
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
