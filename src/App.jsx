import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Skills from './components/Skills';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';
import useScrollAnimations from './hooks/useScrollAnimations';

function App() {
  useScrollAnimations();

  useEffect(() => {
    // ─── Reveal Observer ───
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
    document.querySelectorAll('.stagger-img').forEach((el) => revealObserver.observe(el));

    // ─── Smooth scroll for anchor links ───
    const smoothScroll = (e) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href');
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', smoothScroll);
    });

    // ─── Nav theme tracking ───
    const nav = document.getElementById('top-nav');

    const updateNav = () => {
      if (!nav) return;
      const scrollY = window.scrollY;

      // Scrolled state
      if (scrollY > 50) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }

      // Section theme tracking: check which section occupies the nav bar zone
      let currentTheme = 'light';
      const darkElements = document.querySelectorAll('[data-nav-theme="dark"]');
      darkElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 80) {
          currentTheme = 'dark';
        }
      });

      if (currentTheme === 'dark') {
        nav.classList.add('nav-dark-section');
      } else {
        nav.classList.remove('nav-dark-section');
      }
    };

    window.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav, { passive: true });
    setTimeout(updateNav, 100);

    return () => {
      revealObserver.disconnect();
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener('click', smoothScroll);
      });
      window.removeEventListener('scroll', updateNav);
      window.removeEventListener('resize', updateNav);
    };
  }, []);

  return (
    <div className="bg-surface text-on-surface selection:bg-primary selection:text-white overflow-x-hidden min-h-screen">
      <CustomCursor />
      <Navbar />
      {/* Hero renders a fixed z-10 canvas — everything below must be z-20+ to stack above it */}
      <Hero />
      <div className="relative z-20 bg-surface">
        <main>
          <About />
          <Work />
          <Skills />
        </main>
        <Contact />
      </div>
    </div>
  );
}

export default App;
