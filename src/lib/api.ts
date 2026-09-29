/**
 * Client for spiritx-registration_and_submission FastAPI backend.
 * Set VITE_API_BASE_URL in Vercel (and locally) before opening registration.
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export const registrationOpen = import.meta.env.VITE_REGISTRATION_OPEN === 'true';
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

export type ProposalPayload = {
  team_name: string;
  leader_name: string;
  leader_email: string;
  project_title: string;
  proposal_file: File;
  /** Turnstile token — sent under the hyphenated form field name. */
  turnstileToken: string;
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
      const msg = typeof (item as { msg?: unknown }).msg === 'string' ? (item as { msg: string }).msg : '';
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

export async function registerTeam(payload: TeamRegistrationPayload): Promise<{ message: string }> {
  if (!API_BASE) throw { status: 0, message: 'API is not configured yet.' } satisfies ApiError;

  const res = await fetch(`${API_BASE}/teams/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw await parseError(res);
  const data = (await res.json()) as { message?: string };
  return { message: data.message ?? 'Team registered successfully!' };
}

export async function submitProposal(payload: ProposalPayload): Promise<{ message: string }> {
  if (!API_BASE) throw { status: 0, message: 'API is not configured yet.' } satisfies ApiError;

  const form = new FormData();
  form.append('team_name', payload.team_name);
  form.append('leader_name', payload.leader_name);
  form.append('leader_email', payload.leader_email);
  form.append('project_title', payload.project_title);
  form.append('proposal_file', payload.proposal_file);
  // Proposals router uses the hyphenated Turnstile alias.
  form.append('cf-turnstile-response', payload.turnstileToken);

  const res = await fetch(`${API_BASE}/proposals/`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: form,
  });

  if (!res.ok) throw await parseError(res);
  const data = (await res.json()) as { message?: string };
  return { message: data.message ?? 'Proposal submitted successfully.' };
}

export function isApiError(err: unknown): err is ApiError {
  return Boolean(err && typeof err === 'object' && 'status' in err && 'message' in err);
}
