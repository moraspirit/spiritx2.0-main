import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import SectionBackdrop from './SectionBackdrop.tsx';
import { revealOnce, rise, stagger } from '../motion.ts';

/**
 * Temporary announcement component shown while prize pool details are finalized.
 * Replaces PrizesSection on the home page until official figures are released.
 */
export default function PrizesAnnouncedLaterSection() {
  return (
    <section
      id="prizes"
      aria-labelledby="prizes-title"
      className="prizes-section relative isolate flex min-h-[55vh] flex-col items-center justify-center overflow-hidden sm:min-h-[65vh]"
    >
      <SectionBackdrop src="/media/gallery/02.webp" tone="duotone" position="50% 35%" veil={0.84} cropWatermark />
      <div aria-hidden="true" className="prizes-glow pointer-events-none absolute inset-0 -z-[1]" />

      <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
        <motion.div {...revealOnce} variants={stagger(0.12)} className="flex flex-col items-center">
          <motion.div
            variants={rise}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-ink/25 bg-brand-ink/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-brand-ink backdrop-blur-md sm:text-sm"
          >
            <Sparkles size={14} className="text-brand-ink" />
            <span>Stay Tuned</span>
          </motion.div>

          <motion.h2
            variants={rise}
            id="prizes-title"
            className="text-balance text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Prize pool <br className="hidden sm:inline" />
            <em className="font-serif font-normal text-brand-ink">announced later.</em>
          </motion.h2>

          <motion.p
            variants={rise}
            className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
          >
            The official reward tiers and championship prizes for Spirit X 2.0 will be revealed soon.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
