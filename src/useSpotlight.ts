import { type RefObject, useEffect } from 'react';

const OFFSCREEN = -9999;

/**
 * Positions the `.spotlight-reveal` mask on `ref` through --spot-x / --spot-y
 * (plain CSS custom properties — no canvas, no React re-renders).
 * - Mouse / pen: the spotlight eases after the pointer and idles once it settles.
 * - Touch (no hover): it drifts slowly across the art so phones still get the
 *   reveal, pausing while off screen.
 * - Touch + reduced motion: no drift; only the base art shows.
 */
export function useSpotlight(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer && reduceMotion) return;

    const pos = { x: OFFSCREEN, y: OFFSCREEN };
    const target = { x: OFFSCREEN, y: OFFSCREEN };
    const size = { w: el.clientWidth, h: el.clientHeight };
    let raf = 0;

    const paint = () => {
      el.style.setProperty('--spot-x', `${pos.x.toFixed(1)}px`);
      el.style.setProperty('--spot-y', `${pos.y.toFixed(1)}px`);
    };

    const resize = new ResizeObserver(() => {
      size.w = el.clientWidth;
      size.h = el.clientHeight;
    });
    resize.observe(el);

    if (finePointer) {
      const follow = () => {
        pos.x += (target.x - pos.x) * 0.1;
        pos.y += (target.y - pos.y) * 0.1;
        paint();
        const settled = Math.abs(target.x - pos.x) < 0.5 && Math.abs(target.y - pos.y) < 0.5;
        raf = settled ? 0 : requestAnimationFrame(follow);
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return;
        const rect = el.getBoundingClientRect();
        target.x = e.clientX - rect.left;
        target.y = e.clientY - rect.top;
        // Appear under the cursor instead of sweeping in from off screen.
        if (pos.x === OFFSCREEN) {
          pos.x = target.x;
          pos.y = target.y;
        }
        if (!raf) raf = requestAnimationFrame(follow);
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      return () => {
        window.removeEventListener('pointermove', onMove);
        cancelAnimationFrame(raf);
        resize.disconnect();
      };
    }

    const start = performance.now();
    const drift = (now: number) => {
      const t = (now - start) / 1000;
      pos.x = size.w * (0.5 + 0.26 * Math.sin(t * 0.5));
      pos.y = size.h * (0.55 + 0.14 * Math.sin(t * 0.83));
      paint();
      raf = requestAnimationFrame(drift);
    };

    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      raf = entry.isIntersecting ? requestAnimationFrame(drift) : 0;
    });
    visibility.observe(el);

    return () => {
      visibility.disconnect();
      cancelAnimationFrame(raf);
      resize.disconnect();
    };
  }, [ref]);
}
