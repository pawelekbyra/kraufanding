import React from 'react';

const Footer = () => {
  return (
    <footer className="footer p-10 bg-base-100 text-base-content border-t border-base-200 flex flex-col md:flex-row justify-center items-center gap-8">
      <nav className="flex flex-row gap-8">
        <a className="link link-hover font-medium uppercase tracking-widest text-xs opacity-50">Regulamin</a>
        <a className="link link-hover font-medium uppercase tracking-widest text-xs opacity-50">Polityka prywatności</a>
      </nav>
    </footer>
  );
};

export default Footer;
