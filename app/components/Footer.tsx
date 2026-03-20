import React from 'react';

const Footer = () => {
  return (
    <footer className="footer p-10 bg-base-100 text-base-content border-t border-base-200">
      <nav>
        <h6 className="footer-title opacity-100 font-black">Serwisy</h6>
        <a className="link link-hover font-medium">Branding</a>
        <a className="link link-hover font-medium">Design</a>
        <a className="link link-hover font-medium">Marketing</a>
        <a className="link link-hover font-medium">Reklama</a>
      </nav>
      <nav>
        <h6 className="footer-title opacity-100 font-black">Firma</h6>
        <a className="link link-hover font-medium">O nas</a>
        <a className="link link-hover font-medium">Kontakt</a>
        <a className="link link-hover font-medium">Praca</a>
        <a className="link link-hover font-medium">Prasowe</a>
      </nav>
      <nav>
        <h6 className="footer-title opacity-100 font-black">Prawne</h6>
        <a className="link link-hover font-medium">Regulamin</a>
        <a className="link link-hover font-medium">Polityka prywatności</a>
        <a className="link link-hover font-medium">Cookie policy</a>
      </nav>
      <form>
        <h6 className="footer-title opacity-100 font-black">Newsletter</h6>
        <fieldset className="form-control w-80">
          <label className="label">
            <span className="label-text font-bold text-base-content/50 uppercase tracking-widest text-xs">Wpisz swój email</span>
          </label>
          <div className="join shadow-lg">
            <input type="text" placeholder="username@site.com" className="input input-bordered join-item w-full" />
            <button className="btn btn-primary join-item font-black">Subskrybuj</button>
          </div>
        </fieldset>
      </form>
    </footer>
  );
};

export default Footer;
