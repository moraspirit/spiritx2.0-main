import { useEffect, useRef, useState } from 'react';

/** Real pages. Everything else is a section of the single-page home. */
export type Route = '/' | '/register';

/** Home sections, in page order. The nav, scroll-spy and footer all key off these ids. */
export const SECTIONS = ['about', 'tracks', 'timeline', 'prizes', 'experience', 'stories', 'partners', 'register', 'faq', 'contact'] as const;
export type SectionId = (typeof SECTIONS)[number];

/** Pre-single-page links ("#/tracks") still land on the matching section. */
const LEGACY: Record<string, SectionId> = {
  '/tracks': 'tracks',
  '/experience': 'experience',
  '/studio': 'stories',
};

const TOP = '__top__';

function read(): { route: Route; section: string | null; legacy: boolean } {
  const raw = window.location.hash.replace(/^#/, '');
  if (raw === '/register') return { route: '/register', section: null, legacy: false };
  if (LEGACY[raw]) return { route: '/', section: LEGACY[raw], legacy: true };
  // "#tracks" style anchors (no leading slash) are in-page sections on home.
  if (raw && !raw.startsWith('/')) return { route: '/', section: raw, legacy: false };
  return { route: '/', section: null, legacy: false };
}

function jumpTo(target: string) {
  if (target === TOP) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }
  document.getElementById(target)?.scrollIntoView({ behavior: 'instant', block: 'start' });
}

/**
 * Minimal hash router. "#/register" is the only other page; "#section" anchors scroll
 * natively (html has scroll-behavior: smooth). This hook only steps in when the page
 * changes, when a legacy "#/tracks" link arrives, or on a first load deep link — the
 * cases where the browser can't find the target on its own.
 * Call it once (App) and pass the route down.
 */
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => read().route);
  const routeRef = useRef(route);
  const pending = useRef<string | null>(null);

  // First load: rewrite legacy links, then scroll to the deep-linked section once rendered.
  useEffect(() => {
    const { section, legacy } = read();
    if (legacy && section) window.history.replaceState(null, '', `#${section}`);
    if (section) requestAnimationFrame(() => jumpTo(section));
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const next = read();
      if (next.legacy && next.section) window.history.replaceState(null, '', `#${next.section}`);

      if (next.route !== routeRef.current) {
        pending.current = next.section ?? TOP;
        routeRef.current = next.route;
        setRoute(next.route);
        return;
      }

      // Same page: the browser already scrolled to real ids; handle the ones it can't.
      if (next.legacy && next.section) {
        document.getElementById(next.section)?.scrollIntoView({ block: 'start' });
      } else if (!next.section) {
        window.scrollTo({ top: 0 });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // After a page switch renders, land on the requested section (or the top).
  useEffect(() => {
    const target = pending.current;
    pending.current = null;
    if (target) jumpTo(target);
  }, [route]);

  return route;
}
