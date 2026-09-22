import OrganizerBadge from './OrganizerBadge.tsx';

type OrganizerLockupProps = {
  forceDark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

/** Event ownership lockup: University of Moratuwa + MoraSpirit 360. */
export default function OrganizerLockup({
  forceDark = false,
  size = 'sm',
  className = '',
}: OrganizerLockupProps) {
  return (
    <div className={`inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 ${className}`}>
      <span className="eyebrow shrink-0 !tracking-[0.12em] max-[360px]:text-[0.62rem]">
        organised by
      </span>
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground/95 sm:text-xs">
        University of Moratuwa
      </span>
      <span aria-hidden="true" className="hidden h-4 w-px bg-foreground/25 sm:block" />
      <span className="inline-flex shrink-0 items-center gap-2">
        <OrganizerBadge size={size} forceDark={forceDark} />
        <span className="min-w-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/90 sm:text-xs">
          MoraSpirit 360
        </span>
      </span>
    </div>
  );
}
