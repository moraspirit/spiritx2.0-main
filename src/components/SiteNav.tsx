import { useEffect, useState, type MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { REGISTER_HREF } from '@/lib/api';
import type { Route } from '../useHashRoute.ts';
import { useScrollSpy } from '../useScrollSpy.ts';
import { EASE_OUT } from '../motion.ts';
import BrandLogo from './BrandLogo.tsx';
import ThemeToggle from './ThemeToggle.tsx';

const TABS = [
  { id: 'about', label: 'about' },
  { id: 'tracks', label: 'tracks' },
  { id: 'timeline', label: 'timeline' },
  { id: 'prizes', label: 'prizes' },
  { id: 'experience', label: 'experience' },
  { id: 'stories', label: 'stories' },
  { id: 'contact', label: 'contact' },
] as const;

// The hero counts as "about", so the pill is already on when the page opens.
const SPY_IDS = ['hero', 'about', 'tracks', 'timeline', 'prizes', 'experience', 'stories', 'register', 'contact'] as const;

const PILL_TRANSITION = { duration: 0.5, ease: EASE_OUT };

/** Fixed top bar shared by every route. On home, a pill follows the section in view. */
export default function SiteNav({ route }: { route: Route }) {
  const onHome = route === '/';
  const spied = useScrollSpy(SPY_IDS, onHome);
  const active = spied === 'hero' ? 'about' : spied;
  const activeLabel = TABS.find((t) => t.id === active)?.label;
  const registerCurrent = route === '/register' || active === 'register';

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [route]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // On home the logo glides back to the top instead of re-routing.
  const onLogo = (e: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (!onHome) return;
    e.preventDefault();
    window.history.replaceState(null, '', window.location.pathname);
    window.scrollTo({ top: 0 });
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 px-3 transition-[padding] duration-500 ease-out sm:px-6 md:px-10',
        scrolled
          ? 'pt-[max(0.5rem,env(safe-area-inset-top))] sm:pt-3'
          : 'pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-6'
      )}
    >
      <nav aria-label="Primary" className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-3">
        <a
          href="#/"
          onClick={onLogo}
          aria-label="Spirit X 2.0 home"
          className="flex min-h-11 min-w-0 items-center rounded-full border border-border bg-card/80 px-3 py-1 text-foreground backdrop-blur-md transition-colors hover:border-brand/40 sm:px-5"
        >
          <BrandLogo className="h-7 w-auto max-w-[42vw] sm:h-10 sm:max-w-none" />
        </a>

        <div className="hidden items-center gap-0.5 rounded-full border border-border bg-card/80 p-1.5 backdrop-blur-md lg:flex">
          {TABS.map((tab) => {
            const isActive = tab.id === active;
            return (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'relative rounded-full px-3 py-2 text-sm transition-colors duration-300 xl:px-5',
                  isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="nav-pill"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-brand"
                    transition={PILL_TRANSITION}
                  />
                ) : null}
                <span className="relative">{tab.label}</span>
              </a>
            );
          })}
          <div className="mx-1 h-4 w-px bg-border/80" aria-hidden="true" />
          <ThemeToggle className="ml-0.5" />
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle variant="icon" className="lg:hidden" />

          <a
            href={REGISTER_HREF}
            aria-current={registerCurrent ? 'location' : undefined}
            className={cn(
              'inline-flex min-h-11 items-center rounded-full bg-brand px-4 py-2.5 text-sm font-medium text-primary-foreground transition-[box-shadow,transform] hover:shadow-brand active:scale-95 sm:px-6 sm:py-3',
              registerCurrent && 'shadow-brand'
            )}
          >
            register
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-card/80 px-3 text-foreground backdrop-blur-md transition-colors hover:border-brand/40 lg:hidden"
          >
            {activeLabel && !open ? (
              <span className="hidden text-sm text-muted-foreground min-[400px]:inline">{activeLabel}</span>
            ) : null}
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={cn(
          'mx-auto mt-2 max-w-7xl rounded-3xl border border-border bg-card/95 backdrop-blur-md transition-[opacity,transform,visibility] duration-300 lg:hidden',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        )}
      >
        <div className="flex flex-col gap-1 p-2">
          {TABS.map((tab) => {
            const isActive = tab.id === active;
            return (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                onClick={() => setOpen(false)}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'flex items-center justify-between rounded-2xl px-5 py-3.5 text-base transition-colors',
                  isActive
                    ? 'bg-secondary font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                {tab.label}
                {isActive ? <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-ink" /> : null}
              </a>
            );
          })}
          <div className="my-1 flex items-center justify-between rounded-2xl bg-secondary/50 px-5 py-3 border border-border/40">
            <span className="text-sm font-medium text-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <a
            href={REGISTER_HREF}
            onClick={() => setOpen(false)}
            className="rounded-2xl bg-brand px-5 py-3.5 text-left text-base font-medium text-primary-foreground"
          >
            register
          </a>
        </div>
      </div>
    </header>
  );
}
