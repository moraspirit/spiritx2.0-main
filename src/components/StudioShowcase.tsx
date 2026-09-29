import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import SiteNav from './SiteNav.tsx';
import { type ThemedArt, themedArtStyle } from '../themedArt.ts';
import { useSpotlight } from '../useSpotlight.ts';
import './studio.css';

const BASE_ART: ThemedArt = {
  dark: '/media/stories-builder.webp',
  light: '/media/stories-builder-light.webp',
};
const REVEAL_ART: ThemedArt = {
  dark: '/media/stories-builder-reveal.webp',
  light: '/media/stories-builder-reveal-light.webp',
};

const HEADLINE =
  'Every podium moment starts as a prototype — the stories behind 48 hours of student-built sports tech.';

export default function StudioShowcase() {
  const layerRef = useRef<HTMLDivElement>(null);
  useSpotlight(layerRef);

  return (
    <div className="studio-page">
      <div className="splash" aria-hidden="true">
        <div className="splash-row splash-row-top">
          {Array.from({ length: 5 }, (_, i) => (
            <div className="splash-box" key={`t${i}`} />
          ))}
        </div>
        <div className="splash-row splash-row-bottom">
          {Array.from({ length: 5 }, (_, i) => (
            <div className="splash-box" key={`b${i}`} />
          ))}
        </div>
      </div>

      <main className="hero">
        <div className="hero-big-text creator-text-animate" aria-hidden="true">
          <h2>stories</h2>
        </div>

        <div
          className="hero-base-img hero-image-animate themed-art"
          style={themedArtStyle(BASE_ART)}
        />

        <div
          ref={layerRef}
          className="hero-reveal-img themed-art spotlight-reveal"
          style={themedArtStyle(REVEAL_ART)}
        />

        <div className="hero-content">
          <div className="hero-content-inner">
            <div className="flex flex-col gap-3">
              <p className="eyebrow">spirit x · stories</p>
              <h1 className="hero-headline">
                {HEADLINE.split(' ').map((word, i) => (
                  <span
                    className="word-reveal"
                    style={{ animationDelay: `${1 + i * 0.05}s` }}
                    key={`${word}-${i}`}
                  >
                    {word}
                  </span>
                ))}
              </h1>
            </div>
            <a href="#/tracks" className="cta-btn cta-animate">
              <span className="cta-btn-bg" />
              <span className="cta-btn-text">explore the tracks</span>
              <span className="cta-btn-circle">
                <ArrowUpRight size={20} strokeWidth={2} />
              </span>
            </a>
          </div>
        </div>

        <SiteNav />
      </main>
    </div>
  );
}
