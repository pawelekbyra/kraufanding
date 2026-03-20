import React from 'react';

const Navbar = () => {
  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-zinc-950/60 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent tracking-tighter">
                SECRET PROJECT
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                <a
                  href="#story"
                  onClick={scrollToSection('story')}
                  className="text-gray-400 hover:text-white px-3 py-2 text-sm font-bold transition-colors cursor-pointer"
                >
                  Story
                </a>
                <a
                  href="#rewards"
                  onClick={scrollToSection('rewards')}
                  className="text-gray-400 hover:text-white px-3 py-2 text-sm font-bold transition-colors cursor-pointer"
                >
                  Rewards
                </a>
                <a
                  href="#updates"
                  onClick={scrollToSection('updates')}
                  className="text-gray-400 hover:text-white px-3 py-2 text-sm font-bold transition-colors cursor-pointer"
                >
                  Updates
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-white text-sm font-bold transition-colors">
              Sign In
            </button>
            <button className="bg-white text-black px-5 py-2 rounded-xl text-sm font-black transition-all shadow-xl shadow-white/10 hover:scale-105 active:scale-95">
              Back Project
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
