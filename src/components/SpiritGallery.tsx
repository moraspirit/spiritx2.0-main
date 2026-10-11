import { ParallaxUnfurlingGallery, type ParallaxPhoto } from './ui/3d-parallax-unfurling-gallery.tsx';

const ALBUM =
  'https://www.facebook.com/media/set/?set=a.667363979422825&type=3';

const CREDIT = 'Vidumini Gallage';

/** Spirit X 1.0 stills for the parallax wall. */
const PHOTOS: ParallaxPhoto[] = [
  { src: '/media/gallery/02.webp', alt: 'Full room celebration with grand champions and participants', pos: '50% 40%' },
  { src: '/media/gallery/03.webp', alt: 'Keynote on the Spirit X stage', pos: '55% 35%' },
  { src: '/media/gallery/07.webp', alt: 'Teams locked in at their laptops', pos: '45% 40%' },
  { src: '/media/gallery/04.webp', alt: 'A team presenting with the microphone', pos: '50% 30%' },
  { src: '/media/gallery/08.webp', alt: 'Student presenting from a wheelchair with teammates', pos: '48% 35%' },
  { src: '/media/gallery/06.webp', alt: 'Team in Spirit X polos after their thank-you slide', pos: '50% 35%' },
  { src: '/media/gallery/01.webp', alt: 'Grand champions holding the Spirit X prize cheque', pos: '50% 35%' },
  { src: '/media/gallery/09.webp', alt: 'First runner-up team with their cheque', pos: '50% 35%' },
  { src: '/media/gallery/05.webp', alt: 'Most Popular Idea winners with certificates', pos: '50% 40%' },
  { src: '/media/gallery/10.webp', alt: 'Spirit X organizing team in purple polos', pos: '50% 35%' },
];

export default function SpiritGallery() {
  return (
    <section
      id="moments"
      aria-labelledby="moments-heading"
      className="gallery-section section-glow bg-background text-foreground"
    >
      <ParallaxUnfurlingGallery
        photos={PHOTOS}
        intro={
          <div className="flex max-w-3xl flex-col items-center">
            <p className="eyebrow">spirit x 1.0</p>
            <h2
              id="moments-heading"
              className="hero-title mt-3 text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl"
            >
              moments that built the stage
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-snug text-foreground/75">
              Scroll to unfurl · relive the first Spirit X
            </p>
          </div>
        }
        footer={
          <>
            <a
              href={ALBUM}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex min-h-10 items-center gap-2 rounded-full bg-background/80 px-4 text-sm font-medium text-brand-ink backdrop-blur transition-colors hover:text-foreground"
            >
              full album on facebook
              <span aria-hidden className="text-brand">
                &rarr;
              </span>
            </a>
            <p className="text-[11px] text-foreground/60">Photographs by {CREDIT} &middot; MoraSpirit 360</p>
          </>
        }
      />
    </section>
  );
}
