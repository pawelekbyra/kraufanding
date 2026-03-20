import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <span className="text-2xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              CROWDFUND
            </span>
            <p className="text-gray-500 text-sm max-w-sm">
              Najnowocześniejsza platforma do finansowania społecznościowego. Pomagamy realizować marzenia i innowacyjne pomysły.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Platforma</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">O Nas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Zasady</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kariera</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Wsparcie</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Pomoc</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bezpieczeństwo</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            © 2024 Crowdfund Portal. Wszystkie prawa zastrzeżone.
          </p>
          <div className="flex space-x-6 text-gray-600 text-xs">
            <a href="#" className="hover:text-white transition-colors">Polityka Prywatności</a>
            <a href="#" className="hover:text-white transition-colors">Regulamin</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
