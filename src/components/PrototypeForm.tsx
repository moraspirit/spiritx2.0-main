import { useState } from 'react';
import { Check } from 'lucide-react';
import Turnstile from './Turnstile.tsx';
import { apiConfigured, isApiError, submitPrototype, turnstileSiteKey } from '../lib/api.ts';

type PrototypeFormProps = {
  teamCode: string;
  submitted: boolean;
  onSubmitted: () => void;
};

const inputClass =
  'w-full rounded-xl border border-border bg-background/80 px-3 py-2.5 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/30';

export default function PrototypeForm({ teamCode, submitted, onSubmitted }: PrototypeFormProps) {
  const [projectTitle, setProjectTitle] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [description, setDescription] = useState('');
  const [token, setToken] = useState<string | null>(null);
  // Turnstile tokens are single-use: remount the widget after every attempt.
  const [captchaKey, setCaptchaKey] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const canSubmit = apiConfigured && Boolean(turnstileSiteKey) && Boolean(token) && !pending;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setErrors({});
    setSuccess(null);

    if (!apiConfigured) {
      setFormError('API is not configured yet.');
      return;
    }
    if (turnstileSiteKey && !token) {
      setFormError('Please complete the CAPTCHA.');
      return;
    }

    setPending(true);
    try {
      const result = await submitPrototype(teamCode, {
        project_title: projectTitle.trim(),
        github_url: githubUrl.trim(),
        youtube_url: youtubeUrl.trim(),
        description: description.trim(),
        cf_turnstile_response: token ?? '',
      });
      setSuccess(result.message);
      onSubmitted();
    } catch (err) {
      if (isApiError(err)) {
        setFormError(err.message);
        if (err.fields) setErrors(err.fields);
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
        <h2 className="text-xl font-medium text-foreground sm:text-2xl">Prototype submission</h2>
        <p className="flex items-center gap-2 text-sm text-brand-ink">
          <Check className="h-4 w-4 shrink-0" aria-hidden />
          {success ?? 'Your team’s prototype has been received.'}
        </p>
        <p className="text-sm text-muted-foreground">Each team can submit one prototype, so this step is done.</p>
      </section>
    );
  }

  const fieldError = (key: string) =>
    errors[key] ? <p className="mt-1 text-xs text-destructive">{errors[key]}</p> : null;

  return (
    <form onSubmit={onSubmit} className="w-full space-y-5 text-left">
      <div>
        <h2 className="text-xl font-medium text-foreground sm:text-2xl">Prototype submission</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your public GitHub repository and a YouTube demo video. One submission per team.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground" htmlFor="prototype_title">
          Project title
        </label>
        <input
          id="prototype_title"
          required
          minLength={2}
          maxLength={100}
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className={inputClass}
        />
        {fieldError('project_title')}
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground" htmlFor="github_url">
          GitHub repository
        </label>
        <input
          id="github_url"
          type="url"
          required
          inputMode="url"
          placeholder="https://github.com/owner/repository"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          className={`${inputClass} placeholder:text-muted-foreground`}
        />
        {fieldError('github_url')}
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground" htmlFor="youtube_url">
          YouTube demo video
        </label>
        <input
          id="youtube_url"
          type="url"
          required
          inputMode="url"
          placeholder="https://www.youtube.com/watch?v=…"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className={`${inputClass} placeholder:text-muted-foreground`}
        />
        {fieldError('youtube_url')}
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground" htmlFor="prototype_description">
          Description <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          id="prototype_description"
          rows={4}
          maxLength={5000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} resize-y`}
        />
        {fieldError('description')}
      </div>

      <Turnstile key={captchaKey} onToken={setToken} />

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-full bg-brand px-6 py-3 text-sm font-medium text-primary-foreground transition-[box-shadow,transform] hover:shadow-brand enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Submitting…' : 'Submit prototype'}
      </button>
    </form>
  );
}
