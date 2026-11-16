import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PROPOSAL_TEMPLATE_URL } from '../lib/api.ts';

/** Opens the proposal template (a shared Google Doc) in a new tab. */
export default function ProposalTemplateLink({ className }: { className?: string }) {
  return (
    <a
      href={PROPOSAL_TEMPLATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-brand/50 hover:text-brand-ink',
        className,
      )}
    >
      Proposal template
      <ExternalLink
        className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden
      />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
