import { useState } from 'react';
import { Activity, ArrowRight, BarChart3, ClipboardList, HeartPulse, MonitorSmartphone } from 'lucide-react';
import { motion, useMotionValueEvent, useTransform } from 'motion/react';
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  useContainerScrollContext,
} from '@/components/ui/animated-cards-stack';
import { cn } from '@/lib/utils';
import { REGISTER_HREF } from '@/lib/api';
import SectionBackdrop from './SectionBackdrop.tsx';
import { revealOnce, rise, stagger } from '../motion.ts';

const TRACKS = [
  {
    id: 'performance',
    Icon: Activity,
    badge: 'Training · Performance',
    title: 'Athlete & Team Performance',
    body: 'Help athletes and teams train smarter, track their progress and perform at their best.',
  },
  {
    id: 'fitness',
    Icon: HeartPulse,
    badge: 'Health · Recovery',
    title: 'Fitness & Wellness',
    body: 'Make staying active, recovering well and looking after wellbeing easier for everyone.',
  },
  {
    id: 'management',
    Icon: ClipboardList,
    badge: 'Clubs · Operations',
    title: 'Sports Management',
    body: 'Streamline how clubs, teams and associations are run, from rosters to resources.',
  },
  {
    id: 'analytics',
    Icon: BarChart3,
    badge: 'Data · Insight',
    title: 'Sports Data & Analytics',
    body: 'Turn match and training data into insight that changes decisions on and off the field.',
  },
  {
    id: 'digital',
    Icon: MonitorSmartphone,
    badge: 'Fans · Engagement',
    title: 'Digital Experiences',
    body: 'Bring sport closer to the people who play, follow and love it, on the screen in their hand.',
  },
];

const STEPS_PATH = [
  { title: 'Identify', body: 'Find a meaningful problem within the sports domain.' },
  { title: 'Ideate', body: 'Develop an innovative and practical approach to solving it.' },
  { title: 'Propose', body: 'Present your concept for evaluation.' },
  { title: 'Build', body: 'Turn your selected idea into a functional prototype.' },
  { title: 'Showcase', body: 'Present and demonstrate the finished solution at the final evaluation.' },
];

const STACK_ID = 'track-stack';

// CardTransformed splits scroll progress into TRACKS.length + 1 equal steps:
// card i (1-based) leaves between i / STEPS and (i + 1) / STEPS.
const STEPS = TRACKS.length + 1;

const pad = (n: number) => String(n).padStart(2, '0');

/** Scroll so track `i` sits fully on top of the stack. */
function scrollToTrack(i: number) {
  const el = document.getElementById(STACK_ID);
  if (!el) return;

  // Mirrors ContainerScroll's offset: ['start center', 'end end'].
  const half = window.innerHeight / 2;
  const start = el.getBoundingClientRect().top + window.scrollY - half;
  const progress = (i + 1) / STEPS;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.scrollTo({
    top: start + progress * (el.offsetHeight - half),
    behavior: reduce ? 'auto' : 'smooth',
  });
}

/** Index of the card on top — flips once the card above it is half gone. */
function useActiveTrack() {
  const { scrollYProgress } = useContainerScrollContext();
  const toIndex = (p: number) =>
    Math.min(TRACKS.length - 1, Math.max(0, Math.floor(p * STEPS - 0.5)));

  const [active, setActive] = useState(() => toIndex(scrollYProgress.get()));
  useMotionValueEvent(scrollYProgress, 'change', (p) => setActive(toIndex(p)));
  return active;
}

function TrackIndex({ active }: { active: number }) {
  const { scrollYProgress } = useContainerScrollContext();
  const fill = useTransform(scrollYProgress, [1 / STEPS, TRACKS.length / STEPS], [0, 1]);

  return (
    <div className="hidden lg:block">
      <p className="eyebrow">
        direction {pad(active + 1)} of {pad(TRACKS.length)}
      </p>

      <div className="relative mt-8 pl-8">
        <span aria-hidden="true" className="absolute inset-y-3 left-0 w-px bg-border" />
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-3 left-0 w-px origin-top bg-brand-ink"
          style={{ scaleY: fill }}
        />

        <ol className="space-y-1">
          {TRACKS.map(({ id, title }, i) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => scrollToTrack(i)}
                aria-current={i === active ? 'step' : undefined}
                className={cn(
                  'flex w-full items-baseline gap-5 py-3 text-left transition-colors duration-300',
                  i === active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span className={cn('text-sm tabular-nums', i === active && 'text-brand-ink')}>
                  {pad(i + 1)}
                </span>
                <span className="text-2xl font-medium tracking-tight xl:text-3xl">{title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Scroll through the directions, or jump to the one that sparks an idea. They&rsquo;re starting points, not categories.
      </p>
    </div>
  );
}

function TrackDots({ active }: { active: number }) {
  return (
    <div className="mt-16 flex justify-center gap-2 lg:hidden" aria-hidden="true">
      {TRACKS.map(({ id }, i) => (
        <span
          key={id}
          className={cn(
            'h-1 rounded-full transition-all duration-300',
            i === active ? 'w-8 bg-brand-ink' : 'w-4 bg-border'
          )}
        />
      ))}
    </div>
  );
}

function TrackStack() {
  const active = useActiveTrack();

  return (
    <div className="sticky left-0 top-0 flex h-svh w-full items-center">
      {/* lg:px-6 leaves room for the tilted cards on 1024px-wide tablets. */}
      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[minmax(0,1fr)_440px] lg:px-6 xl:px-0">
        <TrackIndex active={active} />

        <div>
          <CardsContainer className="mx-auto size-full h-[400px] w-[86%] max-w-[440px] sm:w-full">
            {TRACKS.map(({ id, Icon, badge, title, body }, index) => (
              <CardTransformed
                key={id}
                arrayLength={TRACKS.length}
                index={index + 1}
                variant="light"
                role="article"
                aria-labelledby={`track-${id}-title`}
                className="card-noise items-start justify-between gap-4 border border-white/15 [background-color:hsl(var(--card)/0.84)] bg-gradient-to-br from-white/[0.09] to-transparent p-7 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_0_32px_rgba(255,255,255,0.03)] backdrop-blur-xl backdrop-saturate-150"
              >
                <div className="flex w-full items-start justify-between">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand-ink">
                    <Icon size={26} strokeWidth={1.75} />
                  </div>
                  <span className="text-sm font-medium tabular-nums text-muted-foreground">
                    {pad(index + 1)}
                    <span className="text-brand-ink"> / </span>
                    {pad(TRACKS.length)}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-ink">
                    {badge}
                  </p>
                  <h2
                    id={`track-${id}-title`}
                    className="text-2xl font-semibold leading-tight tracking-tight"
                  >
                    {title}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>

                <a
                  href={REGISTER_HREF}
                  className="group -my-3 inline-flex items-center gap-2 py-3 text-sm font-medium text-foreground transition-colors hover:text-brand-ink"
                >
                  register your team
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </a>
              </CardTransformed>
            ))}
          </CardsContainer>

          <TrackDots active={active} />
        </div>
      </div>
    </div>
  );
}

export default function TracksSection() {
  return (
    <section id="challenge" aria-labelledby="tracks-title" className="relative isolate bg-background px-5 pb-12 pt-24 sm:px-8 sm:pt-32">
      <SectionBackdrop src="/media/home-innovation-poster.webp" position="50% 72%" veil={0.5} veilLight={0.72} sticky />
      <motion.div {...revealOnce} variants={stagger(0.1)} className="mx-auto max-w-2xl text-center">
        <motion.p variants={rise} className="eyebrow">the spirit x challenge</motion.p>
        <motion.h2
          variants={rise}
          id="tracks-title"
          className="hero-title mt-4 text-5xl font-medium text-foreground sm:text-6xl md:text-7xl"
        >
          explore the possibilities<span className="text-brand-ink">.</span>
        </motion.h2>
        <motion.p variants={rise} className="mx-auto mt-5 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Find a real problem in sports, fitness, athletics or sports management and build the
          technology around it. These directions are ideas to spark yours &mdash; you don&rsquo;t have to
          pick one.
        </motion.p>
      </motion.div>

      <ContainerScroll id={STACK_ID} className="h-[300vh]">
        <TrackStack />
      </ContainerScroll>

      <motion.div {...revealOnce} variants={stagger(0.08)} className="mx-auto mt-4 max-w-5xl pb-20">
        <motion.h3 variants={rise} className="text-center text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          from problem to solution
        </motion.h3>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS_PATH.map((step, i) => (
            <motion.li key={step.title} variants={rise} className="card-noise relative rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.09] to-transparent p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_0_32px_rgba(255,255,255,0.03)] backdrop-blur-xl backdrop-saturate-150 [background-color:hsl(var(--card)/0.84)]">
              <span className="text-sm tabular-nums text-brand-ink">{pad(i + 1)}</span>
              <p className="mt-2 text-lg font-medium text-foreground">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </motion.li>
          ))}
        </ol>
        <motion.p variants={rise} className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
          Teams submit a proposal, then a working web or mobile prototype with a repository link and a demo video of up to 10 minutes.
        </motion.p>
      </motion.div>

      <motion.div {...revealOnce} variants={rise} className="mx-auto max-w-xl pb-8 text-center">
        <p className="text-muted-foreground">Found your problem? Here&rsquo;s when it all happens.</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <a
            href={REGISTER_HREF}
            className="inline-flex min-h-11 items-center rounded-full bg-brand px-8 py-3.5 text-sm font-medium text-primary-foreground transition-[box-shadow,transform] hover:shadow-brand active:scale-95"
          >
            register your team
          </a>
          <a
            href="#timeline"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3.5 text-sm font-medium text-foreground transition-colors hover:text-brand-ink"
          >
            see the timeline
            <ArrowRight size={16} className="rotate-90" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
