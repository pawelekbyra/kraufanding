'use client';

import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, CircleUser, X } from "lucide-react";
import { useLanguage } from './LanguageContext';
import { cn } from '@/lib/utils';

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
    <div className="navbar glass-panel sticky top-0 z-50 px-4 lg:px-6 h-14 min-h-14 font-sans flex items-center justify-between gap-2 md:gap-4 w-full max-w-full overflow-hidden border-b border-white/5 shadow-2xl">
      {isMobileSearchOpen ? (
        <div className="flex-1 flex items-center gap-2 px-2 animate-in slide-in-from-top-4 duration-200">
           <button
             onClick={() => setIsMobileSearchOpen(false)}
             className="p-2 hover:bg-white/5 rounded-full transition-colors shrink-0"
           >
              <X size={20} className="text-white/60" />
           </button>
           <form onSubmit={handleSearch} className="flex-1 flex">
              <input
                type="text"
                autoFocus
                placeholder={t.archiveSearch}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-9 bg-white/5 border border-white/10 rounded-none px-4 text-sm focus:outline-none focus:border-amber transition-all text-white placeholder:text-white/30"
              />
           </form>
        </div>
      ) : (
        <>
          <div className="navbar-start flex-1 md:w-56 md:flex-none">
            <Link href="/" className="btn btn-ghost group text-lg md:text-xl font-serif font-black tracking-tighter uppercase shrink-0 px-1 md:px-2 min-h-0 h-10 hover:bg-transparent">
              <span className="text-white group-hover:text-amber transition-colors">POLUTEK</span>
              <span className="text-amber">.PL</span>
            </Link>
          </div>

          <div className="navbar-center flex-[2] max-w-[480px] hidden md:flex mx-2 lg:mx-4 min-w-0">
            <div className="relative w-full">
              <form onSubmit={handleSearch} className="flex w-full">
                <div className="relative flex-1 flex items-center min-w-0">
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full h-9 bg-white/5 border border-white/10 rounded-l-none px-4 text-sm focus:outline-none focus:border-amber transition-all placeholder:text-white/30 text-white"
                  />
                </div>
                <button type="submit" className="h-9 bg-white/5 border border-white/10 border-l-0 px-5 hover:bg-amber hover:text-black transition-all shrink-0 flex items-center justify-center group" title={language === 'pl' ? 'Szukaj' : 'Search'}>
                  <Search size={18} className="text-white/60 group-hover:text-black" />
                </button>
              </form>
            </div>
          </div>

          <div className="navbar-end flex-1 md:w-80 md:flex-none justify-end gap-1 md:gap-3">
            <div className="md:hidden flex items-center gap-1">
                <div className="flex gap-4 items-center bg-white/5 rounded-none px-3 py-1 mr-1 border border-white/10">
                    <button
                      onClick={() => { if (setLanguage) setLanguage('pl'); }}
                      className={cn(
                        "text-[10px] font-black tracking-widest uppercase transition-all",
                        language === 'pl' ? "text-amber" : "text-white/30"
                      )}
                    >
                      PL
                    </button>
                    <button
                      onClick={() => { if (setLanguage) setLanguage('en'); }}
                      className={cn(
                        "text-[10px] font-black tracking-widest uppercase transition-all",
                        language === 'en' ? "text-amber" : "text-white/30"
                      )}
                    >
                      EN
                    </button>
                </div>
                <button
                  onClick={() => setIsMobileSearchOpen(true)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60"
                >
                    <Search size={20} />
                </button>
            </div>
            {isAdmin && (
              <Link href="/admin" className="btn btn-ghost btn-xs md:btn-sm font-black uppercase tracking-widest text-amber/40 hover:text-amber transition-colors whitespace-nowrap">
                {t.database}
              </Link>
            )}

            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn btn-ghost btn-sm font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 px-3 hover:bg-amber hover:text-black rounded-none transition-all border border-amber/20 bg-amber/5 text-amber">
                  <CircleUser size={18} strokeWidth={2.5} />
                  <span className="hidden sm:inline">{t.authorize}</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex flex-col items-center pb-0.5">
                 <div className="rounded-full inline-flex items-center justify-center p-0.5 bg-amber/20 hover:bg-amber/40 transition-colors aspect-square">
                    <UserButton afterSignOutUrl="/" appearance={{
                      elements: {
                        userButtonAvatarBox: "w-7 h-7"
                      }
                    }} />
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
