import SiteNav from './SiteNav.tsx';
import AmbientVideo from './AmbientVideo.tsx';
import OrganizerLockup from './OrganizerLockup.tsx';

const LANDSCAPE = { src: '/media/home-snowboard.mp4', poster: '/media/home-snowboard-poster.webp' };
// Centre 3:4 crop: upright phones and tablets only ever show the middle of the frame,
// so they download about half the bytes for the same picture.
const PORTRAIT = {
  src: '/media/home-snowboard-portrait.mp4',
  poster: '/media/home-snowboard-portrait-poster.webp',
};

const WORD = 'hero-title absolute block font-medium text-foreground text-[12.5vw] sm:text-[14vw] md:text-[13vw]';

export default function ChallengeHero() {
  return (
    <section
      id="hero"
      className="stage-dark relative flex h-[100svh] min-h-[560px] w-full flex-col overflow-hidden bg-background max-[360px]:min-h-[500px]"
    >
      <AmbientVideo
        className="ambient-drift absolute inset-0 h-full w-full object-cover"
        cut={LANDSCAPE}
        portrait={PORTRAIT}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-background/80 to-transparent sm:h-40" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-56 bg-gradient-to-b from-transparent via-background/40 to-background sm:h-48" />

      <SiteNav />

      {/* Scattered wordmark — desktop / tablet composition */}
      <h1 className="pointer-events-none absolute inset-0 z-[2] hidden sm:block">
        <span className={`${WORD} left-4 top-[18%] md:left-10`}>reinvent</span>
        <span className={`${WORD} right-4 top-[38%] md:right-10`}>the</span>
        <span className={`${WORD} left-[18%] top-[58%] md:left-[28%]`}>
          game<span className="text-brand">.</span>
        </span>
      </h1>

      {/* Phone wordmark — single stacked block, clears nav */}
      <h1 className="pointer-events-none relative z-[2] mt-[max(5.5rem,calc(env(safe-area-inset-top)+4.75rem))] px-4 sm:hidden">
        <span className="hero-title text-legible block text-[11vw] font-medium leading-[0.95] tracking-tight text-foreground">
          reinvent
        </span>
        <span className="hero-title text-legible block text-[11vw] font-medium leading-[0.95] tracking-tight text-foreground">
          the
        </span>
        <span className="hero-title text-legible block text-[11vw] font-medium leading-[0.95] tracking-tight text-foreground">
          game<span className="text-brand">.</span>
        </span>
      </h1>

      {/* Desktop floating copy */}
      <div className="absolute left-6 top-[44%] z-[3] hidden max-w-[260px] sm:block md:left-10">
        <OrganizerLockup forceDark className="mb-3" />
        <p className="text-legible text-[15px] leading-snug text-foreground/90">
          Spirit X 2.0 — 48 hours to rebuild how sri lanka plays and watches sport, built by
          students from every campus
        </p>
        <p className="mt-3 font-mono text-xs tracking-wide text-brand-ink/90">
          spiritx.moraspirit.com
        </p>
      </div>

      {/* Desktop stats */}
      <div className="absolute right-6 top-[14%] z-[3] hidden sm:block md:right-24">
        <div className="flex items-center justify-end gap-3">
          <span className="hidden h-px w-24 rotate-[20deg] bg-brand/60 md:block" />
          <span className="text-4xl font-medium tracking-tight md:text-5xl">
            <span className="text-brand">+</span>200
          </span>
        </div>
        <p className="mt-1 text-right text-legible text-xs text-foreground/80 md:text-sm">
          hackers building
        </p>
      </div>

      <div className="absolute bottom-24 left-6 z-[3] hidden sm:block md:bottom-24 md:left-20">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-medium tracking-tight md:text-5xl">
            <span className="text-brand">+</span>5m
          </span>
          <span className="hidden h-px w-24 rotate-[-20deg] bg-brand/60 md:block" />
        </div>
        <p className="mt-1 text-legible text-xs text-foreground/80 md:text-sm">lkr prize pool</p>
      </div>

      <div className="absolute bottom-20 right-6 z-[3] hidden sm:block md:bottom-20 md:right-20">
        <div className="flex items-center justify-end gap-3">
          <span className="hidden h-px w-24 rotate-[-20deg] bg-brand/60 md:block" />
          <span className="text-4xl font-medium tracking-tight md:text-5xl">
            <span className="text-brand">+</span>20
          </span>
        </div>
        <p className="mt-1 text-right text-legible text-xs text-foreground/80 md:text-sm">
          universities
        </p>
      </div>

      {/* Phone bottom sheet: organizer, copy, domain, stats — one composition */}
      <div className="relative z-[3] mt-auto w-full px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
        <div className="rounded-2xl border border-border/60 bg-background/70 p-3.5 backdrop-blur-md">
          <OrganizerLockup forceDark className="mb-2.5 flex flex-wrap gap-x-2 gap-y-1" />
          <p className="text-legible text-[13.5px] leading-snug text-foreground/90">
            Spirit X 2.0 — 48 hours to rebuild how sri lanka plays and watches sport, built by
            students from every campus
          </p>
          <p className="mt-2 font-mono text-[10px] tracking-wide text-brand-ink/90">
            spiritx.moraspirit.com
          </p>
          <div className="mt-3.5 grid grid-cols-3 gap-2 border-t border-border/50 pt-3">
            <div>
              <p className="text-xl font-medium tracking-tight">
                <span className="text-brand">+</span>200
              </p>
              <p className="text-[10px] leading-tight text-foreground/75">hackers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-medium tracking-tight">
                <span className="text-brand">+</span>5m
              </p>
              <p className="text-[10px] leading-tight text-foreground/75">lkr prize</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-medium tracking-tight">
                <span className="text-brand">+</span>20
              </p>
              <p className="text-[10px] leading-tight text-foreground/75">unis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
