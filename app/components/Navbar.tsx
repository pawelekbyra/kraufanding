'use client';

import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { User, Search } from "lucide-react";

const Navbar = () => {
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

  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'pawel.perfect@protonmail.com' || user?.primaryEmailAddress?.emailAddress === 'pawel.perfect@gmail.com';
  return (
    <div className="navbar bg-white sticky top-0 z-50 border-b-2 border-black px-4 lg:px-6 h-14 min-h-14 font-mono flex items-center justify-between gap-2 md:gap-4 w-full max-w-full overflow-hidden">
      <div className="navbar-start flex-1 md:w-56 md:flex-none">
        <Link href="/" className="text-lg md:text-xl font-black tracking-tighter uppercase shrink-0 px-1 md:px-2 flex items-center">
            POLUTEK<span className="bg-black text-white px-1 ml-0.5">.PL</span>
        </Link>
      </div>

      <div className="navbar-center flex-[2] max-w-[480px] hidden md:flex mx-2 lg:mx-4 min-w-0">
        <div className="relative w-full group">
          {showMatrix ? (
             <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden animate-in fade-in zoom-in duration-500 z-10">
                <span className="text-green-500 font-mono text-sm tracking-widest animate-pulse">Matrix has You...</span>
             </div>
          ) : null}
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex-1 flex items-center min-w-0">
              <input
                type="text"
                placeholder="SEARCH_DB..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-8 bg-[#FDFBF7] border-2 border-black rounded-none px-3 text-xs focus:outline-none focus:bg-primary/5 transition-all placeholder:text-black/30 font-bold uppercase"
              />
            </div>
            <button type="submit" className="h-8 bg-black border-2 border-black border-l-0 rounded-none px-4 hover:bg-neutral-content transition-colors shrink-0 flex items-center justify-center" title="Szukaj">
              <Search size={16} className="text-white" />
            </button>
          </form>
        </div>
      </div>
      <div className="navbar-end flex-1 md:w-64 md:flex-none justify-end gap-1 md:gap-2">
        <div className="md:hidden mr-2">
            <button className="p-2 hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-all">
                <Search size={18} />
            </button>
        </div>
        {isAdmin && (
          <Link href="/admin" className="px-3 py-1 border-2 border-black font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all whitespace-nowrap">
            Admin_Mode
          </Link>
        )}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-3 py-1 border-2 border-black font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all">Auth_Connect</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="border-2 border-black p-0.5 shadow-brutalist-sm">
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
    </div>
  );
};

export default Navbar;
