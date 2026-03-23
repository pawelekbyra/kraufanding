'use client';

import React, { useState } from 'react';
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6 max-w-full overflow-hidden gap-2 md:gap-4">
        {/* Logo */}
        <div className="flex-1 md:w-56 md:flex-none">
          <Link href="/" className="group flex items-center gap-0.5 transition-opacity hover:opacity-80">
            <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-foreground">POLUTEK</span>
            <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-accent">.PL</span>
          </Link>
        </div>

        {/* Search */}
        <div className="flex-[2] max-w-[480px] hidden md:flex mx-2 lg:mx-4 min-w-0">
          <div className="relative w-full">
            {showMatrix && (
               <div className="absolute inset-0 flex items-center justify-center bg-foreground rounded-full overflow-hidden animate-in fade-in zoom-in duration-500 z-10">
                  <span className="text-accent font-mono text-sm tracking-widest animate-pulse">Matrix has You...</span>
               </div>
            )}
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-1 flex items-center min-w-0">
                <input
                  type="text"
                  placeholder="Szukaj"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full h-10 bg-secondary/50 border border-border rounded-l-full px-4 text-sm font-sans focus:outline-none focus:border-foreground/30 focus:bg-card transition-all placeholder:text-muted-foreground"
                />
              </div>
              <button 
                type="submit" 
                className="h-10 bg-secondary border border-border border-l-0 rounded-r-full px-5 hover:bg-muted transition-colors shrink-0 flex items-center justify-center" 
                title="Szukaj"
              >
                <Search size={18} className="text-foreground/60" />
              </button>
            </form>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-1 md:w-64 md:flex-none flex items-center justify-end gap-1 md:gap-3">
          <div className="md:hidden mr-1">
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <Search size={20} className="text-foreground/70" />
            </button>
          </div>
          
          {isAdmin && (
            <Link 
              href="/admin" 
              className="hidden sm:inline-flex items-center px-3 py-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          )}
          
          <SignedOut>
            <SignInButton mode="modal">
              <button className="inline-flex items-center px-4 py-2 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all">
                Zaloguj
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <UserButton afterSignOutUrl="/">
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Mój Profil"
                  href="/user-profile"
                  labelIcon={<User size={16} />}
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
