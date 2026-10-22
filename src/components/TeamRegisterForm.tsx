import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Turnstile from './Turnstile.tsx';
import WhatsAppIcon from './WhatsAppIcon.tsx';
import {
  apiConfigured,
  isApiError,
  isValidSriLankanPhone,
  registerTeam,
  turnstileSiteKey,
  WHATSAPP_GROUP_URL,
  type LeaderPayload,
  type MemberPayload,
} from '../lib/api.ts';

const STEPS = ['Team', 'Leader', 'Members', 'Review'] as const;
const [TEAM, LEADER, MEMBERS, REVIEW] = [0, 1, 2, 3];

const emptyPerson = (): LeaderPayload => ({
  name: '',
  university_reg_no: '',
  email: '',
  whatsapp: '',
});

type FieldErrors = Record<string, string>;

const inputClass =
  'w-full rounded-xl border border-border bg-background/80 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-brand/50 focus:ring-2 focus:ring-brand/30 aria-[invalid=true]:border-destructive/70';
const labelClass = 'mb-1 block text-xs uppercase tracking-wider text-muted-foreground';

// Same rules as the FastAPI schema (app/scemas/team.py), so most mistakes are caught before submit.
const NAME_RE = /^[a-zA-Z\s.'-]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validatePerson(prefix: string, p: LeaderPayload, errors: FieldErrors) {
  const name = p.name.trim();
  if (name.length < 2) errors[`${prefix}.name`] = 'Enter the full name.';
  else if (!NAME_RE.test(name)) errors[`${prefix}.name`] = 'Use letters, spaces, hyphens, apostrophes or dots only.';
  if (p.university_reg_no.trim().length < 2) errors[`${prefix}.university_reg_no`] = 'Enter the university registration number.';
  if (!EMAIL_RE.test(p.email.trim())) errors[`${prefix}.email`] = 'Enter a valid email address.';

  const whatsapp = p.whatsapp.trim();
  if (!whatsapp) {
    errors[`${prefix}.whatsapp`] = 'Enter a WhatsApp phone number.';
  } else if (!isValidSriLankanPhone(whatsapp)) {
    errors[`${prefix}.whatsapp`] = 'Enter a valid Sri Lankan phone number (e.g. 077 123 4567 or +94 77 123 4567).';
  }
}

/** Which step a server-side field error belongs to. */
function stepForField(key: string): number {
  if (key.startsWith('leader')) return LEADER;
  if (key.startsWith('members')) return MEMBERS;
  if (key === 'team_name' || key === 'university' || key === 'team_size') return TEAM;
  return REVIEW;
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Registration progress">
      {STEPS.map((label, i) => {
        const done = i < step;
        const current = i === step;
        return (
          <li key={label} aria-current={current ? 'step' : undefined} className="min-w-0">
            <div className={`h-1 rounded-full transition-colors ${i <= step ? 'bg-brand' : 'bg-border'}`} />
            <div
              className={`mt-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] sm:text-xs ${
                current ? 'text-brand-ink' : done ? 'text-foreground/80' : 'text-muted-foreground'
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden /> : <span aria-hidden>{i + 1}</span>}
              <span className="truncate">{label}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

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

  return (
    <fieldset className="space-y-3 rounded-2xl border border-border/70 bg-card/50 p-4">
      <legend className="px-1 text-xs font-medium uppercase tracking-[0.14em] text-brand-ink">{label}</legend>
      {(
        [
          ['name', 'Full name', 'text', 'name'],
          ['university_reg_no', 'University reg. no', 'text', 'off'],
          ['email', 'Email', 'email', 'email'],
          ['whatsapp', 'WhatsApp number', 'tel', 'tel'],
        ] as const
      ).map(([key, fieldLabel, type, autoComplete]) => {
        const id = `${prefix}-${key}`.replace(/\./g, '-');
        const error = errors[`${prefix}.${key}`];
        return (
          <Field key={key} id={id} label={fieldLabel} error={error}>
            <input
              id={id}
              type={type}
              autoComplete={autoComplete}
              placeholder={key === 'whatsapp' ? '+94 77 123 4567' : undefined}
              value={value[key]}
              onChange={(e) => set(key, e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              className={inputClass}
            />
          </Field>
        );
      })}
    </fieldset>
  );
}

function ReviewPerson({ label, person }: { label: string; person: LeaderPayload }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/50 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand-ink">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{person.name}</p>
      <dl className="mt-1 grid gap-x-4 gap-y-0.5 text-xs text-muted-foreground sm:grid-cols-2">
        <div className="truncate">
          <dt className="sr-only">Registration number</dt>
          <dd>{person.university_reg_no}</dd>
        </div>
        <div className="truncate">
          <dt className="sr-only">WhatsApp</dt>
          <dd>{person.whatsapp}</dd>
        </div>
        <div className="truncate sm:col-span-2">
          <dt className="sr-only">Email</dt>
          <dd>{person.email}</dd>
        </div>
      </dl>
    </div>
  );
}

export default function TeamRegisterForm() {
  const [step, setStep] = useState(TEAM);
  const [teamName, setTeamName] = useState('');
  const [university, setUniversity] = useState('');
  // Smallest option in the team-size select ("3 members"): leader plus two members.
  const [teamSize, setTeamSize] = useState(3);
  const [leader, setLeader] = useState<LeaderPayload>(emptyPerson);
  const [members, setMembers] = useState<MemberPayload[]>([
    { member_number: 2, ...emptyPerson() },
    { member_number: 3, ...emptyPerson() },
  ]);
  const [token, setToken] = useState<string | null>(null);
  // Turnstile tokens are single-use: remount the widget after every attempt.
  const [captchaKey, setCaptchaKey] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Move focus to the step heading so keyboard and screen-reader users land on the new step.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [step, success]);

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

  const validateStep = (target: number): FieldErrors => {
    const next: FieldErrors = {};
    if (target === TEAM) {
      if (teamName.trim().length < 2) next.team_name = 'Enter a team name (at least 2 characters).';
      if (university.trim().length < 2) next.university = 'Enter your university.';
    }
    if (target === LEADER) validatePerson('leader', leader, next);
    if (target === MEMBERS) {
      members.forEach((m, i) => validatePerson(`members.${i}`, m, next));
      // The API rejects a team where two people share an email.
      const seen = new Map<string, string>([[leader.email.trim().toLowerCase(), 'the leader']]);
      members.forEach((m, i) => {
        const email = m.email.trim().toLowerCase();
        if (!email || next[`members.${i}.email`]) return;
        const owner = seen.get(email);
        if (owner) next[`members.${i}.email`] = `This email is already used by ${owner}.`;
        else seen.set(email, `member ${m.member_number}`);
      });
    }
    return next;
  };

  const goNext = () => {
    const stepErrors = validateStep(step);
    setErrors(stepErrors);
    setFormError(null);
    if (Object.keys(stepErrors).length === 0) setStep((s) => Math.min(s + 1, REVIEW));
  };

  const goBack = () => {
    setErrors({});
    setFormError(null);
    setStep((s) => Math.max(s - 1, TEAM));
  };

  const canSubmit = apiConfigured && Boolean(turnstileSiteKey) && Boolean(token) && !pending;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== REVIEW) {
      goNext();
      return;
    }
    setFormError(null);
    setErrors({});

    if (!apiConfigured) {
      setFormError('Registration API is not configured yet.');
      return;
    }
    if (turnstileSiteKey && !token) {
      setFormError('Please complete the CAPTCHA.');
      return;
    }

    setPending(true);
    try {
      const trimPerson = <T extends LeaderPayload>(p: T): T => ({
        ...p,
        name: p.name.trim(),
        university_reg_no: p.university_reg_no.trim(),
        email: p.email.trim(),
        whatsapp: p.whatsapp.trim(),
      });
      const result = await registerTeam({
        team_name: teamName.trim(),
        university: university.trim(),
        team_size: teamSize,
        leader: trimPerson(leader),
        members: members.map((m, i) => trimPerson({ ...m, member_number: i + 2 })),
        cf_turnstile_response: token ?? '',
      });
      setSuccess(
        result.emailSent
          ? `Your team code is on its way to ${leader.email.trim()}. Keep it safe — you’ll need it to submit your proposal once submissions open.`
          : 'We couldn’t email your team code, so please contact the organisers to receive it.',
      );
    } catch (err) {
      if (isApiError(err)) {
        setFormError(err.message);
        if (err.fields) {
          setErrors(err.fields);
          const steps = Object.keys(err.fields).map(stepForField);
          setStep(Math.min(...steps));
        }
      } else {
        setFormError('Could not reach the server. Check your connection and try again.');
      }
    } finally {
      setToken(null);
      setCaptchaKey((k) => k + 1);
      setPending(false);
    }
  };

  const reset = () => {
    setTeamName('');
    setUniversity('');
    setLeader(emptyPerson());
    setMembers([]);
    syncMembers(3);
    setErrors({});
    setFormError(null);
    setSuccess(null);
    setStep(TEAM);
  };

  if (success) {
    return (
      <section className="mx-auto w-full max-w-xl space-y-6 text-left" aria-live="polite">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-brand-ink">
          <Check className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <p className="eyebrow text-brand-ink">Registration complete</p>
          <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-xl font-medium text-foreground outline-none sm:text-2xl">
            {teamName.trim()} is in.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{success}</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[#25D366]/30 bg-gradient-to-br from-[#25D366]/12 via-[#25D366]/5 to-transparent p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md sm:p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#25D366]/20 text-[#25D366] ring-1 ring-[#25D366]/30">
              <WhatsAppIcon size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-medium text-foreground">
                Join the Official Team WhatsApp Group
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Get real-time announcements, delegate updates, and connect directly with the organizing committee. All team members are encouraged to join!
              </p>
              <div className="mt-4">
                <a
                  href={WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-black shadow-md shadow-[#25D366]/20 transition-[transform,box-shadow,background-color] hover:bg-[#20ba5a] hover:shadow-[#25D366]/30 active:scale-95"
                >
                  <WhatsAppIcon size={18} className="shrink-0" />
                  <span>Join WhatsApp Group</span>
                  <ArrowRight size={15} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-border px-6 py-3 text-sm text-foreground transition-colors hover:border-brand/50 hover:bg-white/[.04]"
        >
          Register another team
        </button>
      </section>
    );
  }

  const stepTitle = ['Your team', 'Team leader', 'Team members', 'Review and submit'][step];
  const stepHint = [
    'Teams of 3–4 undergraduates from the same university.',
    'The leader counts as member 1 and receives the team code by email.',
    `Details for the other ${members.length} member${members.length === 1 ? '' : 's'}. Every email must be different.`,
    'Check the details below. You can go back to change anything before you submit.',
  ][step];

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto w-full max-w-xl space-y-6 text-left">
      <div className="space-y-5">
        <div>
          <p className="eyebrow text-brand-ink">Team registration · step {step + 1} of {STEPS.length}</p>
          <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-xl font-medium text-foreground outline-none sm:text-2xl">
            {stepTitle}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{stepHint}</p>
        </div>
        <Stepper step={step} />
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="space-y-4"
      >
        {step === TEAM ? (
          <>
            <Field id="team_name" label="Team name" error={errors.team_name}>
              <input
                id="team_name"
                autoComplete="off"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                aria-invalid={Boolean(errors.team_name)}
                aria-describedby={errors.team_name ? 'team_name-error' : undefined}
                className={inputClass}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="university" label="University" error={errors.university}>
                <input
                  id="university"
                  autoComplete="organization"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  aria-invalid={Boolean(errors.university)}
                  aria-describedby={errors.university ? 'university-error' : undefined}
                  className={inputClass}
                />
              </Field>
              <Field id="team_size" label="Team size" error={errors.team_size}>
                <select
                  id="team_size"
                  value={teamSize}
                  onChange={(e) => syncMembers(Number(e.target.value))}
                  className={inputClass}
                >
                  {[3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} members
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </>
        ) : null}

        {step === LEADER ? (
          <PersonFields prefix="leader" label="Team leader" value={leader} onChange={setLeader} errors={errors} />
        ) : null}

        {step === MEMBERS
          ? members.map((m, i) => (
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
            ))
          : null}

        {step === REVIEW ? (
          <>
            <div className="rounded-2xl border border-border/70 bg-card/50 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand-ink">Team</p>
              <p className="mt-1 text-sm font-medium text-foreground">{teamName.trim()}</p>
              <p className="text-xs text-muted-foreground">
                {university.trim()} · {teamSize} members
              </p>
            </div>
            <ReviewPerson label="Team leader" person={leader} />
            {members.map((m) => (
              <ReviewPerson key={m.member_number} label={`Member ${m.member_number}`} person={m} />
            ))}

            <Turnstile key={captchaKey} onToken={setToken} />
            {!apiConfigured ? (
              <p className="text-sm text-muted-foreground">API base URL is not set — form is wired but inactive.</p>
            ) : null}
            {!turnstileSiteKey ? (
              <p className="text-sm text-muted-foreground">Turnstile site key is not set — submit stays locked.</p>
            ) : null}
            {turnstileSiteKey && !token && !pending ? (
              <p className="text-xs text-muted-foreground">Complete the CAPTCHA to enable submit.</p>
            ) : null}
          </>
        ) : null}
      </motion.div>

      {formError ? (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <div className="flex gap-3">
        {step > TEAM ? (
          <button
            type="button"
            onClick={goBack}
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm text-foreground transition-colors hover:border-brand/50 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
        ) : null}
        <button
          type="submit"
          disabled={step === REVIEW && !canSubmit}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-primary-foreground transition-[box-shadow,transform] hover:shadow-brand enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {step === REVIEW ? (
            pending ? (
              'Registering…'
            ) : (
              'Register team'
            )
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
