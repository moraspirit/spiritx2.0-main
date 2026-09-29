import * as React from 'react';
import { useInView } from 'motion/react';
import { cn } from '@/lib/utils';

export interface GalleryItem {
  common: string;
  binomial: string;
  photo: {
    url: string;
    text: string;
    pos?: string;
    by: string;
  };
}

interface CircularGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Distance of cards from the carousel centre (px). */
  radius?: number;
  /** Auto-spin (degrees per frame) when the visitor is not scrubbing. */
  autoRotateSpeed?: number;
  /** Degrees the carousel turns across the full scroll track. Lower = calmer scrubbing. */
  scrollDegrees?: number;
  /**
   * Tall scroll track that drives rotation. When set, progress is measured
   * against this element instead of the whole document — correct for a mid-page gallery.
   */
  scrollTrackRef?: React.RefObject<HTMLElement | null>;
}

/** Fraction of the remaining distance covered per frame: scroll input glides instead of snapping. */
const FOLLOW = 0.075;
/** Auto-spin resumes this long after the last scroll event. */
const IDLE_MS = 400;

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    {
      items,
      className,
      radius = 560,
      autoRotateSpeed = 0.025,
      scrollDegrees = 360,
      scrollTrackRef,
      ...props
    },
    ref
  ) => {
    const [rotation, setRotation] = React.useState(0);
    const [activeRadius, setActiveRadius] = React.useState(radius);
    const [card, setCard] = React.useState({ w: 280, h: 360 });
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    // The loop re-renders every card each frame, so it only runs while on screen.
    const onScreen = useInView(rootRef);

    // Rotation = eased scroll angle + accumulated auto-spin, so neither resets the other.
    const scrollTarget = React.useRef(0);
    const eased = React.useRef<number | null>(null);
    const autoOffset = React.useRef(0);
    const lastScroll = React.useRef(0);

    React.useEffect(() => {
      const syncSize = () => {
        const w = window.innerWidth;
        if (w < 480) {
          setActiveRadius(Math.min(radius, 280));
          setCard({ w: 180, h: 240 });
        } else if (w < 768) {
          setActiveRadius(Math.min(radius, 380));
          setCard({ w: 220, h: 290 });
        } else if (w < 1100) {
          setActiveRadius(Math.min(radius, 480));
          setCard({ w: 250, h: 330 });
        } else {
          setActiveRadius(radius);
          setCard({ w: 280, h: 360 });
        }
      };
      syncSize();
      window.addEventListener('resize', syncSize);
      return () => window.removeEventListener('resize', syncSize);
    }, [radius]);

    React.useEffect(() => {
      const handleScroll = () => {
        const track = scrollTrackRef?.current;
        let progress: number;
        if (track) {
          const rect = track.getBoundingClientRect();
          const travel = Math.max(1, track.offsetHeight - window.innerHeight);
          progress = Math.min(1, Math.max(0, -rect.top / travel));
        } else {
          const scrollable = document.documentElement.scrollHeight - window.innerHeight;
          progress = scrollable > 0 ? window.scrollY / scrollable : 0;
        }
        scrollTarget.current = progress * scrollDegrees;
        lastScroll.current = performance.now();
        // First reading: start in place rather than spinning in from 0.
        if (eased.current === null) {
          eased.current = scrollTarget.current;
          setRotation(eased.current);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollTrackRef, scrollDegrees]);

    React.useEffect(() => {
      if (!onScreen) return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let frame = 0;

      const tick = (now: number) => {
        const current = eased.current ?? scrollTarget.current;
        // Reduced motion: follow the scroll exactly, no easing and no auto-spin.
        eased.current = reduceMotion ? scrollTarget.current : current + (scrollTarget.current - current) * FOLLOW;
        if (!reduceMotion && now - lastScroll.current > IDLE_MS) autoOffset.current += autoRotateSpeed;
        setRotation(eased.current + autoOffset.current);
        frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }, [onScreen, autoRotateSpeed]);

    const anglePerItem = 360 / items.length;

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        role="region"
        aria-label="Spirit X circular gallery"
        className={cn('relative flex h-full w-full items-center justify-center', className)}
        style={{ perspective: '1800px' }}
        {...props}
      >
        <div
          className="relative h-full w-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = ((rotation % 360) + 360) % 360;
            const relativeAngle = (itemAngle + totalRotation) % 360;
            const normalizedAngle = Math.abs(
              relativeAngle > 180 ? 360 - relativeAngle : relativeAngle
            );
            const opacity = Math.max(0.28, 1 - normalizedAngle / 180);

            return (
              <div
                key={item.photo.url}
                role="group"
                aria-label={item.common}
                className="absolute"
                style={{
                  width: card.w,
                  height: card.h,
                  transform: `rotateY(${itemAngle}deg) translateZ(${activeRadius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: -card.w / 2,
                  marginTop: -card.h / 2,
                  opacity,
                  transition: 'opacity 0.3s linear',
                }}
              >
                <div className="gallery-card relative h-full w-full overflow-hidden border border-border/70 bg-card/70 backdrop-blur-md">
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3.5 text-white sm:p-4">
                    <h3 className="text-base font-medium tracking-tight sm:text-lg">{item.common}</h3>
                    <p className="mt-0.5 text-xs text-white/75 sm:text-sm">{item.binomial}</p>
                    <p className="mt-1.5 text-[10px] text-white/55">Photo by {item.photo.by}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
