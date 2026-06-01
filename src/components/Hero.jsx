import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import MagneticElement from './MagneticElement';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const frameCount = 240;
const imageUrls = [];
for (let i = 1; i <= frameCount; i++) {
  const num = i.toString().padStart(3, '0');
  imageUrls.push(new URL(`../assets/backframe/frame_${num}.webp`, import.meta.url).href);
}

const Hero = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const imagesRef = useRef(new Array(frameCount));
  const currentFrameRef = useRef(0);
  const rafRef = useRef(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const isLoaded = loadedCount === frameCount;
  const loadPercent = Math.floor((loadedCount / frameCount) * 100);

  // Preload all frames into memory
  useEffect(() => {
    let loaded = 0;
    imageUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        imagesRef.current[index] = img;
        loaded++;
        setLoadedCount(loaded);
      };
      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
      };
    });
  }, []);

  // Draw a specific frame to the canvas with cover-fit + zoom
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Retina/High-DPI scaling (Ini akan fix gambar pecah)
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set actual canvas resolution multiplied by DPR
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Normalize coordinate system to use CSS pixels
    ctx.scale(dpr, dpr);

    // Enforce high-quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // NO artificial zoom (1.0) to prevent pixelation of original frames
    const ZOOM = 1.0;
    const cAspect = rect.width / rect.height;
    const iAspect = img.width / img.height;

    let dw, dh;
    if (cAspect > iAspect) {
      dw = rect.width * ZOOM;
      dh = (rect.width / iAspect) * ZOOM;
    } else {
      dh = rect.height * ZOOM;
      dw = (rect.height * iAspect) * ZOOM;
    }

    const ox = (rect.width - dw) / 2;
    const oy = (rect.height - dh) / 2;

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.drawImage(img, ox, oy, dw, dh);
  }, []);

  // Scroll-driven frame sequencing + canvas visibility
  useEffect(() => {
    if (!isLoaded || !canvasRef.current || !containerRef.current) return;

    drawFrame(0);

    const onScroll = () => {
      const container = containerRef.current;
      const wrapper = canvasWrapperRef.current;
      if (!container || !wrapper) return;

      const containerBottom = container.offsetTop + container.offsetHeight;
      const scrollY = window.scrollY;

      // Hide canvas once we scroll past the hero container
      if (scrollY >= containerBottom - window.innerHeight * 0.1) {
        wrapper.style.opacity = '0';
        wrapper.style.pointerEvents = 'none';
      } else {
        wrapper.style.opacity = '1';
        wrapper.style.pointerEvents = 'auto';
      }

      // Calculate frame index based on scroll within the container
      const maxScroll = container.scrollHeight - window.innerHeight;
      const fraction = Math.max(0, Math.min(1, scrollY / maxScroll));
      const idx = Math.min(frameCount - 1, Math.floor(fraction * frameCount));

      if (idx !== currentFrameRef.current) {
        currentFrameRef.current = idx;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(idx));
      }
    };

    const onResize = () => drawFrame(currentFrameRef.current);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    
    // Ensure it fires once
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isLoaded, drawFrame]);

  // Mouse-follow parallax on canvas
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    // Trigger hero text entrance animations once loading is done
    gsap.fromTo(
      '.hero-anim',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
    );

    const onMouseMove = (e) => {
      const xOff = (e.clientX / window.innerWidth - 0.5) * 30;
      const yOff = (e.clientY / window.innerHeight - 0.5) * 30;
      gsap.to(canvasRef.current, {
        x: -xOff,
        y: -yOff,
        duration: 1.2,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [isLoaded]);

  const scrollToContent = () => {
    gsap.to(window, {
      duration: 2,
      scrollTo: { y: containerRef.current.scrollHeight, autoKill: false },
      ease: 'power3.inOut',
    });
  };

  return (
    <>
      {/* ─── Loading Screen ─── */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
          <p className="font-label-md text-label-md uppercase tracking-[0.4em] text-primary mb-6 animate-pulse">
            Loading Experience
          </p>
          <div className="text-5xl font-display-lg text-white tabular-nums">
            {loadPercent}<span className="text-primary">%</span>
          </div>
          <div className="loading-bar-track mt-6">
            <div className="loading-bar-fill" style={{ width: `${loadPercent}%` }} />
          </div>
        </div>
      )}

      {/* ─── Fixed Canvas — fades out when scrolled past hero zone ─── */}
      <div
        ref={canvasWrapperRef}
        className="fixed inset-0 w-full h-full bg-black overflow-hidden z-10 pointer-events-none"
        style={{ transition: 'opacity 0.6s ease' }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'scale(1.03)' }} // Minimal scale just to hide parallax edges
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
          }}
        />
      </div>

      {/* ─── Scrollytelling Container (500vh tall = scroll zone for frames) ─── */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: '500vh' }}
        data-nav-theme="dark"
      >
        {/* Hero Content — z-20 above canvas */}
        <div className="sticky top-0 h-screen flex flex-col justify-center items-center relative px-margin-mobile text-center z-20">
          <div className="max-w-[1280px] w-full flex flex-col items-center">
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              padding: '40px 56px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <p className="hero-anim opacity-0 font-label-md text-label-md uppercase tracking-[0.4em] text-primary mb-4 drop-shadow-xl">
                Hi, I'm Joshua Bart — known as Nerruquinn
              </p>
              <h1 className="hero-anim opacity-0 font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white drop-shadow-2xl">
                Full Stack Developer
              </h1>
              <p className="hero-anim opacity-0 font-body-lg text-body-lg text-gray-200 mt-4 max-w-lg drop-shadow-lg">
                Crafting digital experiences through the lens of performance and aesthetic precision.
              </p>
            </div>
          </div>

          {/* Scroll CTA */}
          <MagneticElement>
            <div
              className="hero-anim opacity-0 absolute bottom-margin-desktop flex flex-col items-center gap-3 cursor-pointer group"
              onClick={scrollToContent}
            >
              <span className="font-label-md text-label-md uppercase tracking-widest text-white opacity-70 group-hover:opacity-100 transition-opacity">
                Scroll to Explore
              </span>
              <div className="scroll-line" />
            </div>
          </MagneticElement>
        </div>
      </div>
    </>
  );
};

export default Hero;
