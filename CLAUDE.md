# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing and registration site for **Spirit X 2.0**, the inter-university sports-innovation hackathon by the University of Moratuwa and MoraSpirit 360 (https://spiritx.moraspirit.com, deployed on Vercel).

This `live-site` branch is a **Vite + React 18 + TypeScript + Tailwind 3 SPA**. It was the `lithos/` subfolder on the `kusal/night-stadium-redesign` branch, promoted to the repo root. The `AGENTS.md` / `README.md` on `main` and the kusal branch describe an older Astro scaffold and do not apply here; ignore stray `.astro/`, `pnpm-lock.yaml` and `pnpm-workspace.yaml` files — `package-lock.json` (npm) is the tracked lockfile.

## Commands

```bash
npm install
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build → dist/
npm run preview
npx tsc -p tsconfig.app.json --noEmit   # type-check only
```

There is no test suite and no linter. `tsconfig.app.json` is strict with `noUnusedLocals` / `noUnusedParameters`, so unused imports break `npm run build`.

## Environment

Vite public env vars (see `.env.example`, typed in `src/vite-env.d.ts`, read in `src/lib/api.ts`). They must also be set in Vercel project settings, since `.vercelignore` excludes `.env*`:

- `VITE_API_BASE_URL` — FastAPI backend (`spiritx-registration_and_submission`), no trailing slash.
- `VITE_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key. Without it the widget renders nothing and form submit stays disabled.
- `VITE_REGISTRATION_OPEN` — `"true"` swaps the countdown on `#/register` for the live forms.

## Architecture

**Routing** — `src/useHashRoute.ts` is a hand-rolled hash router (`#/`, `#/tracks`, `#/experience`, `#/studio`, `#/register`; anything else falls back to `/`). `App.tsx` switches on it. Links are plain `<a href="#/...">` or `window.location.hash = ...`; there is no router dependency. Adding a page means updating `ROUTES` in `useHashRoute.ts`, `App.tsx`, and the tab lists in `SiteNav.tsx` and `Footer.tsx`. The nav tab for `#/studio` is labelled "stories".

Each page composes its own hero and ends with `<Footer />`. `SiteNav` is absolutely positioned and rendered *inside* each hero section, not at the page level.

**Theming (light/dark)** — driven only by the OS `prefers-color-scheme`; there is no toggle.
- Colour tokens are HSL triplets on `:root` in `src/index.css` (dark "Night Stadium" is the default, light overrides live in a media query). `tailwind.config.js` maps them to Tailwind colours (`background`, `foreground`, `primary`/`brand`, `brand-ink`, `muted`, `border`, …). Use these tokens, not raw colours.
- `brand` is the button fill; `brand-ink` is for brand-blue text, icons and indicators (logo light blue `#74CEDD` on dark, deep blue `#00558F` on light).
- `.stage-dark` re-applies the dark tokens to a subtree so copy stays legible over video in light mode.
- Background art with day/night variants uses `themedArtStyle({ dark, light })` from `src/themedArt.ts` plus the `.themed-art` class (CSS picks the variant, no JS).
- Components that need to *swap elements* per theme (`ChallengeHero`: video vs still image + `HeroDustCanvas`; `Footer`: night tunnel vs daylight video + `OriginalLinePulse`) listen to `matchMedia('(prefers-color-scheme: light)')` in state.
- `Footer` in day mode (`.site-footer.is-day`) re-pins light-on-dark tokens because its media is always dark-ish.

**Styling** — mostly Tailwind utilities. Larger bespoke sections have plain CSS imported by the component: `src/components/footer.css` (`.site-footer`), `src/components/studio.css` (scoped under `.studio-page`). Shared global classes (`.eyebrow`, `.liquid-glass`, `.hero-display`, `.text-legible`, `.spotlight-reveal`, `.ambient-video`, hero keyframes) are in `src/index.css`. Fonts: Readex Pro (sans) and Instrument Serif (`.hero-display`, `font-serif`), both loaded from Google Fonts in `index.html`. Import alias `@/` → `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).

**Motion conventions** — every animation must degrade under `prefers-reduced-motion` (CSS media query or a `matchMedia` check in the effect), and background videos also stop under Save-Data. Follow the existing patterns:
- `AmbientVideo` — muted looping background video. It sets the `muted`/`playsinline` attributes iOS needs, plays only while intersecting, retries playback on first tap, and picks a portrait cut once per mount.
- `ChallengeHero`'s `HeroLoopVideo` — fades the home video through black at its loop seam instead of using `loop`.
- `useSpotlight(ref)` — drives the `.spotlight-reveal` mask through `--spot-x`/`--spot-y` CSS vars (follows the pointer on desktop, drifts on touch), with no React re-renders.
- Tracks page — `ContainerScroll`/`CardTransformed` in `src/components/ui/animated-cards-stack.tsx` (motion `useScroll`). `Tracks.tsx` mirrors its step maths (`STEPS = TRACKS.length + 1`, offset `['start center', 'end end']`) for `scrollToTrack` and the active index; keep them in sync if either changes.
- `#root` uses `overflow-x: clip` (not `hidden`) so `position: sticky` keeps working on Tracks and the Studio gallery.

**Registration backend** — `src/lib/api.ts` is the only network layer:
- `registerTeam` sends a JSON POST to `/teams/register` with `cf_turnstile_response` in the body.
- `submitProposal` sends a multipart POST to `/proposals/` with the Turnstile token under the hyphenated field `cf-turnstile-response`.
- Errors are normalised into `ApiError` (including Pydantic 422 arrays mapped to per-field messages, and 429 rate limiting).
- `Turnstile.tsx` lazy-loads the Cloudflare script once and renders explicitly.
- `RegisterPanel` counts down to `REGISTRATION_OPENS_AT` (1 Nov 2026, +05:30).

**Static assets** — `public/media/` holds videos (each with a `.webp` poster and often a `-portrait` cut) and the day/night artwork. `public/brand/` has the MoraSpirit 360 PNGs, which have opaque backgrounds, so `OrganizerBadge` paints a matching chip. The Spirit X wordmark is inline SVG in `BrandLogo.tsx`: its letters use `currentColor` and the X uses `brand-ink`. SEO, OpenGraph and JSON-LD event metadata live in `index.html`.
