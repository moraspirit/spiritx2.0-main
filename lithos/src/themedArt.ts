import type { CSSProperties } from 'react';

/** Background art with a night version (dark mode) and a daytime twin (light mode). */
export type ThemedArt = { dark: string; light: string };

/** Inline custom properties consumed by the `.themed-art` class in index.css. */
export function themedArtStyle({ dark, light }: ThemedArt): CSSProperties {
  return { '--art-dark': `url('${dark}')`, '--art-light': `url('${light}')` } as CSSProperties;
}
