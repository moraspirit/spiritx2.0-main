import { useEffect, useRef, useState } from 'react';
import './footer.css';
import AmbientVideo from './AmbientVideo.tsx';
import BrandLogo from './BrandLogo.tsx';
import OrganizerLockup from './OrganizerLockup.tsx';
import { usePrefersLight } from '../usePrefersLight.ts';
import { REGISTER_HREF } from '../lib/api.ts';

const NIGHT = { src: '/media/footer-tunnel.mp4', poster: '/media/footer-tunnel.webp' };
const DAY = { src: '/media/footer-daylight.mp4', poster: '/media/footer-daylight.webp' };

const HOME = '#/';
const ABOUT = '#about';
const TRACKS = '#tracks';
const TIMELINE = '#timeline';
const EXPERIENCE = '#experience';
const STORIES = '#stories';
const REGISTER = REGISTER_HREF;

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: HOME },
      { label: 'About', href: ABOUT },
      { label: 'Tracks', href: TRACKS },
      { label: 'Timeline', href: TIMELINE },
      { label: 'Experience', href: EXPERIENCE },
      { label: 'Stories', href: STORIES },
      { label: 'Register', href: REGISTER },
    ],
  },
  {
    title: 'Tracks',
    links: [
      { label: 'AI & Neural Autonomy', href: TRACKS },
      { label: 'Distributed Web & Mobile', href: TRACKS },
      { label: 'Spatial & Immersive Tech', href: TRACKS },
      { label: 'Earth & Sustainability', href: TRACKS },
      { label: 'Partners', href: HOME },
    ],
  },
  {
    title: 'Experience',
    links: [
      { label: '48-Hour Sprint', href: TIMELINE },
      { label: 'Mentorship', href: EXPERIENCE },
      { label: 'Live Finals', href: EXPERIENCE },
      { label: 'Prize Pool', href: EXPERIENCE },
    ],
  },
];

const SOCIALS = [
  {
    label: 'YouTube',
    path: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.1V8.9l5.2 3.1L10 15.1Z',
  },
  {
    label: 'Facebook',
    path: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z',
  },
  {
    label: 'X',
    path: 'M17.5 3h3.1l-6.8 7.8L21.8 21h-6.3l-4.9-6.4L4.9 21H1.8l7.3-8.3L1.5 3h6.4l4.4 5.9L17.5 3Zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3Z',
  },
  {
    label: 'Instagram',
    path: 'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4 1.3-.1 1.7-.1 4.9-.1Zm0 3.9a5.9 5.9 0 1 0 0 11.8 5.9 5.9 0 0 0 0-11.8Zm0 9.7a3.8 3.8 0 1 1 0-7.6 3.8 3.8 0 0 1 0 7.6Zm7.5-9.9a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z',
  },
];

const LEGAL = ['Privacy Policy', 'Terms & Conditions', 'Press Kit'];

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

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const light = usePrefersLight();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className={light ? 'site-footer is-day' : 'site-footer'} id="site-footer" data-plate={light ? 'daylight' : 'night'}>
      <div className="footer-media" aria-hidden="true">
        <AmbientVideo key={light ? 'day' : 'night'} className="footer-bg" cut={light ? DAY : NIGHT} lazy />
        {light ? <OriginalLinePulse /> : null}
      </div>

      <div className="footer-inner">
        <div className="footer-grid">
          <div className="brand">
            <div className="brand-lockup">
              <BrandLogo className="brand-logo" label="Spirit X 2.0" />
            </div>

            <OrganizerLockup size="md" className="footer-organizer mt-4" />

            <p className="brand-blurb">
              Spirit X 2.0 — the Inter University Hackathon organised by the University of
              Moratuwa and MoraSpirit 360. 48 hours, 200+ hackers, one stage.
            </p>

            <ul className="contact-list">
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.7-.5L12 10.7 19.3 5H4.7ZM20 6.9l-7.4 5.8a1 1 0 0 1-1.2 0L4 6.9v11.6c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V6.9Z" />
                </svg>
                <a href="mailto:hello@moraspirit.com">hello@moraspirit.com</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 5.4 6.5 11.7 6.8 12a1 1 0 0 0 1.4 0c.3-.3 6.8-6.6 6.8-12A7.5 7.5 0 0 0 12 2Zm0 10.2a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Z" />
                </svg>
                <span>University of Moratuwa, Sri Lanka</span>
              </li>
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <nav
              className={`col ${col.title === 'Explore' ? 'footer-quick-links' : 'footer-secondary-col'}`}
              aria-label={col.title}
              key={col.title}
            >
              <h2 className="col-title">{col.title}</h2>
              <ul className="link-list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="newsletter">
            <h2 className="col-title">The Dispatch</h2>
            <p>
              Sign up for early notice on registration, track drops, mentor line-ups &amp; finals
              updates.
            </p>
            <form className="subscribe" onSubmit={handleSubmit}>
              <label className="footer-sr-only" htmlFor="nl-email">
                Email address
              </label>
              <input
                id="nl-email"
                type="email"
                name="email"
                placeholder="Leave your email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" aria-label="Subscribe">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
            <p className="subscribe-note" role="status">
              {subscribed ? "You’re on the list — watch your inbox." : ' '}
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="socials">
            {SOCIALS.map((s) => (
              <a href={HOME} aria-label={s.label} key={s.label}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>

          <p className="footer-domain">
            SPIRIT X 2.0 ·{' '}
            <a href="https://spiritx.moraspirit.com">spiritx.moraspirit.com</a>
          </p>

          <nav className="legal" aria-label="Legal">
            {LEGAL.map((l) => (
              <a href={HOME} key={l}>
                {l}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
