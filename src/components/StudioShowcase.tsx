import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { useInView } from 'motion/react';
import { cn } from '@/lib/utils';
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

/** Stories chapter opener: the big word rises and the headline writes itself in once on screen. */
export default function StudioShowcase() {
  const pageRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  useSpotlight(layerRef);
  const inView = useInView(pageRef, { once: true, amount: 0.35 });

  return (
    <div ref={pageRef} className={cn('studio-page', inView && 'in-view')}>
      <section className="hero" aria-labelledby="stories-title">
        <div className="hero-big-text creator-text-animate" aria-hidden="true">
          <p>stories</p>
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
            <h2 id="stories-title" className="hero-headline">
              {HEADLINE.split(' ').map((word, i) => (
                <span
                  className="word-reveal"
                  style={{ animationDelay: `${0.35 + i * 0.04}s` }}
                  key={`${word}-${i}`}
                >
                  {word}
                </span>
              ))}
            </h2>
            <a href="#moments" className="cta-btn cta-animate">
              <span className="cta-btn-bg" />
              <span className="cta-btn-text">relive spirit x 1.0</span>
              <span className="cta-btn-circle">
                <ArrowDown size={20} strokeWidth={2} />
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
