'use client';

import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral/10 px-4 lg:px-12 font-serif">
      <div className="navbar-start">
        <a href="/" className="btn btn-ghost text-2xl font-black tracking-tighter uppercase">
          POLUTEK<span className="text-primary">.PL</span>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
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
