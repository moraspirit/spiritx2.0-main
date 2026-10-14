/** Smooth-scroll to an element by id, honouring prefers-reduced-motion. */
export function scrollToId(id: string, opts: { focus?: boolean } = {}) {
  const el = document.getElementById(id);
  if (!el) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.__lenis && !reduce) {
    window.__lenis.scrollTo(el, {
      offset: opts.focus ? -window.innerHeight / 4 : -70,
      duration: 1.2,
    });
  } else {
    el.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: opts.focus ? 'center' : 'start',
    });
  }

  if (opts.focus && el instanceof HTMLElement) {
    // Wait for the smooth scroll to settle before stealing focus.
    window.setTimeout(() => el.focus({ preventScroll: true }), reduce ? 0 : 600);
  }
}
