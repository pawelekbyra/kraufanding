export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-zinc-950 py-12 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600"></div>
              <span className="text-xl font-bold tracking-tight text-white uppercase">Secret Portal</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-500 max-w-sm">
              The future of decentralized collaboration is here. Building a workspace where privacy meets productivity, allowing teams to collaborate across borders.
            </p>
            <div className="flex items-center gap-6">
               {['Twitter', 'Discord', 'Telegram', 'Github'].map((social) => (
                  <a key={social} href="#" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">{social}</a>
               ))}
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4">
              {['Explore', 'How it Works', 'Success Stories', 'Community'].map((link) => (
                <li key={link}><a href="#" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'Cookies'].map((link) => (
                <li key={link}><a href="#" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 lg:mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-medium text-zinc-500 uppercase tracking-widest">
           <p>© 2024 Secret Portal Inc. All rights reserved.</p>
           <p>Powered by Decentralized Infrastructure</p>
        </div>
      </div>
    </footer>
  );
};
