import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ShineBorderProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Width of the shine border in pixels. Defaults to 2. */
  borderWidth?: number;
  /** Duration of a full 360-degree rotation in seconds. Defaults to 3.5. */
  duration?: number;
  /** Color of the meteor shine beam. Defaults to brand cyan. */
  color?: string | string[];
  /** Border radius of the outer container. Defaults to '1.25rem'. */
  borderRadius?: string;
  /** Whether the shine beam is only displayed on mouse hover. Defaults to true. */
  showOnHover?: boolean;
};

/**
 * ShineBorder (Meteor Beam Animation)
 * Renders an animated rotating conic gradient beam along the border of a card.
 */
export function ShineBorder({
  children,
  className,
  contentClassName,
  borderWidth = 2,
  duration = 3.5,
  color = 'hsl(var(--brand-ink))',
  borderRadius = '1.25rem',
  showOnHover = true,
}: ShineBorderProps) {
  const conicBackground = Array.isArray(color)
    ? `conic-gradient(from 90deg, ${color.join(', ')})`
    : `conic-gradient(from 90deg, transparent 0%, transparent 60%, hsl(var(--brand-ink) / 0.2) 80%, ${color} 100%)`;

  return (
    <>
      <style>{`
        @keyframes rotating-beam {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-rotating-beam {
          animation: rotating-beam var(--duration, 3.5s) linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-rotating-beam {
            animation: none !important;
          }
        }
      `}</style>
      <div
        className={cn(
          'shine-border-wrapper group/shine relative h-full w-full overflow-hidden transition-all duration-300 ease-out',
          className
        )}
        style={{
          borderRadius,
          padding: `${borderWidth}px`,
        } as React.CSSProperties}
      >
        {/* Animated Conic Beam (meteor effect) */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-out',
            showOnHover ? 'opacity-0 group-hover/shine:opacity-100' : 'opacity-100'
          )}
        >
          <div
            className="animate-rotating-beam absolute left-1/2 top-1/2 h-[350%] w-[350%] origin-center"
            style={{
              background: conicBackground,
              filter: 'drop-shadow(0 0 6px hsl(var(--brand-ink) / 0.8))',
              '--duration': `${duration}s`,
            } as React.CSSProperties}
          />
        </div>

        {/* Subtle static border shown by default */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 z-10 border border-border/60 transition-colors duration-300',
            showOnHover && 'group-hover/shine:border-transparent'
          )}
          style={{ borderRadius }}
        />

        {/* Content Layer */}
        <div
          className={cn(
            'relative z-20 h-full w-full bg-card',
            contentClassName
          )}
          style={{
            borderRadius: `calc(${borderRadius} - ${borderWidth}px)`,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default ShineBorder;
