import { useMemo, useRef, type ReactNode } from 'react';
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

  // Round-robin photos into columns, doubled so the drift never runs out of images.
  const columns = useMemo(
    () =>
      Array.from({ length: COLUMNS }, (_, c) => {
        const base = photos.filter((_, i) => i % COLUMNS === c);
        return [...base, ...base];
      }),
    [photos]
  );

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const spring = useSpring(scrollYProgress, { stiffness: 100, damping: 20, mass: 0.5 });
  const settled = useMotionValue(1);
  const p = reduce ? settled : spring;

  const bannerWidth = useTransform(p, [0, 0.15], ['90vw', '100vw']);
  const bannerHeight = useTransform(p, [0, 0.15], ['80svh', '100svh']);
  const bannerRadius = useTransform(p, [0, 0.15], ['40px', '0px']);
  const bannerBorder = useTransform(p, [0, 0.15], ['3px', '0px']);
  // Wall starts dimmed so the heading reads; it comes up to full strength as the banner opens.
  const wallOpacity = useTransform(p, [0, 0.15], [0.5, 1]);
  const introOpacity = useTransform(p, [0, 0.1], [1, 0]);
  const footerOpacity = useTransform(p, [0.8, 0.95], [0, 1]);

  const rotateY = useTransform(p, [0.15, 1], [-22, -6]);
  const rotateX = useTransform(p, [0.15, 1], [12, 3]);
  const rotateZ = useTransform(p, [0.15, 1], [6, 1]);
  const z = useTransform(p, [0.15, 1], [-350, 0]);

  const drift = [
    useTransform(p, [0.15, 1], ['0%', '-40%']),
    useTransform(p, [0.15, 1], ['-40%', '10%']),
    useTransform(p, [0.15, 1], ['0%', '-40%']),
    useTransform(p, [0.15, 1], ['-30%', '20%']),
  ];

  return (
    <div ref={trackRef} className="relative w-full" style={{ height: `${heightVh}svh` }}>
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
              style={{ rotateX, rotateY, rotateZ, z, opacity: wallOpacity, transformStyle: 'preserve-3d' }}
              className="flex h-[150vh] w-[120vw] origin-center items-center justify-center gap-4 will-change-transform md:gap-6"
            >
              {columns.map((col, c) => (
                <motion.div
                  key={c}
                  style={{ y: drift[c] }}
                  className="flex w-[22vw] min-w-[200px] flex-col gap-4 md:gap-6"
                >
                  {col.map((photo, i) => (
                    <div
                      key={`${c}-${i}`}
                      className="h-[200px] w-full flex-shrink-0 overflow-hidden bg-muted sm:h-[300px] md:h-[400px]"
                    >
                      <img
                        src={photo.src}
                        alt={i < col.length / 2 ? photo.alt : ''}
                        aria-hidden={i < col.length / 2 ? undefined : true}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        style={{ objectPosition: photo.pos }}
                        className="h-full w-full object-cover"
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
