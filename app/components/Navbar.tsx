'use client';

import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { User, Search } from "lucide-react";

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

      <div className="navbar-center flex-1 max-w-[600px] hidden md:flex mx-4">
        <div className="relative w-full group">
          <div className="flex w-full">
            <input
              type="text"
              placeholder="Szukaj"
              className="w-full bg-[#FDFBF7] border border-[#ccc] rounded-l-full py-1.5 px-4 text-sm focus:outline-none focus:border-blue-500 shadow-inner focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-[#888]"
            />
            <button className="bg-[#f8f8f8] border border-[#ccc] border-l-0 rounded-r-full px-5 py-1.5 hover:bg-[#f0f0f0] transition-colors border-r-[#ccc]">
              <Search size={18} className="text-[#1a1a1a]/70" />
            </button>
          </div>
        </div>
      </div>
      <div className="navbar-end gap-2 md:gap-4">
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
