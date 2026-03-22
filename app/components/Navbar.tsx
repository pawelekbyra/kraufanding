'use client';

import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';

const Navbar = () => {
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'pawel.perfect@protonmail.com' || user?.primaryEmailAddress?.emailAddress === 'pawel.perfect@gmail.com';
  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral/10 px-4 lg:px-12 font-serif">
      <div className="navbar-start">
        <div className="flex flex-col">
          <a href="/" className="btn btn-ghost text-2xl font-black tracking-tighter h-auto min-h-0 py-0 flex flex-col items-start gap-0 hover:bg-transparent">
            <div className="flex items-baseline">polutek<span className="text-primary">.pl</span></div>
            <div className="w-full text-primary leading-none flex justify-between uppercase" style={{ fontSize: '7.5px', fontWeight: 900, letterSpacing: '0.05em' }}>
              <span>B</span><span>y</span><span>l</span><span>e</span><span className="w-1"></span>
              <span>n</span><span>i</span><span>e</span><span className="w-1"></span>
              <span>d</span><span>o</span><span className="w-1"></span>
              <span>p</span><span>r</span><span>a</span><span>c</span><span>y</span><span>!</span>
            </div>
          </a>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        {isAdmin && (
          <Link href="/admin" className="btn btn-ghost btn-sm font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
            Panel Admina
          </Link>
        )}
      </div>
      <div className="navbar-end gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn btn-ghost btn-sm font-bold uppercase tracking-widest">Sign In</button>
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
