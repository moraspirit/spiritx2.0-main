import { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import SectionBackdrop from './SectionBackdrop.tsx';
import { lift, revealOnce, rise, stagger } from '../motion.ts';

type Faq = { topic: string; q: string; a: string };

/** Answers marked MOCK are placeholders until the organisers confirm them. */
const FAQS: Faq[] = [
  {
    topic: 'Eligibility',
    q: 'Who can take part in Spirit X 2.0?',
    a: 'Any undergraduate currently enrolled at a university or higher-education institute in Sri Lanka. Every track is open to every faculty — you don’t need to be a computing student.',
  },
  {
    topic: 'Teams',
    q: 'How many people can be in a team?',
    // MOCK: same-university rule unconfirmed.
    a: 'Teams of two to four undergraduates. The team leader counts as member one, and all members should be from the same university.',
  },
  {
    topic: 'Fees',
    q: 'Is there a registration fee?',
    // MOCK
    a: 'No. Registering and competing in Spirit X 2.0 is completely free.',
  },
  {
    topic: 'Proposal',
    q: 'What do we need to submit?',
    a: 'One proposal PDF per team, up to 10 MB, describing the problem, your solution and why your team can build it. Resubmissions aren’t allowed, so send your final version.',
  },
  {
    topic: 'Tracks',
    q: 'Do we have to choose a track?',
    // MOCK
    a: 'Yes — pick the one track your idea fits best when you submit your proposal. Every track competes for the same podium prizes, plus a best-idea award in each track.',
  },
  {
    topic: 'Finale',
    q: 'Where and when is the grand finale?',
    // MOCK: date TBA.
    a: 'The 48-hour grand finale takes place at the University of Moratuwa. Confirmed dates for every stage appear in the timeline above as they’re announced.',
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

function FaqItem({ faq, index, open, onToggle }: { faq: Faq; index: number; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <motion.li variants={lift} className={cn('faq-item', open && 'is-open')}>
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="faq-trigger"
        >
          <span className="min-w-0">
            <span className="faq-topic">
              {pad(index + 1)} · {faq.topic}
            </span>
            <span className="faq-question">{faq.q}</span>
          </span>
          <span aria-hidden="true" className="faq-icon">
            <Plus size={18} strokeWidth={1.75} />
          </span>
        </button>
      </h3>
      <div id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} className="faq-panel" aria-hidden={!open}>
        <div className="min-h-0 overflow-hidden">
          <p className="faq-answer">{faq.a}</p>
        </div>
      </div>
    </motion.li>
  );
}

export default function FaqSection() {
  // One answer open at a time; the first starts open, like hackx.
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="faq-section relative isolate">
      <SectionBackdrop src="/media/bg/faq-floodlights-fog.webp" position="50% 40%" veil={0.62} />
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <motion.div {...revealOnce} variants={stagger(0.1)} className="lg:sticky lg:top-28 lg:self-start">
          <motion.h2 variants={rise} id="faq-title" className="text-balance text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl">
            Frequently asked <em className="font-serif font-normal text-brand-ink">questions.</em>
          </motion.h2>
          <motion.p variants={rise} className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Still unsure? <a href="#contact" className="font-medium text-brand-ink underline-offset-4 hover:underline">Contact the chairs</a> and we&rsquo;ll get back to you.
          </motion.p>
        </motion.div>

        <motion.ul {...revealOnce} variants={stagger(0.07, 0.05)} className="faq-list">
          {FAQS.map((faq, i) => (
            <FaqItem key={faq.q} faq={faq} index={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
