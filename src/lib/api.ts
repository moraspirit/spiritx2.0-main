/**
 * Client for spiritx-registration_and_submission FastAPI backend.
 * Set VITE_API_BASE_URL in Vercel (and locally) before opening registration.
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export const registrationOpen = import.meta.env.VITE_REGISTRATION_OPEN === 'true';
/** Shows the team-code login with the proposal and prototype forms on #/register. */
export const submissionsOpen = import.meta.env.VITE_SUBMISSIONS_OPEN === 'true';
/** Every "register" CTA: the form page once open, otherwise the countdown section on home. */
export const REGISTER_HREF = registrationOpen ? '#/register' : '#register';
export const turnstileSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) ?? '';
export const apiConfigured = Boolean(API_BASE);

export type MemberPayload = {
  member_number: number;
  name: string;
  university_reg_no: string;
  email: string;
  whatsapp: string;
};

export type LeaderPayload = {
  name: string;
  university_reg_no: string;
  email: string;
  whatsapp: string;
};

export type TeamRegistrationPayload = {
  team_name: string;
  university: string;
  team_size: number;
  leader: LeaderPayload;
  members: MemberPayload[];
  cf_turnstile_response: string;
};

/** `SX-` plus 32 hex characters, emailed to the team leader at registration. */
export const TEAM_CODE_PATTERN = /^SX-[A-F0-9]{32}$/;

export function normalizeTeamCode(raw: string): string {
  return raw.replace(/\s+/g, '').toUpperCase();
}

export type TeamStatus = {
  team_name: string;
  proposal_submitted: boolean;
  prototype_submitted: boolean;
};

export type ProposalPayload = {
  project_title: string;
  proposal_file: File;
  /** Turnstile token — sent under the hyphenated form field name. */
  turnstileToken: string;
};

export type PrototypePayload = {
  project_title: string;
  github_url: string;
  youtube_url: string;
  description: string;
  cf_turnstile_response: string;
};

export type ApiError = {
  status: number;
  message: string;
  /** Field-level messages when the backend returns a Pydantic 422 array. */
  fields?: Record<string, string>;
};

function detailToMessage(detail: unknown, status: number): { message: string; fields?: Record<string, string> } {
  if (status === 429) {
    return { message: 'Too many submissions from this network. Please wait a minute and try again.' };
  }
  if (status === 401) {
    return { message: 'That team code does not match any registered team.' };
  }
  if (typeof detail === 'string') {
    return { message: detail };
  }
  if (Array.isArray(detail)) {
    const fields: Record<string, string> = {};
    const parts: string[] = [];
    for (const item of detail) {
      if (!item || typeof item !== 'object') continue;
      const loc = Array.isArray((item as { loc?: unknown }).loc)
        ? ((item as { loc: unknown[] }).loc.filter((x) => typeof x === 'string') as string[])
        : [];
      const raw = typeof (item as { msg?: unknown }).msg === 'string' ? (item as { msg: string }).msg : '';
      // Pydantic prefixes custom validator messages with "Value error, ".
      const msg = raw.replace(/^Value error,\s*/, '');
      const key = loc.slice(1).join('.') || loc.join('.') || 'form';
      if (msg) {
        fields[key] = msg;
        parts.push(msg);
      }
    }
    return {
      message: parts[0] ?? 'Please check the form and try again.',
      fields: Object.keys(fields).length ? fields : undefined,
    };
  }
  if (detail && typeof detail === 'object' && 'message' in detail) {
    return { message: String((detail as { message: unknown }).message) };
  }
  return { message: `Request failed (${status}). Please try again.` };
}

async function parseError(res: Response): Promise<ApiError> {
  let detail: unknown;
  try {
    const body = await res.json();
    detail = body?.detail ?? body;
  } catch {
    detail = undefined;
  }
  const { message, fields } = detailToMessage(detail, res.status);
  return { status: res.status, message, fields };
}

export async function registerTeam(
  payload: TeamRegistrationPayload,
): Promise<{ message: string; emailSent: boolean }> {
  if (!API_BASE) throw { status: 0, message: 'API is not configured yet.' } satisfies ApiError;

  const res = await fetch(`${API_BASE}/teams/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw await parseError(res);
  const data = (await res.json()) as { message?: string; email_status?: string };
  return { message: data.message ?? 'Team registered successfully!', emailSent: data.email_status !== 'failed' };
}

/** Checks a team code and returns the team's submission status. 401 means the code is wrong. */
export async function getTeamStatus(teamCode: string): Promise<TeamStatus> {
  if (!API_BASE) throw { status: 0, message: 'API is not configured yet.' } satisfies ApiError;

  const res = await fetch(`${API_BASE}/teams/me`, {
    headers: { Accept: 'application/json', 'X-Team-Code': teamCode },
  });

  if (!res.ok) throw await parseError(res);
  return (await res.json()) as TeamStatus;
}

export async function submitProposal(teamCode: string, payload: ProposalPayload): Promise<{ message: string }> {
  if (!API_BASE) throw { status: 0, message: 'API is not configured yet.' } satisfies ApiError;

  const form = new FormData();
  form.append('project_title', payload.project_title);
  form.append('proposal_file', payload.proposal_file);
  // Proposals router uses the hyphenated Turnstile alias.
  form.append('cf-turnstile-response', payload.turnstileToken);

  const res = await fetch(`${API_BASE}/proposals/`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'X-Team-Code': teamCode },
    body: form,
  });

  if (!res.ok) throw await parseError(res);
  const data = (await res.json()) as { message?: string };
  return { message: data.message ?? 'Proposal submitted successfully.' };
}

export async function submitPrototype(teamCode: string, payload: PrototypePayload): Promise<{ message: string }> {
  if (!API_BASE) throw { status: 0, message: 'API is not configured yet.' } satisfies ApiError;

  const res = await fetch(`${API_BASE}/prototypes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Team-Code': teamCode },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw await parseError(res);
  const data = (await res.json()) as { message?: string };
  return { message: data.message ?? 'Prototype submitted successfully.' };
}

export function isApiError(err: unknown): err is ApiError {
  return Boolean(err && typeof err === 'object' && 'status' in err && 'message' in err);
}
