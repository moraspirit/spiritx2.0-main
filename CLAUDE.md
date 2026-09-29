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

**Page structure** — the site is one long scrolling home page plus a single form page. `src/pages/Home.tsx` stacks the sections in story order: `ChallengeHero` (`#hero`) → `ChallengeIntro` (`#about`) → `TracksSection` (`#tracks`) → `TimelineSection` (`#timeline`) → `HeroSection` (`#experience`) → `StudioShowcase` + `SpiritGallery` (wrapped in `#stories`) → `RegisterSection` (`#register`) → `Footer`. `src/pages/Register.tsx` (`#/register`) holds the team and proposal forms. `PRODUCT.md` records the audience and design principles behind this ("the story keeps going": nothing should look like an ending before the footer).

**Routing** — `src/useHashRoute.ts` is a hand-rolled hash router with only two real routes, `/` and `/register`. Links to sections are plain `<a href="#tracks">`; `html { scroll-behavior: smooth }` does the scrolling natively, and every section has an `id` from `SECTIONS`. The hook only intervenes when the page changes (it jumps to the requested section after the new page renders), for first-load deep links, and for legacy `#/tracks`, `#/experience`, `#/studio` links, which it rewrites to `#tracks`/`#experience`/`#stories`. Call `useHashRoute()` once, in `App`, and pass the route down; it owns the `hashchange` listener. Use `REGISTER_HREF` from `src/lib/api.ts` for every register CTA: it points at the countdown section until `VITE_REGISTRATION_OPEN` is true, then at `#/register`.

**Nav** — `SiteNav` is rendered once by `App`, `position: fixed`, above every section (sections use `isolate` so their own z-indexes can't cover it). On home, `useScrollSpy` (the last section whose top has passed 40% of the viewport) drives the active tab, and the pill slides between tabs with motion `layoutId="nav-pill"`. `#hero` counts as the "about" tab. Adding a section means: give it an id, add it to `SECTIONS` (useHashRoute), `TABS`/`SPY_IDS` (SiteNav) and the footer columns. Sticky or pinned stages need top padding (~6rem) so their headings clear the fixed nav.

**Theming (light/dark)** — driven only by the OS `prefers-color-scheme`; there is no toggle.
- Colour tokens are HSL triplets on `:root` in `src/index.css` (dark "Night Stadium" is the default, light overrides live in a media query). `tailwind.config.js` maps them to Tailwind colours (`background`, `foreground`, `primary`/`brand`, `brand-ink`, `muted`, `border`, …). Use these tokens, not raw colours.
- `brand` is the button fill; `brand-ink` is for brand-blue text, icons and indicators (logo light blue `#74CEDD` on dark, deep blue `#00558F` on light).
- `.stage-dark` re-applies the dark tokens to a subtree so copy stays legible over video in light mode.
- Background art with day/night variants uses `themedArtStyle({ dark, light })` from `src/themedArt.ts` plus the `.themed-art` class (CSS picks the variant, no JS).
- Components that need to *swap elements* per theme (`ChallengeHero`: video vs still image + `HeroDustCanvas`; `Footer`: night tunnel vs daylight video + `OriginalLinePulse`; `TimelineSection`: stadium clip only in dark) use `usePrefersLight()`.
- `Footer` in day mode (`.site-footer.is-day`) re-pins light-on-dark tokens because its media is always dark-ish.

**Styling** — mostly Tailwind utilities. Larger bespoke sections have plain CSS imported by the component: `src/components/footer.css` (`.site-footer`), `src/components/studio.css` (scoped under `.studio-page`). Shared global classes (`.eyebrow`, `.liquid-glass`, `.hero-display`, `.text-legible`, `.spotlight-reveal`, `.ambient-video`, hero keyframes) are in `src/index.css`. Fonts: Readex Pro (sans) and Instrument Serif (`.hero-display`, `font-serif`), both loaded from Google Fonts in `index.html`. Import alias `@/` → `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).

**Motion conventions** — every animation must degrade under `prefers-reduced-motion` (CSS media query or a `matchMedia` check in the effect), and background videos also stop under Save-Data. Follow the existing patterns:
- `AmbientVideo` — muted looping background video. It sets the `muted`/`playsinline` attributes iOS needs, plays only while intersecting, retries playback on first tap, and picks a portrait cut once per mount.
- `ChallengeHero`'s `HeroLoopVideo` — fades the home video through black at its loop seam instead of using `loop`.
- `useSpotlight(ref)` — drives the `.spotlight-reveal` mask through `--spot-x`/`--spot-y` CSS vars (follows the pointer on desktop, drifts on touch), with no React re-renders.
- Scroll reveals — spread `revealOnce` plus a variant (`rise`, `lift`, `stagger()`) from `src/motion.ts` onto a motion element. `App` wraps everything in `<MotionConfig reducedMotion="user">`. The CSS-keyframe chapter openers (`HeroSection`'s `.hero-anim`, `StudioShowcase`'s studio.css entrances) are paused until motion's `useInView` adds `.in-view` to their `.reveal-scope` / `.studio-page` wrapper.
- `TracksSection` — `ContainerScroll`/`CardTransformed` in `src/components/ui/animated-cards-stack.tsx` (motion `useScroll`). It mirrors their step maths (`STEPS = TRACKS.length + 1`, offset `['start center', 'end end']`) for `scrollToTrack` and the active index; keep them in sync if either changes.
- `TimelineSection` — a pinned stage (`useScroll` over a section `100 + N*85` svh tall) that pans a strip of milestone panels sideways, fills a rail and swaps a ghost numeral. Milestones are the `MILESTONES` array at the top of the file: fill in `when` and `date` as dates are confirmed; `date` drives the "you are here" / "up next" chip. Under reduced motion it renders `StaticTimeline` (a plain grid) instead.
- Continuous loops pause off screen: the home hero video, `HeroDustCanvas`, the gallery auto-spin and the footer's `OriginalLinePulse` all stop when their element leaves the viewport. Keep that property for anything new that animates every frame, since everything now lives on one page.
- `#root` uses `overflow-x: clip` (not `hidden`) so `position: sticky` keeps working for the tracks, timeline and gallery stages.

**Registration backend** — `src/lib/api.ts` is the only network layer:
- `registerTeam` sends a JSON POST to `/teams/register` with `cf_turnstile_response` in the body.
- `submitProposal` sends a multipart POST to `/proposals/` with the Turnstile token under the hyphenated field `cf-turnstile-response`.
- Errors are normalised into `ApiError` (including Pydantic 422 arrays mapped to per-field messages, and 429 rate limiting).
- `Turnstile.tsx` lazy-loads the Cloudflare script once and renders explicitly.
- `RegisterPanel` counts down to `REGISTRATION_OPENS_AT` (1 Nov 2026, +05:30).

**Static assets** — `public/media/` holds videos (each with a `.webp` poster and often a `-portrait` cut) and the day/night artwork. `public/brand/` has the MoraSpirit 360 PNGs, which have opaque backgrounds, so `OrganizerBadge` paints a matching chip. The Spirit X wordmark is inline SVG in `BrandLogo.tsx`: its letters use `currentColor` and the X uses `brand-ink`. SEO, OpenGraph and JSON-LD event metadata live in `index.html`.
