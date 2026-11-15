/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  readonly VITE_REGISTRATION_OPEN?: string;
  readonly VITE_PROPOSALS_OPEN?: string;
  readonly VITE_PROTOTYPES_OPEN?: string;
  readonly VITE_PROPOSAL_DEADLINE?: string;
  readonly VITE_WHATSAPP_GROUP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
