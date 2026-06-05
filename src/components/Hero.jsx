import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import MagneticElement from './MagneticElement';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const frameCount = 240;

const Hero = () => {
  // Detect device at top of component
  const isMobile = window.innerWidth < 768;

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const gradientOverlayRef = useRef(null);
  const frameRef = useRef(null);
  const framesRef = useRef([]);
  const prevFrameIndexRef = useRef(-1);
  const [loadedCount, setLoadedCount] = useState(0);
  const isLoaded = loadedCount === frameCount;
  const loadPercent = Math.floor((loadedCount / frameCount) * 100);

  // Video metadata loader — mark as loaded when metadata is available
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setLoadedCount(frameCount);
    };

    video.addEventListener('canplay', handleLoaded);
    video.addEventListener('loadedmetadata', handleLoaded);
    if (video.readyState >= 3) handleLoaded();
    try { video.load(); } catch (e) {}

    return () => {
      video.removeEventListener('canplay', handleLoaded);
      video.removeEventListener('loadedmetadata', handleLoaded);
    };
  }, []);

  // Mobile frame preloading and sequencing
  useEffect(() => {
    if (!isMobile || !frameRef.current) return;

    // Preload all 80 frames into Image objects on mount
    const frames = [];
    let loadedFrames = 0;

    for (let i = 1; i <= 80; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/frames/frame_${frameNum}.jpg`;
      img.onload = () => {
        loadedFrames++;
        if (loadedFrames === 80) {
          setLoadedCount(frameCount);
        }
      };
      img.onerror = () => {
        loadedFrames++;
        if (loadedFrames === 80) {
          setLoadedCount(frameCount);
        }
      };
      frames.push(img);
    }

    framesRef.current = frames;

    // Use rAF loop reading window.scrollY
    let rafId;
    const updateFrame = () => {
      if (!frameRef.current) return;

      const scrollY = window.scrollY;
      const scrollZone = window.innerHeight * 5; // 0 to 500vh
      const fraction = Math.max(0, Math.min(1, scrollY / scrollZone));

      // Map scrollY to frame index: Math.floor(fraction * 79), clamped 0-79
      const frameIndex = Math.floor(fraction * 79);

      // Only update src if frame index changed
      if (frameIndex !== prevFrameIndexRef.current) {
        prevFrameIndexRef.current = frameIndex;
        const frameNum = String(frameIndex + 1).padStart(3, '0');
        frameRef.current.src = `/frames/frame_${frameNum}.webp`;
      }

      rafId = requestAnimationFrame(updateFrame);
    };

    rafId = requestAnimationFrame(updateFrame);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  // Scroll-driven video seeking and wrapper visibility (desktop only)
  useEffect(() => {
    if (isMobile || !isLoaded || !containerRef.current || !wrapperRef.current) return;

    let lastScrollTime = 0;
    const THROTTLE_MS = 16;

    // Track hero zone state to avoid unnecessary processing
    let wasPastHero = false;

    const updateWrapperVisibility = () => {
      const container = containerRef.current;
      const wrapper = wrapperRef.current;
      const overlay = gradientOverlayRef.current;
      const video = videoRef.current;
      if (!container || !wrapper) return;

      const containerBottom = container.offsetTop + container.offsetHeight;
      const scrollY = window.scrollY;
      const nowPastHero = scrollY >= containerBottom - window.innerHeight * 0.1;

      // ── PAST HERO ZONE: hide wrapper, stop seeking, pause video ──
      if (nowPastHero) {
        if (!wasPastHero) {
          wrapper.style.opacity = '0';
          wrapper.style.pointerEvents = 'none';
          if (video) { video.pause(); }
          wasPastHero = true;
        }
        return; // <── critical: skip ALL video/overlay work
      }

      // ── INSIDE HERO ZONE ──
      if (wasPastHero) {
        wasPastHero = false;
      }

      wrapper.style.opacity = '1';
      wrapper.style.pointerEvents = 'auto';

      const maxScroll = container.scrollHeight - window.innerHeight;
      const fraction = Math.max(0, Math.min(1, scrollY / maxScroll));
      const fadeStart = 0.7;
      const fadeOpacity = fraction > fadeStart ? (fraction - fadeStart) / (1 - fadeStart) : 0;
      if (overlay) {
        overlay.style.opacity = String(fadeOpacity);
      }

      if (video && video.duration) {
        const targetTime = fraction * video.duration;
        try {
          if (typeof video.fastSeek === 'function') {
            video.fastSeek(targetTime);
          } else {
            video.currentTime = targetTime;
          }
        } catch (e) {
          // setting currentTime can throw on some browsers if not ready
        }
      }
    };

    const onScroll = () => {
      if (Date.now() - lastScrollTime < THROTTLE_MS) return;
      lastScrollTime = Date.now();
      updateWrapperVisibility();
    };

    const onResize = () => updateWrapperVisibility();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [isMobile, isLoaded]);

  // Mouse-follow parallax on video
  useEffect(() => {
    if (!isLoaded || !videoRef.current) return;

    // Trigger hero text entrance animations once loading is done
    gsap.fromTo(
      '.hero-anim',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
    );

    const onMouseMove = (e) => {
      const xOff = (e.clientX / window.innerWidth - 0.5) * 30;
      const yOff = (e.clientY / window.innerHeight - 0.5) * 30;
      gsap.to(videoRef.current, {
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

      {/* ─── MOBILE: Frame Sequence Hero ─── */}
      {isMobile ? (
        <>
          {/* Fixed fullscreen frame image as background */}
          <img
            ref={frameRef}
            src="/frames/frame_001.webp"
            alt="hero"
            style={{
              position: 'fixed',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 10,
            }}
          />

          {/* Scrollable spacer div: height 500vh */}
          <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: '500vh' }}
            data-nav-theme="dark"
          >
            {/* Hero Content — z-20 above frames */}
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

            {/* Gradient overlay fades in after 70% scroll */}
            <div
              ref={gradientOverlayRef}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '500px',
                background: 'linear-gradient(to bottom, transparent 0%, #fafaf5 100%)',
                pointerEvents: 'none',
                zIndex: 15,
                opacity: 0,
              }}
            />
          </div>
        </>
      ) : (
        <>
          {/* ─── DESKTOP: Fixed Video — fades out when scrolled past hero zone ─── */}
          <div
            ref={wrapperRef}
            className="fixed inset-0 w-full h-full bg-black overflow-hidden z-10 pointer-events-none"
            style={{ transition: 'opacity 0.6s ease' }}
          >
            <video
              ref={videoRef}
              src={new URL('../assets/videohero-seekable.mp4', import.meta.url).href}
              preload="auto"
              muted
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.03)',
              }}
            />
            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
              }}
            />
            <div
              ref={gradientOverlayRef}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '500px',
                background: 'linear-gradient(to bottom, transparent 0%, #fafaf5 100%)',
                pointerEvents: 'none',
                zIndex: 2,
                opacity: 0,
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
            {/* Hero Content — z-20 above video */}
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
      )}
    </>
  );
};

export default Hero;
