import { useMemo, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { cn } from '@/lib/utils';
import AmbientVideo from './AmbientVideo.tsx';
import { usePrefersLight } from '../usePrefersLight.ts';
import { EASE_OUT, lift, revealOnce, rise, stagger } from '../motion.ts';

type Milestone = {
  id: string;
  /** Big display label: "1 Nov", or "TBA" until the date is confirmed. */
  when: string;
  /** ISO start in Sri Lanka time. Drives the "you are here" marker; leave out while TBA. */
  date?: string;
  title: string;
  body: string;
};

/** Spirit X 2.0 road map. Fill in `when` + `date` as dates are confirmed; the layout adapts. */
const MILESTONES: Milestone[] = [
  {
    id: 'registration',
    when: '1 Nov',
    date: '2026-11-01T00:00:00+05:30',
    title: 'Registration opens',
    body: 'Form a team of two to four undergraduates and claim your place on the Spirit X stage.',
  },
  {
    id: 'proposals',
    when: 'TBA',
    title: 'Proposal submission',
    body: 'Pitch your idea in one PDF: the problem, your solution, and why your team is the one to build it.',
  },
  {
    id: 'mentoring',
    when: 'TBA',
    title: 'Workshops & mentoring',
    body: 'Shortlisted teams sharpen their ideas with mentors from technology and sport.',
  },
  {
    id: 'semis',
    when: 'TBA',
    title: 'Semi-finals',
    body: 'Present to the judging panel for a place in the final 48 hours.',
  },
  {
    id: 'finale',
    when: 'TBA',
    title: '48-hour grand finale',
    body: 'Build through the night at the University of Moratuwa, then demo on the main stage.',
  },
];

const N = MILESTONES.length;
/** Scroll share held on the first and last milestone so neither flashes past. */
const HOLD = 0.07;
/** Pinned length: one viewport to settle, then ~0.85 of a viewport per milestone. */
const HEIGHT = `${100 + N * 85}svh`;

const STADIUM = { src: '/media/home-stadium.mp4', poster: '/media/home-stadium-poster.webp' };

const pad = (n: number) => String(n).padStart(2, '0');

type Here = { index: number; label: string };

/** The milestone we're in (latest one already started), or the first one as "up next". */
function whereWeAre(now: number): Here {
  let current = -1;
  MILESTONES.forEach((m, i) => {
    if (m.date && Date.parse(m.date) <= now) current = i;
  });
  return current >= 0 ? { index: current, label: 'you are here' } : { index: 0, label: 'up next' };
}

function Title() {
  return (
    <h2
      id="timeline-title"
      className="text-balance text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl [@media(max-height:520px)]:hidden"
    >
      the road to the <em className="font-serif font-normal text-brand-ink">finale.</em>
    </h2>
  );
}

function HereChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-2.5 py-1 text-xs font-medium text-brand-ink">
      <span aria-hidden="true" className="timeline-here-dot size-1.5 rounded-full bg-brand-ink" />
      {label}
    </span>
  );
}

function MilestoneBody({ m, i, here }: { m: Milestone; i: number; here: Here }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="tabular-nums text-brand-ink">{pad(i + 1)}</span>
        <span aria-hidden="true" className="h-px w-8 bg-foreground/20" />
        <span className="tabular-nums text-muted-foreground">{pad(N)}</span>
        {here.index === i ? <HereChip label={here.label} /> : null}
      </div>
      <p className={cn('timeline-when mt-5', !m.date && 'is-tba')}>
        {m.date ? m.when : <span aria-label="Date to be announced">{m.when}</span>}
      </p>
      <h3 className="mt-3 text-balance text-2xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl">
        {m.title}
      </h3>
      <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
        {m.body}
      </p>
    </>
  );
}

function Panel({ m, i, pos, active, here }: { m: Milestone; i: number; pos: MotionValue<number>; active: boolean; here: Here }) {
  // Focus falls off with distance from the current milestone.
  const distance = useTransform(pos, (v) => Math.min(1, Math.abs(v - i)));
  const opacity = useTransform(distance, [0, 1], [1, 0.2]);
  const scale = useTransform(distance, [0, 1], [1, 0.9]);

  return (
    <li className="w-[var(--panel)] shrink-0 pr-10 sm:pr-16" aria-current={active ? 'step' : undefined}>
      <motion.div style={{ opacity, scale }} className="origin-left">
        <MilestoneBody m={m} i={i} here={here} />
      </motion.div>
    </li>
  );
}

function Rail({
  progress,
  active,
  here,
  onJump,
}: {
  progress: MotionValue<number>;
  active: number;
  here: Here;
  onJump: (i: number) => void;
}) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-12 sm:pb-12">
      <div className="relative h-11">
        <span aria-hidden="true" className="absolute inset-x-0 top-1/2 -mt-px h-px bg-foreground/15" />
        <motion.span
          aria-hidden="true"
          className="timeline-rail-fill absolute inset-x-0 top-1/2 -mt-px h-0.5 origin-left rounded-full bg-brand-ink"
          style={{ scaleX: progress }}
        />
        {MILESTONES.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onJump(i)}
            aria-label={`Go to ${m.title} (${m.date ? m.when : 'date to be announced'})`}
            className="absolute top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
            style={{ left: `${(i / (N - 1)) * 100}%` }}
          >
            {here.index === i ? (
              <span aria-hidden="true" className="timeline-here-ring absolute size-7 rounded-full border border-brand-ink/70" />
            ) : null}
            <span
              aria-hidden="true"
              className={cn(
                'relative size-3 rounded-full border-2 transition-[background-color,border-color,transform] duration-500',
                i <= active ? 'border-brand-ink bg-brand-ink' : 'border-foreground/35 bg-background',
                i === active && 'scale-125'
              )}
            />
          </button>
        ))}
      </div>
      <div aria-hidden="true" className="relative hidden h-5 md:block">
        {MILESTONES.map((m, i) => (
          <span
            key={m.id}
            className={cn(
              'absolute top-0 whitespace-nowrap text-xs transition-colors duration-300',
              i === 0 ? '' : i === N - 1 ? '-translate-x-full' : '-translate-x-1/2',
              i === active ? 'text-foreground' : 'text-muted-foreground'
            )}
            style={{ left: `${(i / (N - 1)) * 100}%` }}
          >
            {m.title}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * hackx-style pinned stage: the milestone strip pans sideways as you scroll,
 * a rail fills underneath, and a ghost numeral tracks the current step.
 */
function PinnedTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const light = usePrefersLight();
  const here = useMemo(() => whereWeAre(Date.now()), []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 170, damping: 34, restDelta: 0.0005 });
  const pos = useTransform(smooth, [HOLD, 1 - HOLD], [0, N - 1]);
  const railProgress = useTransform(pos, [0, N - 1], [0, 1]);
  const x = useTransform(pos, (v) => `calc(var(--panel) * ${-v})`);

  const [active, setActive] = useState(0);
  useMotionValueEvent(pos, 'change', (v) => setActive(Math.round(v)));

  const jump = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const p = HOLD + (i / (N - 1)) * (1 - 2 * HOLD);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + p * travel });
  };

  return (
    <section
      id="timeline"
      ref={sectionRef}
      aria-labelledby="timeline-title"
      className="relative isolate bg-background [--panel:84vw] sm:[--panel:62vw] lg:[--panel:44vw]"
      style={{ height: HEIGHT }}
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {light ? null : (
          <AmbientVideo className="absolute inset-0 h-full w-full object-cover opacity-30" cut={STADIUM} lazy />
        )}
        <div aria-hidden="true" className="timeline-scrim pointer-events-none absolute inset-0" />

        <div aria-hidden="true" className="timeline-ghost pointer-events-none absolute bottom-0 right-0 z-0 select-none">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={active}
              className="block"
              initial={{ opacity: 0, y: '14%' }}
              animate={{ opacity: 1, y: '0%' }}
              exit={{ opacity: 0, y: '-14%' }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              {pad(active + 1)}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.div
          {...revealOnce}
          variants={stagger(0.1)}
          className="relative z-10 mx-auto flex w-full max-w-7xl items-end justify-between gap-6 px-5 pt-[max(6rem,calc(env(safe-area-inset-top)+5rem))] sm:px-8 sm:pt-28"
        >
          <motion.div variants={rise}>
            <Title />
          </motion.div>
          <motion.a
            variants={rise}
            href="#experience"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            skip<span className="hidden sm:inline"> timeline</span>
            <ArrowDown size={16} />
          </motion.a>
        </motion.div>

        <div className="relative z-10 min-h-0 flex-1">
          <motion.ol
            aria-label="Spirit X 2.0 milestones"
            className="absolute inset-y-0 left-0 flex w-max items-center"
            style={{ x, paddingLeft: 'calc(50% - var(--panel) / 2)' }}
          >
            {MILESTONES.map((m, i) => (
              <Panel key={m.id} m={m} i={i} pos={pos} active={i === active} here={here} />
            ))}
          </motion.ol>
        </div>

        <Rail progress={railProgress} active={active} here={here} onJump={jump} />
      </div>
    </section>
  );
}

/** Reduced motion: no pinning, no panning — the same milestones as a plain grid. */
function StaticTimeline() {
  const here = useMemo(() => whereWeAre(Date.now()), []);
  return (
    <section id="timeline" aria-labelledby="timeline-title" className="relative isolate bg-background px-5 py-24 sm:px-8 sm:py-32">
      <div aria-hidden="true" className="timeline-scrim pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-7xl">
        <Title />
        <motion.ol {...revealOnce} variants={stagger(0.08)} className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {MILESTONES.map((m, i) => (
            <motion.li key={m.id} variants={lift} className="timeline-static-item border-t border-foreground/15 pt-5">
              <MilestoneBody m={m} i={i} here={here} />
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

export default function TimelineSection() {
  const reduceMotion = useReducedMotion();
  return reduceMotion ? <StaticTimeline /> : <PinnedTimeline />;
}
