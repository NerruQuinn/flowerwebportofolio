import React from 'react';
import MagneticElement from './MagneticElement';
import Gambar1 from '../assets/Gambar1.png';
import Gambar2 from '../assets/Gambar2.png';
import Gambar3 from '../assets/Gambar3.png';

const Work = () => {
  return (
    <section className="py-section-padding bg-inverse-surface text-inverse-on-surface overflow-hidden" data-nav-theme="dark" id="work">
      <div className="max-w-[1280px] mx-auto px-margin-mobile">
        <header className="mb-section-padding flex flex-col md:flex-row md:items-end justify-between gap-unit-4 reveal">
          <div>
            <span className="font-label-md text-label-md uppercase tracking-widest text-primary-fixed mb-unit-2 block">Selected Works</span>
            <h2 className="section-heading font-headline-lg text-headline-lg">Curated Projects</h2>
          </div>
          <p className="font-body-md text-body-md text-outline-variant max-w-xs">An exploration of full-stack capabilities through distinct visual and technical lenses.</p>
        </header>

        {/* Project 1: Full Width */}
        <article className="mb-section-padding grid grid-cols-1 md:grid-cols-12 gap-gutter items-center reveal">
          <div className="md:col-span-8 stagger-img-container">
            <img alt="The Arboretum Collective Dashboard" width="1200" height="675" className="w-full aspect-video object-cover stagger-img grayscale hover:grayscale-0 transition-all duration-700" src={Gambar1}/>
            <div className="card-shadow" />
          </div>
          <div className="md:col-span-4 flex flex-col gap-unit-4">
            <h3 className="font-headline-md text-headline-md">TeacherCrack</h3>
            <p className="font-body-md text-body-md text-outline-variant">A web application designed to streamline teacher administrative workflows — from lesson planning to student data management — powered by AI assistance.</p>
            <div className="flex flex-wrap gap-unit-2">
              <span className="px-unit-2 py-1 border border-outline-variant font-label-md text-[10px] uppercase">TYPESCRIPT</span>
              <span className="px-unit-2 py-1 border border-outline-variant font-label-md text-[10px] uppercase">TSX / JSX</span>
              <span className="px-unit-2 py-1 border border-outline-variant font-label-md text-[10px] uppercase">TAILWIND CSS</span>
              <span className="px-unit-2 py-1 border border-outline-variant font-label-md text-[10px] uppercase">NEXT.JS</span>
              <span className="px-unit-2 py-1 border border-outline-variant font-label-md text-[10px] uppercase">POSTGRESQL</span>
            </div>
            <div className="mt-unit-2">
              <MagneticElement>
                <a href="https://teachcrack-id.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-block px-unit-2 py-1 border border-outline-variant font-label-md text-[10px] uppercase hover:bg-outline-variant hover:text-surface transition-colors">
                  LIVE DEMO
                </a>
              </MagneticElement>
            </div>
          </div>
        </article>

        {/* Project 2: Staggered Right */}
        <article className="mb-section-padding grid grid-cols-1 md:grid-cols-12 gap-gutter items-center reveal">
          <div className="md:col-start-2 md:col-span-4 order-2 md:order-1 flex flex-col gap-unit-4 text-left md:text-right">
            <h3 className="font-headline-md text-headline-md">CekHarga ID</h3>
            <p className="font-body-md text-body-md text-outline-variant">A mobile application for searching and comparing product prices powered by Google Grounding and AI — helping users find the best deals across platforms in real-time.</p>
            <div className="flex flex-wrap gap-unit-2 justify-start md:justify-end">
              <span className="px-unit-2 py-1 border border-outline-variant font-label-md text-[10px] uppercase">DART / FLUTTER</span>
              <span className="px-unit-2 py-1 border border-outline-variant font-label-md text-[10px] uppercase">NODE.JS</span>
              <span className="px-unit-2 py-1 border border-outline-variant font-label-md text-[10px] uppercase">KOTLIN</span>
              <span className="px-unit-2 py-1 border border-outline-variant font-label-md text-[10px] uppercase">SWIFT</span>
              <span className="px-unit-2 py-1 border border-outline-variant font-label-md text-[10px] uppercase">GEMINI AI</span>
            </div>
            <div className="mt-unit-2 flex justify-start md:justify-end">
              <MagneticElement>
                <a href="https://cekharga-id-36737715812.asia-southeast1.run.app/#/home" target="_blank" rel="noopener noreferrer" className="inline-block px-unit-2 py-1 border border-outline-variant font-label-md text-[10px] uppercase hover:bg-outline-variant hover:text-surface transition-colors">
                  LIVE DEMO
                </a>
              </MagneticElement>
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-6 order-1 md:order-2 stagger-img-container">
            <img alt="Velorah Analytics Workplace" width="1200" height="675" className="w-full aspect-video object-cover stagger-img grayscale hover:grayscale-0 transition-all duration-700" src={Gambar2}/>
            <div className="card-shadow" />
          </div>
        </article>

        {/* Project 3: Staggered Left */}
        <article className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center reveal">
          <div className="md:col-span-6 stagger-img-container">
            <img alt="Crystalline API Visualization" width="1200" height="675" className="w-full aspect-video object-cover stagger-img grayscale hover:grayscale-0 transition-all duration-700" src={Gambar3}/>
            <div className="card-shadow" />
          </div>
          <div className="md:col-span-5 md:col-start-8 flex flex-col gap-unit-4">
            <h3 className="font-headline-md text-headline-md">Above The Clouds</h3>
            <p className="font-body-md text-body-md text-outline-variant">A relaxing tropical club experience built in Roblox — featuring a chill ambient atmosphere, scenic highland scenery, and social hangout spaces. Visited over 6,500 times.</p>
            <div className="flex flex-wrap gap-unit-2">
              <span className="px-unit-2 py-1 border border-outline-variant font-label-md text-[10px] uppercase">LUA</span>
            </div>
            <div className="mt-unit-2">
              <MagneticElement>
                <a href="https://www.roblox.com/share?code=5f9cc4256b0ce845944f29fe830b71b4&type=ExperienceDetails&stamp=1780291222167" target="_blank" rel="noopener noreferrer" className="inline-block px-unit-2 py-1 border border-outline-variant font-label-md text-[10px] uppercase hover:bg-outline-variant hover:text-surface transition-colors">
                  PLAY ON ROBLOX
                </a>
              </MagneticElement>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Work;
