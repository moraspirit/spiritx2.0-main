import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Cut = { src: string; poster: string };

type AmbientVideoProps = {
  /** Landscape cut, used unless `portrait` applies. */
  cut: Cut;
  /** Optional crop for portrait viewports (upright phones and tablets). */
  portrait?: Cut;
  /** Don't download until the clip nears the viewport (below-the-fold videos). */
  lazy?: boolean;
  className?: string;
};

const PORTRAIT_QUERY = '(max-aspect-ratio: 3/4)';

type NetworkInfo = { saveData?: boolean };

/**
 * Muted, looping background video that behaves on phones:
 * - writes the `muted` / `playsinline` attributes iOS checks before allowing
 *   autoplay (React only sets the `muted` property);
 * - when autoplay is refused (iOS Low Power Mode, Android data saver) the poster
 *   stays, the native play button is hidden (see .ambient-video in index.css), and
 *   playback retries on the visitor's first tap;
 * - plays only while on screen, and shows just the poster under reduced motion
 *   or Save-Data.
 */
export default function AmbientVideo({ cut, portrait, lazy = false, className }: AmbientVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  // Picked once per mount: swapping sources on rotate would restart the clip.
  const [{ src, poster }] = useState(() =>
    portrait && window.matchMedia(PORTRAIT_QUERY).matches ? portrait : cut
  );

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    for (const attr of ['muted', 'playsinline', 'webkit-playsinline', 'disablepictureinpicture', 'disableremoteplayback']) {
      video.setAttribute(attr, '');
    }

    const network = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || network?.saveData) return;

    let visible = false;

    function stopRetrying() {
      window.removeEventListener('touchend', retry);
      window.removeEventListener('click', retry);
    }

    function play() {
      if (!visible) return;
      // A refused play() just leaves the poster up until the next tap retries.
      video!.play().then(stopRetrying, () => {});
    }

    function retry() {
      play();
    }

    window.addEventListener('touchend', retry, { passive: true });
    window.addEventListener('click', retry);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else video.pause();
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      stopRetrying();
      video.pause();
    };
  }, []);

  return (
    <video
      ref={ref}
      className={cn('ambient-video', className)}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={lazy ? 'none' : 'metadata'}
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
