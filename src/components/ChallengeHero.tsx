import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SiteNav from './SiteNav.tsx';
import OrganizerLockup from './OrganizerLockup.tsx';
import HeroDustCanvas from './HeroDustCanvas.tsx';

const LANDSCAPE = {
  src: '/media/home-cosmos.mp4',
  poster: '/media/home-cosmos-poster.webp',
};

const PORTRAIT = {
  src: '/media/home-cosmos-portrait.mp4',
  poster: '/media/home-cosmos-portrait-poster.webp',
};

const LIGHT_LANDSCAPE = '/media/home-cosmos-light.webp';
const LIGHT_PORTRAIT = '/media/home-cosmos-light-portrait.webp';

const STATS = [
  { value: '200+', label: 'hackers' },
  { value: 'LKR 5m', label: 'prize pool' },
  { value: '20+', label: 'universities' },
];

/** The supplied film fades through black at its seam instead of visibly snapping. */
function HeroLoopVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);
  const [cut] = useState(() =>
    window.matchMedia('(max-aspect-ratio: 3/4)').matches ? PORTRAIT : LANDSCAPE
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    for (const attribute of [
      'muted',
      'playsinline',
      'webkit-playsinline',
      'disablepictureinpicture',
      'disableremoteplayback',
    ]) {
      video.setAttribute(attribute, '');
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    if (reduceMotion || saveData) return;

    const fadeTo = (target: number, duration = 500) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      const from = Number.parseFloat(video.style.opacity || '0');
      const started = performance.now();

      const tick = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        video.style.opacity = String(from + (target - from) * progress);
        if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      };

      frameRef.current = requestAnimationFrame(tick);
    };

    const playAndReveal = () => {
      video.play().then(() => fadeTo(1), () => {});
    };

    const onTimeUpdate = () => {
      if (!video.duration || video.duration - video.currentTime > 0.55 || fadingOutRef.current) return;
      fadingOutRef.current = true;
      fadeTo(0);
    };

    const onEnded = () => {
      video.style.opacity = '0';
      timerRef.current = window.setTimeout(() => {
        video.currentTime = 0;
        fadingOutRef.current = false;
        playAndReveal();
      }, 100);
    };

    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
      else playAndReveal();
    };

    video.addEventListener('canplay', playAndReveal, { once: true });
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (video.readyState >= 3) playAndReveal();

    return () => {
      video.removeEventListener('canplay', playAndReveal);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      video.pause();
    };
  }, []);

  return (
    <>
      <img
        src={cut.poster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-bottom"
      />
      <video
        ref={videoRef}
        className="ambient-video absolute inset-0 h-full w-full object-cover object-bottom"
        src={cut.src}
        poster={cut.poster}
        autoPlay
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
        aria-hidden="true"
        style={{ opacity: 0 }}
      />
    </>
  );
}

function LightHeroImage() {
  return (
    <>
      <picture>
        <source media="(max-aspect-ratio: 3/4)" srcSet={LIGHT_PORTRAIT} />
        <img
          src={LIGHT_LANDSCAPE}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-bottom"
        />
      </picture>
      <HeroDustCanvas />
    </>
  );
}

export default function ChallengeHero() {
  const [light, setLight] = useState(() => window.matchMedia('(prefers-color-scheme: light)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: light)');
    const update = () => setLight(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return (
    <section
      id="hero"
      className="adaptive-hero relative flex h-[100svh] min-h-[560px] w-full flex-col overflow-hidden bg-background text-foreground max-sm:landscape:min-h-[430px]"
    >
      {light ? <LightHeroImage /> : <HeroLoopVideo />}
      <div className="hero-theme-scrim pointer-events-none absolute inset-0 z-[1]" />

      <SiteNav />

      <main className="cosmos-hero-content relative z-10 flex flex-1 -translate-y-[5%] flex-col items-center justify-center px-4 pb-24 pt-28 text-center sm:-translate-y-[8%] sm:px-6 sm:pb-28 sm:pt-32">
        <OrganizerLockup
          forceDark={!light}
          size="md"
          className="liquid-glass cosmos-hero-organizer mb-5 rounded-2xl px-4 py-2.5 sm:mb-7 sm:rounded-full sm:px-5"
        />

        <h1 className="hero-display max-w-6xl text-balance text-white">
          Reinvent <em>the game.</em>
        </h1>

        <p className="mt-4 max-w-[34rem] text-pretty text-sm leading-relaxed text-white/82 sm:mt-5 sm:text-base md:text-lg">
          Forty-eight hours to turn audacious ideas into the technology that changes how Sri Lanka
          plays and watches sport.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row">
          <a
            href="#/tracks"
            className="liquid-glass group flex min-h-14 items-center gap-5 rounded-full py-2 pl-6 pr-2 text-sm font-medium text-white transition-colors hover:bg-white/[.07]"
          >
            Explore the tracks
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-black transition-transform group-hover:translate-x-0.5">
              <ArrowRight size={19} aria-hidden="true" />
            </span>
          </a>
          <a
            href="#/studio"
            className="liquid-glass min-h-12 rounded-full px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/[.07]"
          >
            Relive Spirit X 1.0
          </a>
        </div>
      </main>

      <dl className="liquid-glass cosmos-hero-stats absolute inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-10 mx-auto grid max-w-xl grid-cols-3 divide-x divide-white/15 rounded-2xl px-2 py-3 text-center sm:inset-x-6 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-w-2xl sm:rounded-full sm:px-5">
        {STATS.map((stat) => (
          <div key={stat.label} className="min-w-0 px-2 sm:px-5">
            <dt className="font-serif text-lg leading-none text-white sm:text-2xl">{stat.value}</dt>
            <dd className="mt-1 truncate text-[9px] uppercase tracking-[0.12em] text-white/55 sm:text-[10px]">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
