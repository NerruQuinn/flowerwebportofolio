import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useScrollAnimations = () => {
  useEffect(() => {
    // Wait for DOM to settle after React render
    const ctx = gsap.context(function () {
      // ═══════════════════════════════════════════
      // 1. ABOUT SECTION
      // ═══════════════════════════════════════════

      // About section scroll-triggered exit animation with pin
      const aboutExitTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '#about',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          pin: true,
        },
      });

      aboutExitTimeline.to(
        ['#about .about-heading-left', '#about .about-stat-left'],
        { x: -200, opacity: 0, ease: 'power2.out' },
        0
      );

      aboutExitTimeline.to(
        ['#about .about-heading-right', '#about .about-stat-right'],
        { x: 200, opacity: 0, ease: 'power2.out' },
        0
      );

      aboutExitTimeline.to(
        '#about .about-stat-center',
        { y: 100, opacity: 0, ease: 'power2.out' },
        0
      );

      // ═══════════════════════════════════════════
      // 2. WORK / PROJECTS SECTION
      // ═══════════════════════════════════════════

      // Section header parallax
      gsap.to('#work header h2', {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '#work header',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Project cards — scroll-triggered entrance from below with staggered delay
      const projectArticles = gsap.utils.toArray('#work article');
      projectArticles.forEach((card, i) => {
        gsap.set(card, { transformOrigin: 'center center' });

        gsap.fromTo(card,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: i * 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );

        const img = card.querySelector('img');
        const shadow = card.querySelector('.card-shadow');
        let floatTween;
        let shadowTween;

        if (img && shadow) {
          floatTween = gsap.to(img, {
            y: -10,
            duration: 3,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.8,
          });

          shadowTween = gsap.to(shadow, {
            scale: 0.7,
            opacity: 0.4,
            duration: 3,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.8,
          });
        }

        const onMouseEnter = () => {
          if (floatTween) floatTween.duration(1.5);
          if (shadowTween) shadowTween.duration(1.5);
        };
        const onMouseLeave = () => {
          if (floatTween) floatTween.duration(3);
          if (shadowTween) shadowTween.duration(3);
        };

        card.addEventListener('mouseenter', onMouseEnter);
        card.addEventListener('mouseleave', onMouseLeave);

        this.add(() => {
          card.removeEventListener('mouseenter', onMouseEnter);
          card.removeEventListener('mouseleave', onMouseLeave);
          if (floatTween) floatTween.kill();
          if (shadowTween) shadowTween.kill();
        });
      });

      projectArticles.forEach((article) => {
        const img = article.querySelector('img');
        if (img) {
          gsap.to(img, {
            y: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: article,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        }
      });

      // Tech stack tags — batch reveal
      ScrollTrigger.batch('#work span[class*="border-outline-variant"]', {
        onEnter: (batch) => {
          gsap.fromTo(batch,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.5)' }
          );
        },
        start: 'top 90%',
        once: true,
      });

      // ═══════════════════════════════════════════
      // 3. SKILLS SECTION
      // ═══════════════════════════════════════════

      // Section title parallax
      gsap.to('#skills h2', {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '#skills',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Gold line — fast decorative parallax
      gsap.to('#skills .gold-line', {
        yPercent: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: '#skills',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Skills list items — staggered reveal from left
      ScrollTrigger.batch('.skill-list-item', {
        onEnter: (batch) => {
          gsap.fromTo(batch,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: 'power2.out' }
          );
        },
        start: 'top 90%',
        once: true,
      });

      // Skills columns — staggered entrance
      const skillColumns = gsap.utils.toArray('#skills .grid > div');
      skillColumns.forEach((col, colIdx) => {
        // Column header
        gsap.fromTo(col,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: col,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );

      });

      // Material icons — decorative parallax
      const skillIcons = gsap.utils.toArray('#skills .material-symbols-outlined');
      skillIcons.forEach((icon) => {
        gsap.to(icon, {
          y: -20,
          rotation: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: icon,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });

      // ═══════════════════════════════════════════
      // 4. CONTACT SECTION
      // ═══════════════════════════════════════════

      // Entire contact block — fade in + scale up
      gsap.fromTo('#contact .max-w-\\[1280px\\]',
        { scale: 0.92, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
      // Section heading entrance batch
      ScrollTrigger.batch('.section-heading', {
        onEnter: (batch) => {
          gsap.fromTo(batch,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out' }
          );
        },
        start: 'top 90%',
        once: true,
      });
      // Contact heading — parallax
      gsap.to('#contact h2', {
        y: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Social links — staggered entrance
      const socialLinks = gsap.utils.toArray('#contact a');
      if (socialLinks.length) {
        gsap.fromTo(socialLinks,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#contact .flex',
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Footer — subtle slide up
      gsap.fromTo('footer',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: 'footer',
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert(); // Cleanup all ScrollTrigger instances
  }, []);
};

export default useScrollAnimations;
