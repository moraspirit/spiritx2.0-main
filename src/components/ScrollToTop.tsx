import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopProps {
  /** Scroll distance threshold in pixels before showing the button (default 120px) */
  threshold?: number;
}

export default function ScrollToTop({ threshold = 120 }: ScrollToTopProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const percent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setProgress(percent);
      } else {
        setProgress(0);
      }

      setIsVisible(scrollTop > threshold);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
      return;
    }
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const size = 50;
  const strokeWidth = 3.5;
  const center = size / 2;
  const radius = center - strokeWidth - 1.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={scrollToTop}
          aria-label={`Scroll to top (${Math.round(progress)}% scrolled)`}
          title={`Scroll to top (${Math.round(progress)}%)`}
          className="group fixed bottom-[max(1rem,calc(env(safe-area-inset-bottom)+0.5rem))] right-[max(1rem,calc(env(safe-area-inset-right)+0.5rem))] sm:bottom-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))] sm:right-[max(1.5rem,calc(env(safe-area-inset-right)+1rem))] z-50 flex items-center justify-center rounded-full border border-border bg-card shadow-[0_4px_24px_rgba(0,0,0,0.5)] p-0 text-brand-ink hover:shadow-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer select-none touch-manipulation"
          style={{ width: size, height: size }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="absolute inset-0 -rotate-90 pointer-events-none"
            aria-hidden="true"
          >
            {/* Background subtle track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-white/10"
            />

            {/* Active progress arc */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="hsl(var(--brand-ink))"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-[stroke-dashoffset] duration-75 ease-linear"
            />
          </svg>

          <ChevronUp
            className="relative z-10 w-5 h-5 text-brand-ink transition-transform duration-200 group-hover:-translate-y-0.5"
            strokeWidth={2.6}
            aria-hidden="true"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
