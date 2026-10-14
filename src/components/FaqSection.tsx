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
    topic: 'About',
    q: 'What is Spirit X 2.0?',
    a: 'A two-stage inter-university hackathon by MoraSpirit where undergraduates turn real problems in sport into practical digital solutions. Where sports meets technology.',
  },
  {
    topic: 'Eligibility',
    q: 'Who can take part in Spirit X 2.0?',
    a: 'Undergraduates from state and private universities in Sri Lanka who are below 30 years of age as of 1 January 2027. Each participant can represent only one team.',
  },
  {
    topic: 'Teams',
    q: 'How many people can be in a team?',
    a: 'Three or four. All team members must be from the same university, and the team leader counts as member one.',
  },
  {
    topic: 'Fees',
    q: 'Is there a registration fee?',
    // MOCK: not in the booklet.
    a: 'No. Registering and competing in Spirit X 2.0 is completely free.',
  },
  {
    topic: 'Registering',
    q: 'Who registers the team?',
    a: 'Only one team member should submit the registration form on behalf of the whole team, and only one submission per team is allowed.',
  },
  {
    topic: 'The challenge',
    q: 'What should we build?',
    a: 'Pick a real problem within the sports domain, such as sports, fitness, athletics or sports management, and build a working web or mobile solution around it. What matters most is a meaningful problem and a solution with real value.',
  },
  {
    topic: 'Directions',
    q: 'Do we have to choose a category?',
    a: 'No. The directions on this page are ideas to spark yours, not fixed categories. Choose the problem you care about.',
  },
  {
    topic: 'Proposal',
    q: 'What do we need to submit first?',
    a: 'One proposal per team, up to 10 MB, describing the problem and your proposed solution. Only the proposals are evaluated to choose who moves on to the development stage.',
  },
  {
    topic: 'Prototype',
    q: 'What happens after the proposal?',
    a: 'Selected teams build a functional prototype and submit it as a repository link, along with a demo video of up to 10 minutes showing the key features. Prototypes are judged against the competition criteria.',
  },
  {
    topic: 'Finale',
    q: 'Where is the final evaluation day?',
    // Venue and date announced later per the booklet.
    a: 'Finalists present and demo their solutions in person to the judging panel at the University of Moratuwa. The venue and final date will be announced later; the timeline above shows every confirmed date.',
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
          className="faq-trigger group w-full cursor-pointer select-none touch-manipulation"
        >
          <span className="min-w-0 text-left">
            <span className="faq-topic">
              {pad(index + 1)} · {faq.topic}
            </span>
            <span className="faq-question">{faq.q}</span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              'faq-icon shrink-0 transition-transform duration-300',
              open && 'rotate-45'
            )}
          >
            <Plus size={18} strokeWidth={1.75} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <p className="faq-answer">{faq.a}</p>
        </div>
      </div>
    </motion.li>
  );
}

export default function FaqSection() {
  // One answer open at a time; all start collapsed (-1 = none open).
  const [open, setOpen] = useState(-1);

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
            <FaqItem
              key={faq.q}
              faq={faq}
              index={i}
              open={open === i}
              onToggle={() => setOpen((prev) => (prev === i ? -1 : i))}
            />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
