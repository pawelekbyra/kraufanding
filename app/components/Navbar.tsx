import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent tracking-tighter">
                CROWDFUND
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#story" className="text-gray-400 hover:text-white text-sm font-bold transition-colors">Story</a>
                <a href="#rewards" className="text-gray-400 hover:text-white text-sm font-bold transition-colors">Rewards</a>
                <a href="#updates" className="text-gray-400 hover:text-white text-sm font-bold transition-colors">Updates</a>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-white text-sm font-bold transition-colors">
              Log in
            </button>
            <button className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95">
              Back Project
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
