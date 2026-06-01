import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const useMagneticEffect = () => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Hanya aktif pada device dengan mouse (fine pointer)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let isHovering = false;

    const handleMouseEnter = () => {
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        boxShadow: 'none',
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const rect = element.getBoundingClientRect();
      const xObj = gsap.getProperty(element, "x") || 0;
      const yObj = gsap.getProperty(element, "y") || 0;

      const centerX = rect.left - xObj + rect.width / 2;
      const centerY = rect.top - yObj + rect.height / 2;

      const distX = clientX - centerX;
      const distY = clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      const maxDistance = 80;

      if (distance < maxDistance) {
        const pullFactor = 0.3; // Max perpindahan 20-30px (80 * 0.3 = 24px)
        
        gsap.to(element, {
          x: distX * pullFactor,
          y: distY * pullFactor,
          scale: isHovering ? 1.05 : 1,
          boxShadow: isHovering ? '0 0 15px rgba(212, 175, 55, 0.4)' : 'none',
          duration: 0.3,
          ease: 'power2.out',
        });
      } else if (!isHovering) {
        gsap.to(element, {
          x: 0,
          y: 0,
          scale: 1,
          boxShadow: 'none',
          duration: 0.7,
          ease: 'elastic.out(1, 0.3)',
        });
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return ref;
};

export default useMagneticEffect;
