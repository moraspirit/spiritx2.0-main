import { useEffect, useState } from 'react';
import { Check, Eye, EyeOff, LogOut } from 'lucide-react';
import ProposalForm from './ProposalForm.tsx';
import PrototypeForm from './PrototypeForm.tsx';
import {
  TEAM_CODE_PATTERN,
  apiConfigured,
  getTeamStatus,
  isApiError,
  normalizeTeamCode,
  type TeamStatus,
} from '../lib/api.ts';

const STORAGE_KEY = 'spiritx.teamCode';

// The code is the team's only credential: keep it for this tab only, never in localStorage.
function readStoredCode(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeCode(code: string | null) {
  try {
    if (code) sessionStorage.setItem(STORAGE_KEY, code);
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage blocked: the session just won't survive a reload */
  }
}

function StatusChip({ done, label }: { done: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
        done ? 'border-brand/40 bg-brand/10 text-brand-ink' : 'border-border text-muted-foreground'
      }`}
    >
      {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
      {label} {done ? 'submitted' : 'pending'}
    </span>
  );
}

function TeamLoginForm({ onLogin }: { onLogin: (code: string, status: TeamStatus) => void }) {
  const [code, setCode] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalized = normalizeTeamCode(code);
    if (!TEAM_CODE_PATTERN.test(normalized)) {
      setError('Team codes look like SX- followed by 32 letters and numbers.');
      return;
    }
    if (!apiConfigured) {
      setError('API is not configured yet.');
      return;
    }

    setPending(true);
    try {
      onLogin(normalized, await getTeamStatus(normalized));
    } catch (err) {
      if (isApiError(err)) setError(err.message);
      else setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl space-y-5 text-left">
      <div>
        <p className="eyebrow text-brand-ink">Team portal</p>
        <h2 className="mt-2 text-xl font-medium text-foreground sm:text-2xl">Team login</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Already registered? Enter the team code we emailed to your team leader to submit your proposal and
          prototype.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground" htmlFor="team_code">
          Team code
        </label>
        <div className="relative">
          <input
            id="team_code"
            type={visible ? 'text' : 'password'}
            required
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="SX-…"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'team_code_error' : undefined}
            className="w-full rounded-xl border border-border bg-background/80 py-2.5 pl-3 pr-11 font-mono text-sm tracking-wide text-foreground outline-none placeholder:font-sans placeholder:text-muted-foreground focus:border-brand/50 focus:ring-2 focus:ring-brand/30"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide team code' : 'Show team code'}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground"
          >
            {visible ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
          </button>
        </div>
        {error ? (
          <p id="team_code_error" className="mt-1 text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending || !code.trim()}
        className="w-full rounded-full bg-brand px-6 py-3 text-sm font-medium text-primary-foreground transition-[box-shadow,transform] hover:shadow-brand enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Checking…' : 'Log in'}
      </button>

      <p className="text-xs text-muted-foreground">
        Lost the code? It was sent to the leader&apos;s email.{' '}
        <a href="#contact" className="text-brand-ink underline-offset-4 hover:underline">
          Contact the organisers
        </a>{' '}
        and we can send a new one.
      </p>
    </form>
  );
}

/** Team-code login, then the team's proposal and prototype submissions. */
export default function TeamPortal() {
  const [code, setCode] = useState<string | null>(readStoredCode);
  const [status, setStatus] = useState<TeamStatus | null>(null);
  const [restoring, setRestoring] = useState(() => Boolean(readStoredCode()));

  // A code kept from earlier in this tab: check it is still valid before showing the forms.
  useEffect(() => {
    const stored = readStoredCode();
    if (!stored || !apiConfigured) {
      setRestoring(false);
      return;
    }
    let cancelled = false;
    getTeamStatus(stored)
      .then((next) => {
        if (!cancelled) setStatus(next);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isApiError(err) && err.status === 401) storeCode(null);
        setCode(null);
      })
      .finally(() => {
        if (!cancelled) setRestoring(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = (nextCode: string, nextStatus: TeamStatus) => {
    storeCode(nextCode);
    setCode(nextCode);
    setStatus(nextStatus);
  };

  const logout = () => {
    storeCode(null);
    setCode(null);
    setStatus(null);
  };

  const refresh = async () => {
    if (!code) return;
    try {
      setStatus(await getTeamStatus(code));
    } catch {
      /* keep the current view; the next action will surface any error */
    }
  };

  if (restoring) {
    return <p className="mx-auto w-full max-w-xl text-left text-sm text-muted-foreground">Checking your team code…</p>;
  }

  if (!code || !status) return <TeamLoginForm onLogin={login} />;

  return (
    <div className="mx-auto w-full max-w-xl space-y-8 text-left">
      <div className="rounded-2xl border border-border/70 bg-card/50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-brand-ink">Logged in as</p>
            <h2 className="mt-1 truncate text-xl font-medium text-foreground sm:text-2xl">{status.team_name}</h2>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            Log out
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusChip done={status.proposal_submitted} label="Proposal" />
          <StatusChip done={status.prototype_submitted} label="Prototype" />
        </div>
      </div>

      <ProposalForm teamCode={code} submitted={status.proposal_submitted} onSubmitted={refresh} />
      <PrototypeForm teamCode={code} submitted={status.prototype_submitted} onSubmitted={refresh} />
    </div>
  );
}
