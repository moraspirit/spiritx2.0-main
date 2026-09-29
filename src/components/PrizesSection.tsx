import { useEffect, useRef, useState } from 'react';
import { Trophy } from 'lucide-react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import SectionBackdrop from './SectionBackdrop.tsx';
import { EASE_OUT, lift, revealOnce, rise, stagger } from '../motion.ts';

type Prize = {
  place: string;
  title: string;
  /** LKR. */
  amount: number;
};

/** MOCK AMOUNTS — replace with the confirmed Spirit X 2.0 prize split. */
const PODIUM: Prize[] = [
  { place: '1st', title: 'Champions', amount: 1_000_000 },
  { place: '2nd', title: 'First Runners-Up', amount: 750_000 },
  { place: '3rd', title: 'Second Runners-Up', amount: 500_000 },
];

/** MOCK — extra awards and perks shown under the podium. */
const EXTRAS = ['Best idea in each track', 'Most popular idea', 'Mentorship from industry leaders', 'Finalist certificates'];

const lkr = (n: number) => `LKR ${Math.round(n).toLocaleString('en-US')}`;

/** Counts up from zero the first time the card is on screen. */
function Amount({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (reduceMotion) return;
    setShown(0);
  }, [reduceMotion]);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, { duration: 1.6, ease: EASE_OUT, onUpdate: setShown });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref} className="tabular-nums" aria-label={lkr(value)}>
      {lkr(shown)}
    </span>
  );
}

function PrizeCard({ prize, rank }: { prize: Prize; rank: number }) {
  const champion = rank === 0;
  return (
    <motion.li variants={lift} className={cn('prize-card', champion ? 'is-champion' : `is-rank-${rank + 1}`)}>
      <div className="flex items-start justify-between gap-4">
        <span aria-hidden="true" className="prize-place">
          {prize.place}
        </span>
        <span aria-hidden="true" className="prize-trophy">
          <Trophy size={champion ? 22 : 18} strokeWidth={1.5} />
        </span>
      </div>
      <h3 className="mt-6 text-lg font-semibold tracking-tight">{prize.title}</h3>
      <p className={cn('prize-amount mt-2', champion && 'is-lead')}>
        <Amount value={prize.amount} />
      </p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-foreground/10 pt-4 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <span>Cash prize</span>
        <span>Grand finale · Spirit X 2.0</span>
      </div>
    </motion.li>
  );
}

export default function PrizesSection() {
  // Podium order on wide screens: 2nd · 1st · 3rd. Phones read 1st → 3rd.
  return (
    <section id="prizes" aria-labelledby="prizes-title" className="prizes-section relative isolate">
      <SectionBackdrop src="/media/gallery/02.webp" tone="duotone" position="50% 35%" veil={0.84} cropWatermark />
      <div aria-hidden="true" className="prizes-glow pointer-events-none absolute inset-0 -z-[1]" />
      <div className="mx-auto max-w-6xl">
        <motion.div {...revealOnce} variants={stagger(0.1)} className="text-center">
          <motion.h2 variants={rise} id="prizes-title" className="text-balance text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
            LKR 5m <em className="font-serif font-normal text-brand-ink">prize pool.</em>
          </motion.h2>
          <motion.p variants={rise} className="mx-auto mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Build something the game hasn&rsquo;t seen before. The best teams take home cash, mentorship and a place on the main stage.
          </motion.p>
        </motion.div>

        <motion.ol {...revealOnce} variants={stagger(0.12, 0.1)} className="prizes-podium mt-12 sm:mt-16" aria-label="Podium prizes">
          {PODIUM.map((prize, rank) => (
            <PrizeCard key={prize.place} prize={prize} rank={rank} />
          ))}
        </motion.ol>

        <motion.ul
          {...revealOnce}
          variants={rise}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-xs text-muted-foreground sm:text-sm"
          aria-label="Other awards"
        >
          {EXTRAS.map((item, i) => (
            <li key={item} className="flex items-center gap-3">
              {i > 0 ? <span aria-hidden="true" className="size-1 rounded-full bg-brand-ink/60" /> : null}
              {item}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
