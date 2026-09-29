import { useRef } from 'react';
import { CircularGallery, type GalleryItem } from './ui/circular-gallery.tsx';

const ALBUM =
  'https://www.facebook.com/media/set/?set=a.667363979422825&type=3';

const CREDIT = 'Vidumini Gallage';

/** Spirit X 1.0 stills driving the circular gallery. */
const GALLERY: GalleryItem[] = [
  {
    common: 'The room',
    binomial: 'Spirit X 1.0 · finals',
    photo: {
      url: '/media/gallery/02.webp',
      text: 'Full room celebration with grand champions and participants',
      pos: '50% 40%',
      by: CREDIT,
    },
  },
  {
    common: 'Solve · Innovate · Conquer',
    binomial: 'Opening stage',
    photo: {
      url: '/media/gallery/03.webp',
      text: 'Keynote on the Spirit X stage',
      pos: '55% 35%',
      by: CREDIT,
    },
  },
  {
    common: 'In the build',
    binomial: '48-hour desks',
    photo: {
      url: '/media/gallery/07.webp',
      text: 'Teams locked in at their laptops',
      pos: '45% 40%',
      by: CREDIT,
    },
  },
  {
    common: 'On the mic',
    binomial: 'Team demo',
    photo: {
      url: '/media/gallery/04.webp',
      text: 'A team presenting with the microphone',
      pos: '50% 30%',
      by: CREDIT,
    },
  },
  {
    common: 'Everyone builds',
    binomial: 'Inclusive demo',
    photo: {
      url: '/media/gallery/08.webp',
      text: 'Student presenting from a wheelchair with teammates',
      pos: '48% 35%',
      by: CREDIT,
    },
  },
  {
    common: 'Open for Q&A',
    binomial: 'Pitch close',
    photo: {
      url: '/media/gallery/06.webp',
      text: 'Team in Spirit X polos after their thank-you slide',
      pos: '50% 35%',
      by: CREDIT,
    },
  },
  {
    common: 'Stage control',
    binomial: 'Live floor',
    photo: {
      url: '/media/gallery/11.webp',
      text: 'Host on mic during Spirit X',
      pos: '50% 25%',
      by: CREDIT,
    },
  },
  {
    common: 'Grand champions',
    binomial: 'LKR 80,000',
    photo: {
      url: '/media/gallery/01.webp',
      text: 'Grand champions holding the Spirit X prize cheque',
      pos: '50% 35%',
      by: CREDIT,
    },
  },
  {
    common: 'First runner-up',
    binomial: 'LKR 50,000',
    photo: {
      url: '/media/gallery/09.webp',
      text: 'First runner-up team with their cheque',
      pos: '50% 35%',
      by: CREDIT,
    },
  },
  {
    common: 'Most popular idea',
    binomial: 'Crowd favourite',
    photo: {
      url: '/media/gallery/05.webp',
      text: 'Most Popular Idea winners with certificates',
      pos: '50% 40%',
      by: CREDIT,
    },
  },
  {
    common: 'The crew',
    binomial: 'Organizing team',
    photo: {
      url: '/media/gallery/10.webp',
      text: 'Spirit X organizing team in purple polos',
      pos: '50% 35%',
      by: CREDIT,
    },
  },
];

export default function SpiritGallery() {
  const trackRef = useRef<HTMLElement>(null);

  return (
    <section
      id="moments"
      ref={trackRef}
      aria-labelledby="moments-heading"
      className="gallery-section relative bg-background text-foreground"
      style={{ height: '320vh' }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div
          aria-hidden
          className="gallery-aurora pointer-events-none absolute inset-0"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6 sm:pt-8 md:px-10">
          <p className="font-mono text-[11px] tracking-[0.18em] text-brand-ink/90 uppercase">
            spirit x 1.0
          </p>
          <h2
            id="moments-heading"
            className="hero-title mt-2 text-center text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            moments that built the stage
          </h2>
          <p className="mt-2 max-w-md text-center text-[14px] leading-snug text-foreground/70 sm:text-[15px]">
            Scroll to rotate · relive the first Spirit X
          </p>
          <a
            href={ALBUM}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-brand-ink transition-colors hover:text-foreground"
          >
            full album on facebook
            <span aria-hidden className="text-brand">
              →
            </span>
          </a>
        </div>

        <div className="relative z-0 min-h-0 w-full flex-1">
          <CircularGallery items={GALLERY} radius={560} scrollTrackRef={trackRef} />
        </div>

        <p className="relative z-10 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[10px] text-foreground/40 sm:text-[11px]">
          Photographs by Vidumini Gallage · MoraSpirit 360
        </p>
      </div>
    </section>
  );
}
