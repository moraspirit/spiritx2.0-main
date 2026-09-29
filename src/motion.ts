import type { Variants } from 'motion/react';

/** Ease-out-quint: fast start, long settle. The site's one easing curve for reveals. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Spread onto a motion element to play its `show` variant once, when it scrolls into view. */
export const revealOnce = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, amount: 0.25 },
} as const;

/** Headline-weight reveal: rises out of a soft blur. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE_OUT } },
};

/** Parent that staggers its `rise`/`lift` children. */
export const stagger = (gap = 0.09, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Lighter reveal for cards and tiles in a staggered group. */
export const lift: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE_OUT } },
};
