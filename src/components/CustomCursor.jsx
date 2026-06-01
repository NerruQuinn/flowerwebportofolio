import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailsRef = useRef([]);

  const trailEmojis = ['🌸', '🌿', '🍃', '✿', '❀'];
  const maxParticles = 15;

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    
    let isHovering = false;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      addTrail(mouseX, mouseY);
    };

    const addTrail = (x, y) => {
      const particle = document.createElement('div');
      particle.textContent = trailEmojis[Math.floor(Math.random() * trailEmojis.length)];
      particle.style.position = 'fixed';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.transform = `translate(-50%, -50%) scale(1)`;
      particle.style.fontSize = `${Math.random() * 4 + 16}px`;
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9998';
      particle.style.transition = 'transform 800ms ease-out, opacity 800ms ease-out';
      particle.style.userSelect = 'none';
      
      document.body.appendChild(particle);
      trailsRef.current.push(particle);

      requestAnimationFrame(() => {
        particle.style.transform = `translate(-50%, -50%) scale(0)`;
        particle.style.opacity = '0';
      });

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
        trailsRef.current = trailsRef.current.filter((p) => p !== particle);
      }, 800);

      if (trailsRef.current.length > maxParticles) {
        const oldest = trailsRef.current.shift();
        if (oldest && oldest.parentNode) {
          oldest.parentNode.removeChild(oldest);
        }
      }
    };

    const onMouseClick = (e) => {
      for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.textContent = trailEmojis[Math.floor(Math.random() * trailEmojis.length)];
        particle.style.position = 'fixed';
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        particle.style.fontSize = `18px`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.transition = 'transform 500ms ease-out, opacity 500ms ease-out';
        particle.style.userSelect = 'none';
        
        document.body.appendChild(particle);

        const angle = (i / 6) * Math.PI * 2;
        const velocity = 40 + Math.random() * 20;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;

        requestAnimationFrame(() => {
          particle.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.5)`;
          particle.style.opacity = '0';
        });

        setTimeout(() => {
          if (particle.parentNode) particle.parentNode.removeChild(particle);
        }, 500);
      }
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a') || e.target.closest('button')) {
        isHovering = true;
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest('a') || e.target.closest('button')) {
        isHovering = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    const render = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        const inner = ringRef.current.firstChild;
        if (inner) {
          inner.style.transform = `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };
    
    let animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onMouseClick);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none">
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999]"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      >
        <div 
          className="w-[40px] h-[40px] border-2 border-primary rounded-full transition-transform duration-200 ease-out"
          style={{ transform: 'translate(-50%, -50%) scale(1)' }}
        />
      </div>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[8px] h-[8px] bg-primary rounded-full z-[10000]"
        style={{ transform: 'translate3d(0, 0, 0) translate(-50%, -50%)' }}
      />
    </div>
  );
};

export default CustomCursor;
