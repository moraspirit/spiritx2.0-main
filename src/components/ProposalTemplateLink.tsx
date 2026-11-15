import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PROPOSAL_TEMPLATE_URL } from '../lib/api.ts';

/** Download link for the team proposal template PDF (public/). */
export default function ProposalTemplateLink({ className }: { className?: string }) {
  return (
    <a
      href={PROPOSAL_TEMPLATE_URL}
      download
      className={cn(
        'group inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-brand/50 hover:text-brand-ink',
        className,
      )}
    >
      <Download className="h-4 w-4 shrink-0 transition-transform group-hover:translate-y-0.5" aria-hidden />
      Proposal template
      <span className="text-xs text-muted-foreground">PDF</span>
    </a>
  );
}
