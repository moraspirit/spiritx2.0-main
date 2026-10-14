import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

export type ParallaxPhoto = { src: string; alt: string; pos?: string };

type Props = {
  photos: ParallaxPhoto[];
  /** Overlay shown while the banner is still closed; fades out as the gallery unfurls. */
  intro?: ReactNode;
  /** Pinned strip along the bottom edge once the gallery has unfurled. */
  footer?: ReactNode;
  /** Scroll track length. Longer = slower unfurl. */
  heightVh?: number;
};

const COLUMNS = 4;

/**
 * Sticky banner that grows to full bleed, then tilts a four-column photo wall out of 3D
 * while the columns drift at different speeds. Driven by page scroll over `heightVh`.
 */
export function ParallaxUnfurlingGallery({ photos, intro, footer, heightVh = 420 }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [viewport, setViewport] = useState({ w: 1280, h: 800 });

  useEffect(() => {
    const check = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const isMobile = viewport.w < 768;

  // Phones get a slightly shorter track than desktop, but still long enough for the unfurl to play.
  const effectiveHeight = isMobile ? 170 : heightVh;

  // Repeat each column's photos until it is comfortably taller than the wall plus its drift,
  // so no column runs out of photos (the old fixed 2x left gaps on narrow screens).
  const numColumns = isMobile ? 3 : COLUMNS;
  // Phones show a shorter wall and only the first nine photos, so the section stays brief.
  const wallVh = isMobile ? 115 : 150;
  const shown = useMemo(() => (isMobile ? photos.slice(0, 9) : photos), [photos, isMobile]);
  const columns = useMemo(() => {
    const colWidth = Math.max(viewport.w * 0.22, viewport.w < 640 ? 130 : viewport.w < 768 ? 170 : 200);
    const gap = viewport.w < 768 ? 12 : 24;
    const itemHeight = (colWidth * 2) / 3 + gap;
    const wallHeight = viewport.h * (wallVh / 100);
    const needed = wallHeight * (isMobile ? 1.35 : 1.7);
    return Array.from({ length: numColumns }, (_, c) => {
      const base = shown.filter((_, i) => i % numColumns === c);
      if (base.length === 0) return base;
      // Cap repeats on phones so the sticky stage has fewer image nodes to composite.
      const maxRepeats = isMobile ? 3 : 8;
      const repeats = Math.min(maxRepeats, Math.max(2, Math.ceil(needed / (base.length * itemHeight))));
      return Array.from({ length: repeats }, () => base).flat();
    });
  }, [shown, viewport, numColumns, wallVh, isMobile]);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  // Touch scrolling maps straight to scroll progress: a spring adds visible lag under a finger.
  const spring = useSpring(scrollYProgress, { stiffness: 100, damping: 20, mass: 0.5 });
  const settled = useMotionValue(1);
  const p = reduce ? settled : (isMobile ? scrollYProgress : spring);

  const bannerWidth = useTransform(p, [0, 0.12], ['90vw', '100vw']);
  const bannerHeight = useTransform(p, [0, 0.12], ['80svh', '100svh']);
  const bannerRadius = useTransform(p, [0, 0.12], ['40px', '0px']);
  const bannerBorder = useTransform(p, [0, 0.12], ['3px', '0px']);
  // Wall starts dimmed so the heading reads; it comes up to full strength as the banner opens.
  const wallOpacity = useTransform(p, [0, 0.12], [0.5, 1]);
  const introOpacity = useTransform(p, [0, 0.08], [1, 0]);
  const footerOpacity = useTransform(p, [0.75, 0.95], [0, 1]);

  const rotateY = useTransform(p, [0.12, 1], [-22, -6]);
  const rotateX = useTransform(p, [0.12, 1], [12, 3]);
  const rotateZ = useTransform(p, [0.12, 1], [6, 1]);
  const z = useTransform(p, [0.12, 1], [-350, 0]);

  const k = isMobile ? 0.5 : 1;
  const drift = [
    useTransform(p, [0.12, 1], ['0%', `${-40 * k}%`]),
    useTransform(p, [0.12, 1], [`${-40 * k}%`, `${10 * k}%`]),
    useTransform(p, [0.12, 1], ['0%', `${-40 * k}%`]),
    useTransform(p, [0.12, 1], [`${-30 * k}%`, `${20 * k}%`]),
  ];

  return (
    <div ref={trackRef} className="relative w-full" style={{ height: `${effectiveHeight}svh` }}>
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden">
        <motion.div
          style={{
            width: bannerWidth,
            height: bannerHeight,
            borderRadius: bannerRadius,
            borderWidth: bannerBorder,
          }}
          className="relative mx-auto flex max-w-[1920px] items-center justify-center overflow-hidden border-border bg-background will-change-transform"
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
            {/* Edge fades into the page colour so the wall never ends in a hard line. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 z-20"
              style={{
                background:
                  'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 22%, transparent 78%, hsl(var(--background)) 100%), linear-gradient(to right, hsl(var(--background)) 0%, transparent 18%, transparent 82%, hsl(var(--background)) 100%)',
              }}
            />

            <motion.div
              style={{ rotateX, rotateY, rotateZ, z, opacity: wallOpacity, transformStyle: 'preserve-3d', height: `${wallVh}vh` }}
              className="flex w-[120vw] origin-center items-center justify-center gap-3 will-change-transform md:gap-6"
            >
              {columns.map((col, c) => (
                <motion.div
                  key={c}
                  style={{ y: drift[c] }}
                  className="flex w-[22vw] min-w-[130px] shrink-0 flex-col gap-3 sm:min-w-[170px] md:min-w-[200px] md:gap-6"
                >
                  {col.map((photo, i) => (
                    <div
                      key={`${c}-${i}`}
                      className="w-full flex-shrink-0 overflow-hidden bg-muted"
                    >
                      <img
                        src={photo.src}
                        alt={i < Math.ceil(shown.length / numColumns) ? photo.alt : ''}
                        aria-hidden={i < Math.ceil(shown.length / numColumns) ? undefined : true}
                        width={1400}
                        height={933}
                        decoding="async"
                        loading={i < 2 ? 'eager' : 'lazy'}
                        draggable={false}
                        className="block aspect-[3/2] h-auto w-full"
                      />
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {intro ? (
            <motion.div
              style={{ opacity: introOpacity }}
              className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6 text-center"
            >
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-x-16 -inset-y-10 -z-10 blur-2xl"
                  style={{ background: 'radial-gradient(closest-side, hsl(var(--background) / 0.9), hsl(var(--background) / 0.6) 70%, transparent)' }}
                />
                {intro}
              </div>
            </motion.div>
          ) : null}

          {footer ? (
            <motion.div
              style={{ opacity: footerOpacity }}
              className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-1 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center"
            >
              {footer}
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
