import { useEffect, useState } from 'react';
import OrganizerLockup from './OrganizerLockup.tsx';
import { scrollToId } from '../scrollTo.ts';

/** Registration opens at midnight Sri Lanka time on 1 Nov 2026. */
export const REGISTRATION_OPENS_AT = new Date('2026-11-01T00:00:00+05:30');

type Remaining = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function computeRemaining(now: number): Remaining {
  const ms = Math.max(0, REGISTRATION_OPENS_AT.getTime() - now);
  if (ms === 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const totalSec = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    done: false,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Coming-soon panel: live countdown to 1 Nov 2026 + MoraSpirit 360 credit.
 * Degrades to a static date under prefers-reduced-motion.
 */
export default function RegisterPanel() {
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [remaining, setRemaining] = useState<Remaining>(() => computeRemaining(Date.now()));

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setRemaining(computeRemaining(Date.now())), 1000);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-8 text-center sm:px-5 sm:py-14">
      <OrganizerLockup forceDark size="md" className="mb-5 flex flex-wrap justify-center gap-x-2 gap-y-1" />

      <p className="eyebrow mb-3">Spirit X 2.0</p>
      <h1 className="hero-title text-[2rem] font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
        registration <span className="text-brand">coming soon</span>
      </h1>
      <p className="mt-4 max-w-md text-legible text-sm leading-relaxed text-foreground/85 sm:text-base">
        Team registration opens 1 November 2026. Leave your email in the footer and we&rsquo;ll ping
        you the moment the portal goes live.
      </p>

      {reduceMotion || remaining.done ? (
        <p className="mt-8 font-mono text-sm tracking-wide text-brand-ink">
          {remaining.done ? 'Registration is opening — refresh shortly.' : 'Opens 1 November 2026'}
        </p>
      ) : (
        <div
          className="mt-8 grid w-full max-w-md grid-cols-4 gap-1.5 sm:gap-3"
          role="timer"
          aria-live="polite"
          aria-label="Countdown to registration opening"
        >
          {(
            [
              ['days', remaining.days],
              ['hours', remaining.hours],
              ['mins', remaining.minutes],
              ['secs', remaining.seconds],
            ] as const
          ).map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-border/70 bg-card/70 px-1.5 py-2.5 backdrop-blur-md sm:rounded-2xl sm:px-3 sm:py-4"
            >
              <div className="font-mono text-xl font-medium tabular-nums text-foreground sm:text-3xl">
                {pad(value)}
              </div>
              <div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground sm:text-[10px] sm:tracking-[0.16em]">
                {label}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 break-all font-mono text-xs tracking-wide text-brand-ink/90">
        spiritx.moraspirit.com
      </p>

      <button
        type="button"
        onClick={() => scrollToId('nl-email', { focus: true })}
        className="mt-8 min-h-11 rounded-full bg-brand px-7 py-3 text-sm font-medium text-primary-foreground transition-[box-shadow,transform] hover:shadow-brand active:scale-95"
      >
        notify me
      </button>
    </div>
  );
}
