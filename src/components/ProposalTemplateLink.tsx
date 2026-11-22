import { Download, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PROPOSAL_TEMPLATE_DOCX_URL, PROPOSAL_TEMPLATE_GDOC_URL } from '../lib/api.ts';

/**
 * The proposal template, two ways: a .docx download (main) and the shared Google Doc
 * (secondary, new tab). `stacked` puts the Google Docs link centred under a full-width button.
 */
export default function ProposalTemplateLink({ stacked = false, className }: { stacked?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        'flex gap-x-4 gap-y-2',
        stacked ? 'flex-col items-stretch text-center' : 'flex-wrap items-center',
        className,
      )}
    >
      <a
        href={PROPOSAL_TEMPLATE_DOCX_URL}
        download
        className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-brand/50 hover:text-brand-ink"
      >
        <Download className="h-4 w-4 shrink-0 transition-transform group-hover:translate-y-0.5" aria-hidden />
        Download template
        <span className="text-xs text-muted-foreground">.docx</span>
      </a>
      <a
        href={PROPOSAL_TEMPLATE_GDOC_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex min-h-11 items-center justify-center gap-1.5 text-sm text-brand-ink underline-offset-4 hover:underline"
      >
        Open in Google Docs
        <ExternalLink
          className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden
        />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}
