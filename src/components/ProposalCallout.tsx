import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import ProposalTemplateLink from './ProposalTemplateLink.tsx';
import { PORTAL_HREF, proposalDeadline, proposalsAcceptingNow } from '../lib/api.ts';
import { revealOnce, rise } from '../motion.ts';

const DAY_MS = 24 * 60 * 60 * 1000;
const TZ = 'Asia/Colombo';

function deadlineParts(date: Date) {
  const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: TZ }).format(date);
  const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ }).format(date);
  return { day, time };
}

function countdown(date: Date): string {
  const days = Math.ceil((date.getTime() - Date.now()) / DAY_MS);
  if (days <= 1) return 'Last day to submit.';
  return `${days} days left.`;
}

/**
 * Matchday-style notice between the hero and #about while the proposal round is live:
 * the deadline as the headline number, then the two things a team needs (template, portal).
 * Renders nothing once proposals close, so home never advertises a dead end.
 */
export default function ProposalCallout() {
  if (!proposalsAcceptingNow()) return null;
  const parts = proposalDeadline ? deadlineParts(proposalDeadline) : null;

  return (
    <section aria-labelledby="proposal-callout-title" className="relative isolate px-4 pt-6 sm:px-6 sm:pt-10">
      <motion.div
        {...revealOnce}
        variants={rise}
        className="proposal-callout relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-5 sm:p-8"
      >
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
          {parts ? (
            <div className="flex items-baseline gap-3 md:flex-col md:items-start md:gap-1 md:border-r md:border-border/70 md:pr-10">
              <p className="font-serif text-5xl leading-none text-foreground sm:text-6xl">{parts.day}</p>
              <p className="text-sm text-muted-foreground">Due {parts.time}</p>
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-sm font-medium text-brand-ink">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-ink opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-ink" />
              </span>
              Proposal round is live
            </p>
            <h2
              id="proposal-callout-title"
              className="mt-2 text-balance text-2xl font-medium leading-tight text-foreground sm:text-3xl"
            >
              Put your idea on paper.
            </h2>
            <p className="mt-2 max-w-[52ch] text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Download the proposal template (.docx) or copy it to your Google Drive, edit it with your team, then
              upload the final proposal as a PDF from the team portal.
              {proposalDeadline ? ` ${countdown(proposalDeadline)}` : ''}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:flex-col md:items-stretch">
            <a
              href={PORTAL_HREF}
              className="group flex min-h-12 items-center justify-between gap-4 rounded-full bg-brand py-1.5 pl-5 pr-1.5 text-sm font-medium text-primary-foreground transition-[box-shadow,transform] hover:shadow-brand active:scale-[0.98]"
            >
              Submit proposal
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-foreground text-brand-ink transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={17} aria-hidden="true" />
              </span>
            </a>
            <ProposalTemplateLink stacked />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
