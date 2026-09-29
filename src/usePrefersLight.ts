import { useEffect, useState } from 'react';

const QUERY = '(prefers-color-scheme: light)';

/** Live OS light/dark preference, for components that swap elements (not just colours) per theme. */
export function usePrefersLight(): boolean {
  const [light, setLight] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const query = window.matchMedia(QUERY);
    const sync = () => setLight(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return light;
}
