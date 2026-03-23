'use client';

import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { User } from "lucide-react";

const Navbar = () => {
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'pawel.perfect@protonmail.com' || user?.primaryEmailAddress?.emailAddress === 'pawel.perfect@gmail.com';
  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral/10 px-4 lg:px-12 font-serif">
      <div className="navbar-start">
        <a href="/" className="btn btn-ghost text-2xl font-black tracking-tighter uppercase shrink-0">
          POLUTEK<span className="text-primary">.PL</span>
        </a>
      </div>
      <div className="navbar-center flex flex-1 max-w-[720px] mx-4">
        <div className="flex w-full group">
           <div className="flex flex-1 items-center bg-[#FDFBF7] border border-[#1a1a1a]/10 rounded-l-full px-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <input
                type="text"
                placeholder="Szukaj"
                className="w-full bg-transparent border-none outline-none text-[16px] py-2 placeholder-[#1a1a1a]/30"
              />
           </div>
           <button className="bg-[#1a1a1a]/5 border border-l-0 border-[#1a1a1a]/10 rounded-r-full px-6 hover:bg-[#1a1a1a]/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#1a1a1a]/60">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
           </button>
        </div>
        {isAdmin && (
          <Link href="/admin" className="btn btn-ghost btn-sm font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
            Panel Admina
          </Link>
        )}
      </div>
      <div className="navbar-end gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn btn-ghost btn-sm font-bold uppercase tracking-widest text-xs">Sign In / Sign Up</button>
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
  );
};

export default Navbar;
