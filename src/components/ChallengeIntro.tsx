import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Orbit, Radio, Layers } from 'lucide-react';
import { type MotionValue, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';
import { EASE_OUT, revealOnce, rise, stagger } from '../motion.ts';

const ideas = [
  { icon: Orbit, title: 'Understand the athlete.', copy: 'Explore how intelligent agents and data can help athletes train, recover, and perform.', tag: 'Intelligence / performance' },
  { icon: Radio, title: 'Connect the crowd.', copy: 'Bring the energy of the game closer with connected experiences for fans and communities.', tag: 'Connection / experience' },
  { icon: Layers, title: 'Reimagine the field.', copy: 'Turn physical spaces into new possibilities through tracking, simulation, and digital twins.', tag: 'Spatial / innovation' },
];

const STATEMENT =
  'A meeting point for sport, technology, and student ambition. Find the problem that matters to you. Build what comes next.';

function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [i / total, (i + 1) / total], [0.22, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block pr-[0.28em]">
      {word}
    </motion.span>
  );
}

/** The statement brightens word by word as it is read, like a line lighting up across a scoreboard. */
function ScrollStatement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = STATEMENT.split(' ');

  return (
    <p
      ref={ref}
      className="intro-statement max-w-[34ch] text-pretty text-2xl font-light leading-snug tracking-tight text-foreground sm:text-3xl lg:text-[2.15rem]"
    >
      {reduceMotion
        ? STATEMENT
        : words.map((word, i) => <Word key={`${word}-${i}`} word={word} i={i} total={words.length} progress={scrollYProgress} />)}
    </p>
  );
}

export default function ChallengeIntro() {
  const [active, setActive] = useState(-1);
  const listRef = useRef<HTMLOListElement>(null);

  // The row crossing the middle of the viewport leads; the others step back.
  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.row));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    root.querySelectorAll('[data-row]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="challenge-intro relative isolate scroll-mt-16" aria-labelledby="challenge-intro-title">
      <div className="mx-auto max-w-7xl">
        <motion.div {...revealOnce} variants={stagger(0.12)}>
          <motion.p variants={rise} className="eyebrow mb-6">The next move is yours</motion.p>
          <motion.h2 variants={rise} id="challenge-intro-title" className="intro-display text-balance">
            From a bold idea<br />to a better <em className="font-serif font-normal text-brand-ink">game.</em>
          </motion.h2>
        </motion.div>

        <div className="mt-12 grid gap-8 sm:mt-16 lg:mt-24 lg:grid-cols-12">
          <span aria-hidden="true" className="intro-statement-rule hidden lg:col-span-4 lg:block" />
          <div className="lg:col-span-8">
            <ScrollStatement />
          </div>
        </div>

        <ol ref={listRef} className="mt-16 sm:mt-24 lg:mt-32">
          {ideas.map(({ icon: Icon, title, copy, tag }, i) => (
            <motion.li
              key={title}
              data-row={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.05 * i }}
            >
              <a href="#tracks" className={cn('intro-idea group', i === active && 'is-active')}>
                <span className="intro-idea-num" aria-hidden="true">0{i + 1}</span>
                <div className="min-w-0">
                  <p className="flex items-center gap-2.5 text-[10px] uppercase tracking-widest text-brand-ink">
                    <Icon size={15} strokeWidth={1.4} aria-hidden="true" />
                    {tag}
                  </p>
                  <h3 className="intro-idea-title mt-3 text-balance">{title}</h3>
                </div>
                <div className="intro-idea-side">
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{copy}</p>
                  <span className="mt-5 inline-flex min-h-11 items-center gap-3 text-sm font-medium text-foreground">
                    Explore the tracks
                    <span className="intro-idea-arrow">
                      <ArrowUpRight size={16} />
                    </span>
                  </span>
                </div>
              </a>
            </motion.li>
          ))}
        </ol>

        <motion.div
          {...revealOnce}
          variants={rise}
          className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-sm"
        >
          <p className="text-muted-foreground">Every new idea starts with a shared story.</p>
          <a href="#stories" className="inline-flex min-h-11 items-center gap-2 font-medium text-brand-ink">Meet the Spirit X community <ArrowUpRight size={17} /></a>
        </motion.div>
      </div>
    </section>
  );
}
