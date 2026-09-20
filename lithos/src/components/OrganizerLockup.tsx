import OrganizerBadge from './OrganizerBadge.tsx';

type OrganizerLockupProps = {
  forceDark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

/** "organised by" + MoraSpirit 360 badge + wordmark. */
export default function OrganizerLockup({
  forceDark = false,
  size = 'sm',
  className = '',
}: OrganizerLockupProps) {
  return (
    <div className={`inline-flex max-w-full items-center gap-2 ${className}`}>
      <span className="eyebrow shrink-0 !tracking-[0.12em] max-[360px]:text-[0.65rem]">
        organised by
      </span>
      <OrganizerBadge size={size} forceDark={forceDark} />
      <span className="min-w-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/90 sm:text-xs">
        MoraSpirit 360
      </span>
    </div>
  );
}
