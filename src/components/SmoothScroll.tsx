import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

interface SmoothScrollContextType {
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null });

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // Mobile/touch devices already have hardware-accelerated momentum scrolling.
    // Running Lenis on mobile causes touch-lag, scroll stutter, and fights native gestures.
    const isTouchOrMobile =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.innerWidth < 1024;

    if (isTouchOrMobile) {
      const handleAnchorClick = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement).closest('a');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        if (href === '#/' || href === '#' || href === '#top') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        try {
          const id = href.replace(/^#\/?/, '');
          const targetElement = document.getElementById(id);
          if (targetElement) {
            e.preventDefault();
            const top = targetElement.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        } catch {
          // Ignore invalid selector
        }
      };

      document.addEventListener('click', handleAnchorClick, { capture: true });
      return () => document.removeEventListener('click', handleAnchorClick, { capture: true });
    }

    // Shorter glide so the wheel stays close to the page. A long duration
    // stacks on top of the pinned scroll stages and feels like lag.
    const lenis = new Lenis({
      duration: 0.55,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Global anchor link handler for smooth hash scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      if (href === '#/' || href === '#' || href === '#top') {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.2 });
        return;
      }

      // Safe lookup for hash anchors
      try {
        const id = href.replace(/^#\/?/, '');
        const targetElement = document.getElementById(id);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -70,
            duration: 1.2,
          });
        }
      } catch {
        // Ignore invalid CSS selector
      }
    };

    document.addEventListener('click', handleAnchorClick, { capture: true });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick, { capture: true });
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
