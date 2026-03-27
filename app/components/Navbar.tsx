'use client';

import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { Search, Globe, CircleUser } from "lucide-react";
import { useLanguage } from './LanguageContext';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { language, setLanguage } = useLanguage();
  const { user } = useUser();
  const [searchValue, setSearchValue] = useState("");
  const [showMatrix, setShowMatrix] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setSearchValue("");
      setShowMatrix(true);
      setTimeout(() => setShowMatrix(false), 3000);
    }
  };

  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'pawel.perfect@gmail.com';
  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral/10 px-4 lg:px-6 h-14 min-h-14 font-serif flex items-center justify-between gap-2 md:gap-4 w-full max-w-full overflow-hidden">
      <div className="navbar-start flex-1 md:w-56 md:flex-none">
        <Link href="/" className="btn btn-ghost text-lg md:text-xl font-black tracking-tighter uppercase shrink-0 px-1 md:px-2 min-h-0 h-10">POLUTEK<span className="text-primary">.PL</span></Link>
      </div>

      <div className="navbar-center flex-[2] max-w-[480px] hidden md:flex mx-2 lg:mx-4 min-w-0">
        <div className="relative w-full group">
          {showMatrix ? (
             <div className="absolute inset-0 flex items-center justify-center bg-black rounded-full overflow-hidden animate-in fade-in zoom-in duration-500 z-10">
                <span className="text-green-500 font-mono text-sm tracking-widest animate-pulse">Matrix has You...</span>
             </div>
          ) : null}
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex-1 flex items-center min-w-0">
              <input
                type="text"
                placeholder="Szukaj"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-9 bg-white border border-[#ccc] rounded-l-full px-4 text-sm focus:outline-none focus:border-blue-500 shadow-inner focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-[#888]"
              />
            </div>
            <button type="submit" className="h-9 bg-[#f8f8f8] border border-[#ccc] border-l-0 rounded-r-full px-5 hover:bg-[#f0f0f0] transition-colors border-r-[#ccc] shrink-0 flex items-center justify-center" title="Szukaj">
              <Search size={18} className="text-[#1a1a1a]/70" />
            </button>
          </form>
        </div>
      </div>
      <div className="navbar-end flex-1 md:w-64 md:flex-none justify-end gap-1 md:gap-4">
        <div className="md:hidden mr-2">
            <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors">
                <Search size={20} />
            </button>
        </div>
        {isAdmin && (
          <Link href="/admin" className="btn btn-ghost btn-xs md:btn-sm font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors whitespace-nowrap">
            Admin
          </Link>
        )}


        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn btn-ghost btn-sm font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 px-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors border border-black/10">
              <CircleUser size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">Sign In / Sign Up</span>
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
