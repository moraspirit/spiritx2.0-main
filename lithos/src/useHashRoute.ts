import { useEffect, useState } from 'react';

/** Routes this app knows about. Anything else falls back to "/". */
const ROUTES = ['/', '/tracks', '/experience', '/studio'] as const;
export type Route = (typeof ROUTES)[number];

function normalize(hash: string): Route {
  const path = hash.replace(/^#/, '');
  return (ROUTES as readonly string[]).includes(path) ? (path as Route) : '/';
}

/**
 * Minimal hash router — two pages don't justify a routing dependency.
 * In-page anchors are written as "#/..." so they never collide with this.
 */
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => normalize(window.location.hash));

  useEffect(() => {
    const onHashChange = () => {
      setRoute(normalize(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}
