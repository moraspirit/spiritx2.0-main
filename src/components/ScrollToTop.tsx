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
          className="group fixed bottom-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))] right-[max(1.5rem,calc(env(safe-area-inset-right)+1rem))] z-50 flex items-center justify-center rounded-full bg-white dark:bg-[#0c111a] shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] border border-slate-200/80 dark:border-white/10 p-0 text-[#0f2b46] dark:text-[#74CEDD] hover:shadow-[0_6px_24px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
          style={{ width: size, height: size }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="absolute inset-0 -rotate-90 pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="scroll-progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Background subtle track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-slate-100 dark:text-white/10"
            />

            {/* Active progress arc */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="url(#scroll-progress-gradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-[stroke-dashoffset] duration-75 ease-linear"
            />
          </svg>

          <ChevronUp
            className="relative z-10 w-5 h-5 text-[#0f2b46] dark:text-[#74CEDD] transition-transform duration-200 group-hover:-translate-y-0.5"
            strokeWidth={2.6}
            aria-hidden="true"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
