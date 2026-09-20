import { useState } from 'react';
import Turnstile from './Turnstile.tsx';
import { apiConfigured, isApiError, submitProposal, turnstileSiteKey } from '../lib/api.ts';

const MAX_PDF_BYTES = 10 * 1024 * 1024;

export default function ProposalForm() {
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [token, setToken] = useState<string | null>(null);
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
      const result = await submitProposal({
        team_name: teamName.trim(),
        leader_name: leaderName.trim(),
        leader_email: leaderEmail.trim(),
        project_title: projectTitle.trim(),
        proposal_file: file,
        turnstileToken: token ?? '',
      });
      setSuccess(result.message);
      setTeamName('');
      setLeaderName('');
      setLeaderEmail('');
      setProjectTitle('');
      setFile(null);
      setToken(null);
    } catch (err) {
      if (isApiError(err)) setFormError(err.message);
      else setFormError('Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl space-y-5 text-left">
      <div>
        <h2 className="text-xl font-medium text-foreground sm:text-2xl">Proposal submission</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          One PDF per team (max 10 MB). Resubmissions are not allowed.
        </p>
      </div>

      {(
        [
          ['team_name', 'Team name', teamName, setTeamName, 'text'],
          ['leader_name', 'Leader name', leaderName, setLeaderName, 'text'],
          ['leader_email', 'Leader email', leaderEmail, setLeaderEmail, 'email'],
          ['project_title', 'Project title', projectTitle, setProjectTitle, 'text'],
        ] as const
      ).map(([id, label, value, setter, type]) => (
        <div key={id}>
          <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground" htmlFor={id}>
            {label}
          </label>
          <input
            id={id}
            type={type}
            required
            value={value}
            onChange={(e) => setter(e.target.value)}
            className="w-full rounded-xl border border-border bg-background/80 px-3 py-2.5 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/30"
          />
        </div>
      ))}

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

      <Turnstile onToken={setToken} />

      {!apiConfigured ? (
        <p className="text-sm text-muted-foreground">API base URL is not set — form is wired but inactive.</p>
      ) : null}
      {!turnstileSiteKey ? (
        <p className="text-sm text-muted-foreground">Turnstile site key is not set — submit stays locked.</p>
      ) : null}
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      {success ? <p className="text-sm text-brand-ink">{success}</p> : null}

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
