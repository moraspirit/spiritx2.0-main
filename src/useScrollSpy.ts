import { useEffect, useState } from 'react';

/**
 * Which of `ids` the reader is in: the last one whose top has passed a line
 * `line` (fraction of the viewport) from the top. A handful of rect reads per
 * scroll event is cheap, and setState bails out while the answer is unchanged,
 * so no observers to keep in sync with pinned sections of any height.
 * `ids` must be a stable (module-level) array.
 */
export function useScrollSpy(ids: readonly string[], enabled = true, line = 0.4): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }

    const measure = () => {
      const y = window.innerHeight * line;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= y) current = id;
      }
      setActive(current);
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [ids, enabled, line]);

  return active;
}
