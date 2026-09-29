type OrganizerBadgeProps = {
  /** Visual size of the chip. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** When true, always use the dark (white-on-black) logo — for `.stage-dark` media. */
  forceDark?: boolean;
};

const SIZE = {
  sm: 'h-7 w-7 sm:h-8 sm:w-8',
  md: 'h-9 w-9 sm:h-10 sm:w-10',
  lg: 'h-12 w-12 sm:h-14 sm:w-14',
} as const;

/**
 * MoraSpirit 360 lockup. Source PNGs have opaque backgrounds (black / white),
 * so the chip paints the matching background and the logo edges disappear.
 */
export default function OrganizerBadge({
  size = 'sm',
  className = '',
  forceDark = false,
}: OrganizerBadgeProps) {
  const dim = SIZE[size];

  if (forceDark) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-black ring-1 ring-white/15 ${dim} ${className}`}
        title="MoraSpirit 360"
      >
        <img
          src="/brand/moraspirit360-dark.png"
          alt="MoraSpirit 360"
          className="h-full w-full object-cover"
          width={56}
          height={56}
          decoding="async"
        />
      </span>
    );
  }

  return (
    <span
      className={`organizer-badge inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-border/60 ${dim} ${className}`}
      title="MoraSpirit 360"
    >
      <picture>
        <source media="(prefers-color-scheme: light)" srcSet="/brand/moraspirit360-light.png" />
        <img
          src="/brand/moraspirit360-dark.png"
          alt="MoraSpirit 360"
          className="h-full w-full object-cover"
          width={56}
          height={56}
          decoding="async"
        />
      </picture>
    </span>
  );
}
