import React, { useState } from 'react';
import MagneticElement from './MagneticElement';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
];

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLinkClick = () => setDrawerOpen(false);

  return (
    <>
      <nav
        className="fixed top-0 w-full flex justify-between items-center px-margin-mobile md:px-margin-desktop py-unit-3 z-50 transition-all duration-500 bg-transparent"
        id="top-nav"
      >
        <MagneticElement>
          <a href="#" className="nav-brand font-headline-md text-headline-md text-on-surface tracking-tighter transition-colors duration-300">
            NERRU
          </a>
        </MagneticElement>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-gutter items-center">
          {navLinks.map(({ label, href }) => (
            <MagneticElement key={href}>
              <a
                className="nav-link font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors duration-300"
                href={href}
              >
                {label}
              </a>
            </MagneticElement>
          ))}
          <MagneticElement>
            <a
              className="hire-btn font-label-md text-label-md uppercase tracking-widest px-unit-3 py-unit-1 border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
              href="#contact"
            >
              Hire
            </a>
          </MagneticElement>
        </div>

        {/* Mobile Hamburger */}
        <MagneticElement>
          <button
            className="nav-hamburger md:hidden text-on-surface transition-colors duration-300"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </MagneticElement>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-backdrop" onClick={() => setDrawerOpen(false)} />
        <div className="mobile-drawer-panel">
          <MagneticElement>
            <button
              className="absolute top-6 right-6 text-on-surface"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </MagneticElement>

          {navLinks.map(({ label, href }) => (
            <MagneticElement key={href}>
              <a
                className="font-headline-md text-[24px] text-on-surface hover:text-primary transition-colors"
                href={href}
                onClick={handleLinkClick}
              >
                {label}
              </a>
            </MagneticElement>
          ))}
          <MagneticElement>
            <a
              className="font-label-md text-label-md uppercase tracking-widest px-unit-3 py-unit-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 text-center mt-4"
              href="#contact"
              onClick={handleLinkClick}
            >
              Hire Me
            </a>
          </MagneticElement>
        </div>
      </div>
    </>
  );
};

export default Navbar;
