import { useEffect, useRef } from 'react';
import './footer.css';
import AmbientVideo from './AmbientVideo.tsx';
import BrandLogo from './BrandLogo.tsx';
import OrganizerLockup from './OrganizerLockup.tsx';
import { usePrefersLight } from '../usePrefersLight.ts';
import { REGISTER_HREF } from '../lib/api.ts';

const NIGHT = { src: '/media/footer-tunnel.mp4', poster: '/media/footer-tunnel.webp' };
const DAY = { src: '/media/footer-daylight.mp4', poster: '/media/footer-daylight.webp' };

const CONTACT_EMAIL = 'spiritx@moraspirit.com';

/** Only what's still useful at the very bottom; the fixed nav covers the sections. */
const LINKS = [
  { label: 'Register', href: REGISTER_HREF },
  { label: 'Partners', href: '#partners' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
  { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
];

/** MoraSpirit 360's official profiles. */
const SOCIALS = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@moraspirit360',
    path: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.1V8.9l5.2 3.1L10 15.1Z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/MoraSpirit360/',
    path: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z',
  },
];

/** Brightens only the green pixels already in the daylight plate, so one beam travels. */
function OriginalLinePulse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = canvas?.parentElement?.querySelector('video');
    if (!canvas || !video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const width = 480;
    const height = 270;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return;

    const sample = document.createElement('canvas');
    sample.width = width;
    sample.height = height;
    const sampleContext = sample.getContext('2d', { willReadFrequently: true });
    if (!sampleContext) return;

    let mask: Uint8Array | null = null;
    let frame = 0;
    let alive = true;
    const yStart = Math.floor(height * 0.74);

    function capture() {
      if (video!.readyState < 2 || video!.videoWidth === 0) return;
      sampleContext!.drawImage(video!, 0, 0, width, height);
      const pixels = sampleContext!.getImageData(0, 0, width, height).data;
      const next = new Uint8Array(width * height);
      let count = 0;
      for (let y = yStart; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          if (green > 118 && green > red + 16 && green > blue + 8) {
            next[y * width + x] = 1;
            count++;
          }
        }
      }
      if (count > 30) mask = next;
    }

    // Only paint while the footer is on screen.
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible && alive) frame = requestAnimationFrame(paint);
    });
    observer.observe(canvas);

    function paint(now: number) {
      if (!alive || !visible) return;
      if (!mask) capture();
      context!.clearRect(0, 0, width, height);
      if (mask) {
        const image = context!.createImageData(width, height);
        const data = image.data;
        const phase = (now % 3200) / 3200;
        const span = height - yStart;
        for (let y = yStart; y < height; y++) {
          const along = (height - y) / span;
          let distance = Math.abs(along - phase);
          if (distance > 0.5) distance = 1 - distance;
          const glow = Math.exp(-(distance * distance) / 0.01);
          if (glow < 0.05) continue;
          for (let x = 0; x < width; x++) {
            if (!mask[y * width + x]) continue;
            const index = (y * width + x) * 4;
            data[index] = 210 * glow;
            data[index + 1] = 255 * glow;
            data[index + 2] = 120 * glow;
            data[index + 3] = 255 * glow;
          }
        }
        context!.putImageData(image, 0, 0);
      }
      frame = requestAnimationFrame(paint);
    }

    video.addEventListener('loadeddata', capture);
    return () => {
      alive = false;
      observer.disconnect();
      cancelAnimationFrame(frame);
      video.removeEventListener('loadeddata', capture);
    };
  }, []);

  return <canvas ref={canvasRef} className="footer-led-pulse" />;
}

/** Compact closing band: brand, essential links, socials. */
export default function Footer() {
  const light = usePrefersLight();

  return (
    <footer className={light ? 'site-footer is-day' : 'site-footer'} id="site-footer">
      <div className="footer-media" aria-hidden="true">
        <AmbientVideo key={light ? 'day' : 'night'} className="footer-bg" cut={light ? DAY : NIGHT} lazy />
        {light ? <OriginalLinePulse /> : null}
      </div>

      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <BrandLogo className="footer-logo" label="Spirit X 2.0" />
            <OrganizerLockup size="sm" className="mt-4" />
          </div>
        </div>

        <div className="footer-bottom">
          <nav className="footer-links" aria-label="Footer">
            {LINKS.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="socials">
            {SOCIALS.map((s) => (
              <a href={s.href} aria-label={s.label} key={s.label} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>

          <p className="footer-copy">© 2026 Spirit X 2.0 · University of Moratuwa &amp; MoraSpirit 360</p>
        </div>
      </div>
    </footer>
  );
}
