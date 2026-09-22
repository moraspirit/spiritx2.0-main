import { useState } from 'react';
import './footer.css';
import AmbientVideo from './AmbientVideo.tsx';
import BrandLogo from './BrandLogo.tsx';
import OrganizerLockup from './OrganizerLockup.tsx';

const POSTER = '/media/footer-tunnel.webp';
const VIDEO = '/media/footer-tunnel.mp4';

const HOME = '#/';
const EXPERIENCE = '#/experience';
const STUDIO = '#/studio';
const TRACKS = '#/tracks';
const REGISTER = '#/register';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: HOME },
      { label: 'About', href: HOME },
      { label: 'Tracks', href: TRACKS },
      { label: 'Experience', href: EXPERIENCE },
      { label: 'Stories', href: STUDIO },
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
      { label: '48-Hour Sprint', href: EXPERIENCE },
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

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-media" aria-hidden="true">
        <AmbientVideo className="footer-bg" cut={{ src: VIDEO, poster: POSTER }} lazy />
      </div>

      <div className="footer-inner">
        <div className="footer-grid">
          <div className="brand">
            <div className="brand-lockup">
              <BrandLogo className="brand-logo" label="Spirit X 2.0" />
            </div>

            <OrganizerLockup size="md" forceDark className="mt-4" />

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
