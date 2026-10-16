type OrganizerBadgeProps = {
  /** Visual size of the chip. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Kept for existing callers; the logo is the same on every background. */
  forceDark?: boolean;
};

const SIZE = {
  sm: 'h-7 w-7 sm:h-8 sm:w-8',
  md: 'h-9 w-9 sm:h-10 sm:w-10',
  lg: 'h-12 w-12 sm:h-14 sm:w-14',
} as const;

/**
 * MoraSpirit 360 mark: the white-and-red logo (transparent PNG) on a black rounded-square chip.
 */
export default function OrganizerBadge({ size = 'sm', className = '' }: OrganizerBadgeProps) {
  const dim = SIZE[size];

  return (
    <span
      className={`organizer-badge inline-flex shrink-0 items-center justify-center overflow-hidden ${dim} ${className}`}
      title="MoraSpirit 360"
    >
      <img
        src="/brand/moraspirit360-white-red.webp"
        alt="MoraSpirit 360"
        className="h-full w-full object-contain p-0.5"
        width={56}
        height={56}
        decoding="async"
      />
    </span>
  );
}
