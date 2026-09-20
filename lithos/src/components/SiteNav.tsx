import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHashRoute } from '../useHashRoute.ts';
import BrandLogo from './BrandLogo.tsx';

const TABS = [
  { label: 'about', href: '#/', route: '/' },
  { label: 'tracks', href: '#/tracks', route: '/tracks' },
  { label: 'experience', href: '#/experience', route: '/experience' },
  { label: 'stories', href: '#/studio', route: '/studio' },
];

/** Shared top bar for every route. */
export default function SiteNav() {
  const route = useHashRoute();
  const [open, setOpen] = useState(false);

  // First tab pointing at the current route wins, so exactly one reads as active.
  const activeIndex = TABS.findIndex((t) => t.route === route);

  useEffect(() => setOpen(false), [route]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const goRegister = () => {
    setOpen(false);
    window.location.hash = '#/register';
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:pt-6 md:px-10">
      <nav aria-label="Primary" className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-3">
        <a
          href="#/"
          aria-label="Spirit X 2.0 home"
          className="flex min-h-11 min-w-0 items-center rounded-full border border-border bg-card/80 px-3 py-1 text-foreground backdrop-blur-md transition-colors hover:border-brand/40 sm:px-5"
        >
          <BrandLogo className="h-7 w-auto max-w-[42vw] sm:h-10 sm:max-w-none" />
        </a>

        <div className="hidden items-center gap-1 rounded-full border border-border bg-card/80 p-1.5 backdrop-blur-md md:flex">
          {TABS.map((tab, i) => (
            <a
              key={tab.label}
              href={tab.href}
              aria-current={i === activeIndex ? 'page' : undefined}
              className={cn(
                'rounded-full px-5 py-2 text-sm transition-colors',
                i === activeIndex
                  ? 'bg-brand font-medium text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              {tab.label}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={goRegister}
            className="min-h-11 rounded-full bg-brand px-4 py-2.5 text-sm font-medium text-primary-foreground transition-[box-shadow,transform] hover:shadow-brand active:scale-95 sm:px-6 sm:py-3"
          >
            register
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur-md transition-colors hover:border-brand/40 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={cn(
          'mx-auto mt-2 max-w-7xl rounded-3xl border border-border bg-card/95 backdrop-blur-md transition-all duration-300 md:hidden',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        )}
      >
        <div className="flex flex-col gap-1 p-2">
          {TABS.map((tab, i) => (
            <a
              key={tab.label}
              href={tab.href}
              aria-current={i === activeIndex ? 'page' : undefined}
              className={cn(
                'rounded-2xl px-5 py-3.5 text-base transition-colors',
                i === activeIndex
                  ? 'bg-brand font-medium text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              {tab.label}
            </a>
          ))}
          <button
            type="button"
            onClick={goRegister}
            className="rounded-2xl bg-brand px-5 py-3.5 text-left text-base font-medium text-primary-foreground"
          >
            register
          </button>
        </div>
      </div>
    </header>
  );
}
