import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                CROWDFUND
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Eksploruj</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Zacznij Projekt</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">O Nas</a>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Zaloguj
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-500/25">
              Dołącz Teraz
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
