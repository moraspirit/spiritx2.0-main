import SiteNav from './SiteNav.tsx';

const VIDEO = '/media/home-snowboard.mp4';
const POSTER = '/media/home-snowboard-poster.webp';

const WORD = 'hero-title absolute block font-medium text-foreground text-[14vw] md:text-[13vw]';

export default function ChallengeHero() {
  return (
    <section
      id="hero"
      className="stage-dark relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-background"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        poster={POSTER}
        src={VIDEO}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/70 to-transparent" />

      <SiteNav />

      <div className="relative h-full w-full">
        <h1 className="pointer-events-none absolute inset-0">
          <span className={`${WORD} left-4 top-[18%] md:left-10`}>reinvent</span>
          <span className={`${WORD} right-4 top-[38%] md:right-10`}>the</span>
          <span className={`${WORD} left-[18%] top-[58%] md:left-[28%]`}>
            game<span className="text-volt">.</span>
          </span>
        </h1>

        <div className="absolute left-4 top-[43%] max-w-[256px] rounded-2xl border border-border/60 bg-background/55 p-3 backdrop-blur-md sm:left-6 sm:top-[46%] sm:max-w-[240px] sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none md:left-10">
          <p className="eyebrow mb-3 hidden sm:block">moraspirit · 2026</p>
          <p className="text-legible text-[15px] leading-snug text-foreground/90">
            48 hours to rebuild how sri lanka plays and watches sport, built by students from every
            campus
          </p>
        </div>

        <div className="absolute right-6 top-[14%] md:right-24">
          <div className="flex items-center justify-end gap-3">
            <span className="hidden h-px w-24 rotate-[20deg] bg-volt/60 md:block" />
            <span className="text-4xl font-medium tracking-tight md:text-5xl">
              <span className="text-volt">+</span>200
            </span>
          </div>
          <p className="mt-1 text-right text-legible text-xs text-foreground/80 md:text-sm">hackers building</p>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />

        <div className="absolute bottom-20 left-6 md:bottom-24 md:left-20">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-medium tracking-tight md:text-5xl">
              <span className="text-volt">+</span>5m
            </span>
            <span className="hidden h-px w-24 rotate-[-20deg] bg-volt/60 md:block" />
          </div>
          <p className="mt-1 text-legible text-xs text-foreground/80 md:text-sm">lkr prize pool</p>
        </div>

        <div className="absolute bottom-16 right-6 md:bottom-20 md:right-20">
          <div className="flex items-center justify-end gap-3">
            <span className="hidden h-px w-24 rotate-[-20deg] bg-volt/60 md:block" />
            <span className="text-4xl font-medium tracking-tight md:text-5xl">
              <span className="text-volt">+</span>20
            </span>
          </div>
          <p className="mt-1 text-right text-legible text-xs text-foreground/80 md:text-sm">universities</p>
        </div>
      </div>
    </section>
  );
}
