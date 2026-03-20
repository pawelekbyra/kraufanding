export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 animate-glow"></div>
          <span className="text-xl font-bold tracking-tight text-white">Secret Project</span>
        </div>
        <div className="hidden md:block">
          <div className="flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#story" className="transition-colors hover:text-white">Story</a>
            <a href="#rewards" className="transition-colors hover:text-white">Rewards</a>
            <a href="#updates" className="transition-colors hover:text-white">Updates</a>
          </div>
        </div>
        <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95">
          Connect Wallet
        </button>
      </div>
    </nav>
  );
};
