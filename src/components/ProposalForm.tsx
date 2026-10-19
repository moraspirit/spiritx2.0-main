import { useState } from 'react';
import { Check } from 'lucide-react';
import Turnstile from './Turnstile.tsx';
import { apiConfigured, isApiError, submitProposal, turnstileSiteKey } from '../lib/api.ts';

const MAX_PDF_BYTES = 10 * 1024 * 1024;

type ProposalFormProps = {
  teamCode: string;
  submitted: boolean;
  onSubmitted: () => void;
};

export default function ProposalForm({ teamCode, submitted, onSubmitted }: ProposalFormProps) {
  const [projectTitle, setProjectTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // Turnstile tokens are single-use: remount the widget after every attempt.
  const [captchaKey, setCaptchaKey] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onFile = (f: File | null) => {
    setFormError(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setFormError('Proposal must be a PDF file.');
      setFile(null);
      return;
    }
    if (f.size > MAX_PDF_BYTES) {
      setFormError('PDF must be 10 MB or smaller.');
      setFile(null);
      return;
    }
    setFile(f);
  };

  const canSubmit =
    apiConfigured && Boolean(file) && Boolean(turnstileSiteKey) && Boolean(token) && !pending;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);

    if (!apiConfigured) {
      setFormError('API is not configured yet.');
      return;
    }
    if (!file) {
      setFormError('Please attach your proposal PDF.');
      return;
    }
    if (turnstileSiteKey && !token) {
      setFormError('Please complete the CAPTCHA.');
      return;
    }

    setPending(true);
    try {
      const result = await submitProposal(teamCode, {
        project_title: projectTitle.trim(),
        proposal_file: file,
        turnstileToken: token ?? '',
      });
      setSuccess(result.message);
      setProjectTitle('');
      setFile(null);
      onSubmitted();
    } catch (err) {
      if (isApiError(err)) {
        setFormError(err.message);
        if (err.status === 409) onSubmitted();
      } else setFormError('Something went wrong. Please try again.');
    } finally {
      setToken(null);
      setCaptchaKey((k) => k + 1);
      setPending(false);
    }
  };

  if (submitted) {
    return (
      <section className="space-y-2">
        <h2 className="text-xl font-medium text-foreground sm:text-2xl">Proposal submission</h2>
        <p className="flex items-center gap-2 text-sm text-brand-ink">
          <Check className="h-4 w-4 shrink-0" aria-hidden />
          {success ?? 'Your team’s proposal has been received.'}
        </p>
        <p className="text-sm text-muted-foreground">Each team can submit one proposal, so this step is done.</p>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-5 text-left">
      <div>
        <h2 className="text-xl font-medium text-foreground sm:text-2xl">Proposal submission</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          One PDF per team (max 10 MB). Resubmissions are not allowed.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground" htmlFor="proposal_title">
          Project title
        </label>
        <input
          id="proposal_title"
          required
          minLength={3}
          maxLength={100}
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className="w-full rounded-xl border border-border bg-background/80 px-3 py-2.5 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground" htmlFor="proposal_file">
          Proposal PDF
        </label>
        <input
          id="proposal_file"
          type="file"
          accept="application/pdf,.pdf"
          required
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-xl border border-border bg-background/80 px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground"
        />
      </div>

      <Turnstile key={captchaKey} onToken={setToken} />

      {!apiConfigured ? (
        <p className="text-sm text-muted-foreground">API base URL is not set — form is wired but inactive.</p>
      ) : null}
      {!turnstileSiteKey ? (
        <p className="text-sm text-muted-foreground">Turnstile site key is not set — submit stays locked.</p>
      ) : null}
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-full bg-brand px-6 py-3 text-sm font-medium text-primary-foreground transition-[box-shadow,transform] hover:shadow-brand enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Submitting…' : 'Submit proposal'}
      </button>
    </form>
  );
}
