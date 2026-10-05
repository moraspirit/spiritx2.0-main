import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type SectionBackdropProps = {
  src: string;
  /** `duotone` desaturates and tints the photo in Spirit X blue (for daylight event photos). */
  tone?: 'duotone' | 'natural';
  /** CSS object-position for the crop. */
  position?: string;
  /** Page-colour veil over the photo, 0–1. Higher = quieter. */
  veil?: number;
  /** Custom veil opacity in light mode, 0–1. */
  veilLight?: number;
  /** Spirit X 1.0 photos carry a watermark strip along the bottom; zoom it out of frame. */
  cropWatermark?: boolean;
  /** Keep the photo pinned in view while a tall (pinned) section scrolls past. */
  sticky?: boolean;
  className?: string;
};

/**
 * Atmosphere layer for a section: a photo under a theme-coloured veil whose top
 * and bottom edges melt into the page, so sections blend instead of butting up.
 * Parent must be `relative isolate`; the layer sits behind its content.
 */
export default function SectionBackdrop({
  src,
  tone = 'natural',
  position = 'center',
  veil = 0.82,
  veilLight,
  cropWatermark = false,
  sticky = false,
  className,
}: SectionBackdropProps) {
  const customProps: Record<string, string | number> = {
    '--bd-veil': veil,
  };
  if (veilLight !== undefined) {
    customProps['--bd-veil-light'] = veilLight;
  }

  return (
    <div
      aria-hidden="true"
      className={cn('section-backdrop', tone === 'duotone' && 'is-duotone', sticky && 'has-sticky', className)}
      style={customProps as CSSProperties}
    >
      <div className={cn('section-backdrop-frame', sticky && 'is-sticky')}>
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className={cn('section-backdrop-img', cropWatermark && 'is-cropped')}
          style={{ objectPosition: position }}
        />
        {tone === 'duotone' ? <div className="section-backdrop-tint" /> : null}
        <div className="section-backdrop-veil" />
      </div>
    </div>
  );
}
