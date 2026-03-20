import React from 'react';

const Navbar = () => {
  return (
    <div className="navbar bg-base-100/60 backdrop-blur-2xl sticky top-0 z-50 border-b border-white/5 px-4 lg:px-12">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a href="#story">Story</a></li>
            <li><a href="#rewards">Rewards</a></li>
            <li><a href="#updates">Updates</a></li>
          </ul>
        </div>
        <a href="/" className="btn btn-ghost text-2xl font-black tracking-tighter text-primary hover:bg-transparent group">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:drop-shadow-[0_0_10px_rgba(var(--p),0.5)] transition-all">
            CROWDFUND
          </span>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-black gap-2">
          <li><a href="#story">Story</a></li>
          <li><a href="#rewards">Rewards</a></li>
          <li><a href="#updates">Updates</a></li>
        </ul>
      </div>
      <div className="navbar-end gap-4">
        <button className="btn btn-ghost btn-sm font-black uppercase tracking-widest text-xs opacity-70 hover:opacity-100 transition-opacity">Log in</button>
        <button className="btn btn-primary btn-sm md:btn-md rounded-xl font-black uppercase tracking-widest shadow-[0_0_15px_rgba(var(--p),0.3)] hover:shadow-[0_0_25px_rgba(var(--p),0.5)] hover:scale-105 transition-all px-6">
          Back Project
        </button>
      </div>
    </div>
  );
};

export default Navbar;
