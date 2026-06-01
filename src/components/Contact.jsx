import React from 'react';
import MagneticElement from './MagneticElement';

const socialLinks = [
  { label: 'joshuabart1306@gmail.com', href: 'mailto:joshuabart1306@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/joshua-bartimeus/' },
  { label: 'GitHub', href: 'https://github.com/NerruQuinn' },
  { label: 'Read.cv', href: '#' },
];

const Contact = () => {
  return (
    <>
      <section className="py-section-padding px-margin-mobile md:px-margin-desktop bg-surface" id="contact">
        <div className="max-w-[1280px] mx-auto text-center">
          <span className="font-label-md text-label-md uppercase tracking-[0.4em] text-primary mb-4 block reveal">
            Open for collaboration
          </span>
          <h2
            className="section-heading font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-8 reveal"
            style={{ transitionDelay: '100ms' }}
          >
            Let's Work Together
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 reveal" style={{ transitionDelay: '250ms' }}>
            {socialLinks.map(({ label, href }) => (
              <MagneticElement key={label}>
                <a
                  className="font-body-lg text-body-lg text-on-surface hover:text-primary transition-colors duration-300 underline decoration-primary/30 underline-offset-8 hover:decoration-primary"
                  href={href}
                >
                  {label}
                </a>
              </MagneticElement>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-inverse-surface py-8 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-headline-md text-[20px] text-inverse-on-surface tracking-tighter">
            NERRU
          </div>
          <p className="font-body-md text-[12px] text-outline-variant uppercase tracking-widest text-center">
            © {new Date().getFullYear()} NERRU STRATEGIES. CRAFTED FOR THE CINEMATIC WEB.
          </p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-outline-variant text-[20px] hover:text-primary transition-colors cursor-pointer">eco</span>
            <span className="material-symbols-outlined text-outline-variant text-[20px] hover:text-primary transition-colors cursor-pointer">code</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Contact;
