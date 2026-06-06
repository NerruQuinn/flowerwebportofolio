import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticElement from './MagneticElement';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const Hero = () => {
  // Detect device at top of component
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  const isMobile = window.innerWidth < 768;

  const frameCount = isTablet ? 64 : 40;
  const frameDir = isTablet ? '/frames-tablet' : '/frames';

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const mobileSpacerRef = useRef(null);
  const wrapperRef = useRef(null);
  const gradientOverlayRef = useRef(null);
  const mobileOverlayRef = useRef(null);
  const canvasRef = useRef(null);
  const tabletVideoRef = useRef(null);
  const framesRef = useRef([]);
  const objRef = useRef({ frame: 0 });
  const scaleRef = useRef({ scale: 1, offsetX: 0, offsetY: 0 });
  const [loadedCount, setLoadedCount] = useState(0);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const loaderRef = useRef(null);
  const loaderContentRef = useRef(null);
  const percentRef = useRef({ val: 0 });
  const [displayPercent, setDisplayPercent] = useState(0);
  const [mobileFramesLoaded, setMobileFramesLoaded] = useState(false);
  const rawIsLoaded = isMobile ? mobileFramesLoaded : loadedCount === frameCount;
  const loadPercent = Math.floor((loadedCount / frameCount) * 100);

  useEffect(() => {
    gsap.to(percentRef.current, { val: loadPercent, duration: 0.5, ease: "power2.out", onUpdate: () => setDisplayPercent(Math.round(percentRef.current.val)) });
  }, [loadPercent]);

  useEffect(() => {
    if (rawIsLoaded && displayPercent >= 99) {
      const tl = gsap.timeline({ onComplete: () => setIsFullyLoaded(true) });
      tl.to(loaderContentRef.current, { y: -50, opacity: 0, duration: 0.6, ease: "power3.in" }).to(loaderRef.current, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "-=0.2");
    }
  }, [rawIsLoaded, displayPercent]);

  // Video metadata loader â€” mark as loaded when metadata is available
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

  

  // Mobile Canvas + ScrollTrigger frame animation (non-tablet mobile)
  useEffect(() => {
    if (!isMobile || !canvasRef.current || !mobileSpacerRef.current) return;

    // Preload all 40 frames as ImageBitmap
    const frames = [];
    let loadedFrames = 0;

    const loadFrame = async (frameNum) => {
      try {
        const response = await fetch(`${frameDir}/frame_${String(frameNum).padStart(3, '0')}.webp`);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        frames[frameNum - 1] = bitmap;
        loadedFrames++;
        if (loadedFrames === frameCount) {
          initScrollTrigger();
        }
      } catch (e) {
        console.error(`Failed to load frame ${frameNum}:`, e);
        loadedFrames++;
        if (loadedFrames === frameCount) {
          initScrollTrigger();
        }
      }
    };

    // Load all frames
    for (let i = 1; i <= frameCount; i++) {
      loadFrame(i);
    }

    const initScrollTrigger = () => {
      setLoadedCount(frameCount);
      setMobileFramesLoaded(true);

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas dimensions to match viewport
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Calculate cover-fit scale/position ONCE from first frame
      const baseWidth = frames[0].width;
      const baseHeight = frames[0].height;
      const baseScale = Math.max(canvas.width / baseWidth, canvas.height / baseHeight);
      const offsetX = (canvas.width - baseWidth * baseScale) / 2;
      const offsetY = (canvas.height - baseHeight * baseScale) / 2;
      scaleRef.current = { scale: baseScale, offsetX, offsetY };

      // Cover-fit draw helper using cached scale/position
      const drawFrame = (frame) => {
        const { scale, offsetX, offsetY } = scaleRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frame, offsetX, offsetY, frame.width * scale, frame.height * scale);
      };

      // Initialize with first frame
      if (frames[0]) {
        drawFrame(frames[0]);
      }

      // Create GSAP animation with ScrollTrigger
      const obj = { frame: 0 };
      gsap.to(obj, {
        frame: 39,
        ease: 'none',
        scrollTrigger: {
          trigger: mobileSpacerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          smoothChildTiming: true,
        },
        onUpdate: () => {
            const currentFrame = frames[Math.round(obj.frame)];
            if (currentFrame) drawFrame(currentFrame);
          }
      });

      // GSAP lagSmoothing allowed to run

      // Store in refs for resize handler access
      framesRef.current = frames;
      objRef.current = obj;
    };

    // Resize + orientation change handler â€” recalculates cached cover-fit from frames[0]
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Recalculate scale/position from frames[0] dimensions
      const frames = framesRef.current;
      const currentFrame = frames[Math.round(objRef.current.frame)];
      if (frames[0] && currentFrame) {
        const baseWidth = frames[0].width;
        const baseHeight = frames[0].height;
        const baseScale = Math.max(canvas.width / baseWidth, canvas.height / baseHeight);
        scaleRef.current = {
          scale: baseScale,
          offsetX: (canvas.width - baseWidth * baseScale) / 2,
          offsetY: (canvas.height - baseHeight * baseScale) / 2,
        };
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(currentFrame, scaleRef.current.offsetX, scaleRef.current.offsetY, currentFrame.width * baseScale, currentFrame.height * baseScale);
      }
    };

    window.addEventListener('resize', handleResize);
    screen.orientation?.addEventListener('change', handleResize);

    return () => {
      // Cleanup ScrollTrigger on unmount
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === mobileSpacerRef.current) {
          trigger.kill();
        }
      });
      // Cleanup resize / orientation listeners
      window.removeEventListener('resize', handleResize);
      screen.orientation?.removeEventListener('change', handleResize);
    };
  }, [isMobile, isTablet]);

  // Scroll-driven video seeking and wrapper visibility (desktop only) â€” GSAP ScrollTrigger
  useEffect(() => {
    if (isMobile || !isFullyLoaded || !containerRef.current || !wrapperRef.current) return;

    // 1. Video seeking based on scroll progress
    ScrollTrigger.create({
      trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      onUpdate: (self) => {
          const video = videoRef.current;
          if (!video || !video.duration) return;
          
          const targetTime = self.progress * video.duration;
          
          if (!video.isUpdating) {
            video.isUpdating = true;
            requestAnimationFrame(() => {
              if (Math.abs(video.currentTime - targetTime) > 0.05) {
                video.currentTime = targetTime;
              }
              video.isUpdating = false;
            });
          }
        }
    });

    // 2. Wrapper visibility â€” hide when scrolled past hero zone
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'bottom 10%',
      end: 'bottom top',
      onEnter: () => {
        if (wrapperRef.current) {
          wrapperRef.current.style.opacity = '0';
          wrapperRef.current.style.pointerEvents = 'none';
        }
      },
      onLeaveBack: () => {
        if (wrapperRef.current) {
          wrapperRef.current.style.opacity = '1';
          wrapperRef.current.style.pointerEvents = 'auto';
        }
      }
    });

    // 3. Gradient overlay fades in after 70% scroll
    gsap.to(gradientOverlayRef.current, {
      opacity: 1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: '70% top',
        end: 'bottom bottom',
        scrub: true,
      }
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [isMobile, isFullyLoaded]);

  // Hero text entrance animation
  useEffect(() => {
    const shouldAnimate = isMobile ? mobileFramesLoaded : isFullyLoaded;
    if (!shouldAnimate) return;

    gsap.fromTo(
      '.hero-anim',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
    );
  }, [isMobile, mobileFramesLoaded, isFullyLoaded]);

  // Mouse-follow parallax on video
  useEffect(() => {
    if (!isFullyLoaded || !videoRef.current) return;

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
  }, [isFullyLoaded]);

  const scrollToContent = () => {
    gsap.to(window, {
      duration: 2,
      scrollTo: { y: containerRef.current.scrollHeight, autoKill: false },
      ease: 'power3.inOut',
    });
  };

  return (
    <>
      {/* â”€â”€â”€ Loading Screen â”€â”€â”€ */}
      {!isFullyLoaded && (
          <div ref={loaderRef} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
            <div ref={loaderContentRef} className="flex flex-col items-center">
              <p className="font-label-md text-label-md uppercase tracking-[0.4em] text-primary mb-6 animate-pulse">
                Loading Experience
              </p>
              <div className="text-5xl font-display-lg text-white tabular-nums">
                {displayPercent}<span className="text-primary">%</span>
              </div>
              <div className="loading-bar-track mt-6">
                <div className="loading-bar-fill" style={{ width: `${displayPercent}%` }} />
              </div>
            </div>
          </div>
        )}

      {/* â”€â”€â”€ MOBILE: Frame Sequence Hero â”€â”€â”€ */}
      {isMobile ? (
        <>
          {/* Hidden tablet video for requestVideoFrameCallback */}
          {isTablet && (
            <video
              ref={tabletVideoRef}
              src="/videohero-seekable.mp4"
              preload="auto"
              muted
              playsInline
              style={{ display: 'none' }}
            />
          )}

          {/* Fixed fullscreen canvas as background */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'fixed',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100vw',
              height: '100vh',
              zIndex: 10,
            }}
          />

          {/* Scrollable spacer div: height 500vh */}
          <div
            ref={mobileSpacerRef}
            className="relative w-full"
            style={{ height: '500vh' }}
            data-nav-theme="dark"
          >
            {/* Hero Content â€” z-20 above frames */}
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
                    Hi, I'm Joshua Bart â€” known as Nerruquinn
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
              ref={mobileOverlayRef}
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
          {/* â”€â”€â”€ DESKTOP: Fixed Video â€” fades out when scrolled past hero zone â”€â”€â”€ */}
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

          {/* â”€â”€â”€ Scrollytelling Container (500vh tall = scroll zone for frames) â”€â”€â”€ */}
          <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: '500vh' }}
            data-nav-theme="dark"
          >
            {/* Hero Content â€” z-20 above video */}
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
                    Hi, I'm Joshua Bart â€” known as Nerruquinn
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
