/**
 * Central Configuration for 3D Models and Flyby Image Assets
 *
 * HOW TO USE YOUR OWN IMAGES:
 * 1. Place your transparent image in the /public folder (e.g. /public/shuttle.png)
 * 2. It will automatically be used! If the file is not yet in /public,
 *    it gracefully falls back to /shuttle-fallback.svg.
 *
 * HOW TO USE YOUR OWN 3D GLB MODELS:
 * 1. Place your .glb file in the /public folder (e.g. /public/spiritxlogo4.glb)
 * 2. Set the path in the MODELS object below.
 */

export interface ModelEntry {
  id: string;
  name: string;
  path: string;
  scale?: number;
  description?: string;
}

export const MODELS: Record<string, ModelEntry> = {
  // Existing 3D GLB models in /public
  logo: {
    id: 'logo',
    name: 'Spirit X 3D Emblem',
    path: '/spiritxlogo4.glb',
    scale: 1.0,
    description: 'Interactive Spirit X emblem in Splash and About sections',
  },
  dancer: {
    id: 'dancer',
    name: 'Spirit X Mascot Robot',
    path: '/sambadanceboy.glb',
    scale: 1.0,
    description: 'Animated mascot robot featured in the hero section',
  },
};

export const FLYBY_IMAGES = {
  shuttle: {
    // Put your transparent space shuttle image in /public/shuttle.png (or .webp)
    primary: '/shuttle.avif',
    fallback: '/shuttle-fallback.svg',
    alt: 'MoraSpirit Space Shuttle',
  },
  astronaut: {
    // Put your transparent astronaut image in /public/astronaut.png (or .webp)
    primary: '/astronaut.avif',
    fallback: '/astronaut-fallback.svg',
    alt: 'Zero-G Spacewalk Astronaut',
  },
};
