import { useMemo, useState } from 'react';
import Turnstile from './Turnstile.tsx';
import {
  apiConfigured,
  isApiError,
  registerTeam,
  turnstileSiteKey,
  type LeaderPayload,
  type MemberPayload,
} from '../lib/api.ts';

const emptyPerson = (): LeaderPayload => ({
  name: '',
  university_reg_no: '',
  email: '',
  whatsapp: '',
});

type FieldErrors = Record<string, string>;

function PersonFields({
  prefix,
  label,
  value,
  onChange,
  errors,
}: {
  prefix: string;
  label: string;
  value: LeaderPayload;
  onChange: (next: LeaderPayload) => void;
  errors: FieldErrors;
}) {
  const set = (key: keyof LeaderPayload, v: string) => onChange({ ...value, [key]: v });
  const err = (key: string) => errors[`${prefix}.${key}`] || errors[key];

  return (
    <fieldset className="space-y-3 rounded-2xl border border-border/70 bg-card/50 p-4">
      <legend className="px-1 text-xs font-medium uppercase tracking-[0.14em] text-brand-ink">
        {label}
      </legend>
      {(
        [
          ['name', 'Full name', 'text'],
          ['university_reg_no', 'University reg. no', 'text'],
          ['email', 'Email', 'email'],
          ['whatsapp', 'WhatsApp (+94…)', 'tel'],
        ] as const
      ).map(([key, placeholder, type]) => (
        <div key={key}>
          <label className="sr-only" htmlFor={`${prefix}-${key}`}>
            {placeholder}
          </label>
          <input
            id={`${prefix}-${key}`}
            type={type}
            required
            autoComplete={key === 'email' ? 'email' : key === 'name' ? 'name' : 'off'}
            placeholder={placeholder}
            value={value[key]}
            onChange={(e) => set(key, e.target.value)}
            className="w-full rounded-xl border border-border bg-background/80 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-brand/50 focus:ring-2 focus:ring-brand/30"
          />
          {err(key) ? <p className="mt-1 text-left text-xs text-destructive">{err(key)}</p> : null}
        </div>
      ))}
    </fieldset>
  );
}

export default function TeamRegisterForm() {
  const [teamName, setTeamName] = useState('');
  const [university, setUniversity] = useState('');
  const [teamSize, setTeamSize] = useState(2);
  const [leader, setLeader] = useState<LeaderPayload>(emptyPerson);
  const [members, setMembers] = useState<MemberPayload[]>([
    { member_number: 2, ...emptyPerson() },
  ]);
  const [token, setToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const memberSlots = useMemo(() => Math.max(1, teamSize - 1), [teamSize]);

  const syncMembers = (size: number) => {
    setTeamSize(size);
    const slots = size - 1;
    setMembers((prev) => {
      const next: MemberPayload[] = [];
      for (let i = 0; i < slots; i++) {
        const num = i + 2;
        next.push(prev[i] ? { ...prev[i], member_number: num } : { member_number: num, ...emptyPerson() });
      }
      return next;
    });
  };

  const canSubmit =
    apiConfigured &&
    Boolean(turnstileSiteKey) &&
    Boolean(token) &&
    !pending &&
    Boolean(teamName.trim() && university.trim());

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setErrors({});
    setSuccess(null);

    if (!apiConfigured) {
      setFormError('Registration API is not configured yet.');
      return;
    }
    if (turnstileSiteKey && !token) {
      setFormError('Please complete the CAPTCHA.');
      return;
    }
    if (members.length !== memberSlots) {
      setFormError(`Team size ${teamSize} needs exactly ${memberSlots} additional member(s).`);
      return;
    }

    setPending(true);
    try {
      const result = await registerTeam({
        team_name: teamName.trim(),
        university: university.trim(),
        team_size: teamSize,
        leader,
        members: members.map((m, i) => ({ ...m, member_number: i + 2 })),
        cf_turnstile_response: token ?? '',
      });
      setSuccess(result.message);
      setTeamName('');
      setUniversity('');
      setLeader(emptyPerson());
      syncMembers(2);
      setToken(null);
    } catch (err) {
      if (isApiError(err)) {
        setFormError(err.message);
        if (err.fields) setErrors(err.fields);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl space-y-5 text-left">
      <div>
        <h2 className="text-xl font-medium text-foreground sm:text-2xl">Team registration</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Teams of 2–4 undergraduates. Leader counts as member 1.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground" htmlFor="team_name">
            Team name
          </label>
          <input
            id="team_name"
            required
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full rounded-xl border border-border bg-background/80 px-3 py-2.5 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground" htmlFor="university">
            University
          </label>
          <input
            id="university"
            required
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full rounded-xl border border-border bg-background/80 px-3 py-2.5 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground" htmlFor="team_size">
            Team size
          </label>
          <select
            id="team_size"
            value={teamSize}
            onChange={(e) => syncMembers(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-background/80 px-3 py-2.5 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/30"
          >
            {[2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} members
              </option>
            ))}
          </select>
        </div>
      </div>

      <PersonFields prefix="leader" label="Team leader" value={leader} onChange={setLeader} errors={errors} />

      {members.map((m, i) => (
        <PersonFields
          key={m.member_number}
          prefix={`members.${i}`}
          label={`Member ${m.member_number}`}
          value={m}
          onChange={(next) =>
            setMembers((prev) => prev.map((p, idx) => (idx === i ? { ...next, member_number: i + 2 } : p)))
          }
          errors={errors}
        />
      ))}

      <Turnstile onToken={setToken} />

      {!apiConfigured ? (
        <p className="text-sm text-muted-foreground">API base URL is not set — form is wired but inactive.</p>
      ) : null}
      {!turnstileSiteKey ? (
        <p className="text-sm text-muted-foreground">Turnstile site key is not set — submit stays locked.</p>
      ) : null}
      {turnstileSiteKey && !token ? (
        <p className="text-xs text-muted-foreground">Complete the CAPTCHA to enable submit.</p>
      ) : null}
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      {success ? <p className="text-sm text-brand-ink">{success}</p> : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-full bg-brand px-6 py-3 text-sm font-medium text-primary-foreground transition-[box-shadow,transform] hover:shadow-brand enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Registering…' : 'Register team'}
      </button>
    </form>
  );
}
