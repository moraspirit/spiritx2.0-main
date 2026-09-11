import { useRef } from 'react';
import SiteNav from './SiteNav.tsx';
import { scrollToId } from '../scrollTo.ts';
import { type ThemedArt, themedArtStyle } from '../themedArt.ts';
import { useSpotlight } from '../useSpotlight.ts';

const BASE_ART: ThemedArt = {
  dark: '/media/experience-sprinter.webp',
  light: '/media/experience-sprinter-light.webp',
};

const REVEAL_ART: ThemedArt = {
  dark: '/media/experience-sprinter-reveal.webp',
  light: '/media/experience-sprinter-reveal-light.webp',
};

export default function HeroSection() {
  const revealRef = useRef<HTMLDivElement>(null);
  useSpotlight(revealRef);

  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-background"
    >
      <div
        className="hero-zoom themed-art absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
        style={themedArtStyle(BASE_ART)}
      />

      <div
        ref={revealRef}
        className="themed-art spotlight-reveal pointer-events-none absolute inset-0 z-30 bg-cover bg-center bg-no-repeat"
        style={themedArtStyle(REVEAL_ART)}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-56 bg-gradient-to-b from-transparent to-background" />

      <div className="pointer-events-none absolute inset-x-0 top-[18%] z-50 flex flex-col items-center px-5 text-center sm:top-[16%]">
        <p className="eyebrow hero-anim hero-fade" style={{ animationDelay: '0.1s' }}>
          the spirit x experience
        </p>
        <h1 className="hero-title mt-4 text-foreground">
          <span
            className="hero-anim hero-reveal block text-5xl font-light sm:text-7xl md:text-8xl"
            style={{ animationDelay: '0.25s' }}
          >
            create unforgettable
          </span>
          <span
            className="hero-anim hero-reveal block text-5xl font-semibold text-brand-ink sm:text-7xl md:text-8xl"
            style={{ animationDelay: '0.42s' }}
          >
            experiences
          </span>
        </h1>
      </div>

      <div
        className="hero-anim hero-fade absolute bottom-14 left-10 z-50 hidden max-w-[260px] sm:block md:left-14"
        style={{ animationDelay: '0.7s' }}
      >
        <p className="text-legible text-sm leading-relaxed text-foreground/85">
          Experience results-driven student innovation anytime, anywhere with Spirit X &mdash; Sri
          Lanka&rsquo;s flagship inter-university hackathon.
        </p>
      </div>

      <div
        className="hero-anim hero-fade absolute bottom-10 left-5 right-5 z-50 flex max-w-full flex-col items-start gap-4 sm:bottom-24 sm:left-auto sm:right-10 sm:max-w-[260px] sm:gap-5 md:right-14"
        style={{ animationDelay: '0.85s' }}
      >
        <p className="text-legible text-xs leading-relaxed text-foreground/85 sm:text-sm">
          48 hours. 200+ hackers. 20+ universities. Built by students, open to every undergraduate
          in Sri Lanka.
        </p>
        <button
          type="button"
          onClick={() => scrollToId('nl-email', { focus: true })}
          className="rounded-full bg-brand px-7 py-3 text-sm font-medium text-primary-foreground transition-[box-shadow,transform] hover:shadow-brand active:scale-95"
        >
          register now
        </button>
      </div>

      <SiteNav />
    </section>
  );
}
