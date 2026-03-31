'use client';

import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Globe, LogIn, Trophy, Star, X, Bell } from "./icons";
import { useLanguage } from './LanguageContext';
import { cn } from '@/lib/utils';
import BrandName from './BrandName';
import DoodleBox from './DoodleBox';

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
    <div className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral/10 px-4 lg:px-6 h-14 min-h-14 font-serif flex items-center justify-between gap-2 md:gap-4 w-full max-w-full overflow-hidden">
      {isMobileSearchOpen ? (
        <div className="flex-1 flex items-center gap-2 px-2 animate-in slide-in-from-top-4 duration-200">
           <button
             onClick={() => setIsMobileSearchOpen(false)}
             className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors shrink-0"
           >
              <X size={20} />
           </button>
           <form onSubmit={handleSearch} className="flex-1 flex px-2">
              <DoodleBox className="w-full" color="#1a1a1a" strokeWidth={1} padding={2}>
                <input
                  type="text"
                  autoFocus
                  placeholder="Szukaj"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full h-9 bg-white px-4 text-sm focus:outline-none"
                />
              </DoodleBox>
           </form>
        </div>
      ) : (
        <>
          <div className="navbar-start flex-1 md:w-56 md:flex-none">
            <Link href="/" className="btn btn-ghost text-lg md:text-xl font-black tracking-tighter uppercase shrink-0 px-1 md:px-2 min-h-0 h-12 flex items-center">
              <BrandName className="text-lg md:text-xl" />
            </Link>
          </div>

          <div className="navbar-center flex-[2] max-w-[480px] hidden md:flex mx-2 lg:mx-4 min-w-0">
        <div className="relative w-full group">
          <DoodleBox className="w-full" color="#1a1a1a" strokeWidth={1} padding={2}>
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-1 flex items-center min-w-0">
                <input
                  type="text"
                  placeholder="Szukaj"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full h-9 bg-white px-4 text-sm focus:outline-none placeholder:text-[#888]"
                />
              </div>
              <button type="submit" className="h-9 bg-[#f8f8f8] px-5 hover:bg-[#f0f0f0] transition-colors shrink-0 flex items-center justify-center" title="Szukaj">
                <Search size={18} className="text-[#1a1a1a]/70" />
              </button>
            </form>
          </DoodleBox>
        </div>
      </div>
      <div className="navbar-end flex-1 md:w-80 md:flex-none justify-end gap-1 md:gap-3">
        <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
            >
                <Search size={20} />
            </button>
            <div className="flex gap-4 items-center bg-neutral/5 rounded-full px-3 py-1 mr-1 border border-neutral/10">
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
          <Link href="/admin" className="btn btn-ghost btn-xs md:btn-sm font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors whitespace-nowrap">
            Admin
          </Link>
        )}


        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn btn-ghost btn-sm font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 px-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors border border-black/10">
              <LogIn size={18} />
              <span className="hidden sm:inline">{t.signIn}</span>
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-2 md:gap-4 mr-1 md:mr-2">
            <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors relative group">
              <Bell size={20} className="text-[#1a1a1a] transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#1a1a1a] rounded-full border-2 border-base-100" />
            </button>
            <div className="flex flex-col items-center pb-0.5">
               <div className="rounded-full inline-flex items-center justify-center bg-transparent aspect-square">
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
