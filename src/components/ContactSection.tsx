import { Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { lift, revealOnce, rise, stagger } from '../motion.ts';

type Chair = {
  name: string;
  role: string;
  affiliation: string;
  email: string;
  /** Display form, e.g. "+94 71 234 5678". The tel: link is derived from it. */
  phone: string;
  /** Portrait under public/, e.g. "/media/team/chair-1.webp". Initials show until it's set. */
  photo?: string;
};

/** PLACEHOLDERS — replace with the real Spirit X 2.0 chairpersons. */
const CHAIRS: Chair[] = [
  {
    name: 'Chairperson Name',
    role: 'Chairperson',
    affiliation: 'Spirit X 2.0 Organising Committee',
    email: 'chair1@moraspirit.com',
    phone: '+94 70 000 0001',
  },
  {
    name: 'Chairperson Name',
    role: 'Chairperson',
    affiliation: 'Spirit X 2.0 Organising Committee',
    email: 'chair2@moraspirit.com',
    phone: '+94 70 000 0002',
  },
  {
    name: 'Chairperson Name',
    role: 'Chairperson',
    affiliation: 'Spirit X 2.0 Organising Committee',
    email: 'chair3@moraspirit.com',
    phone: '+94 70 000 0003',
  },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

function Avatar({ chair }: { chair: Chair }) {
  return (
    <div className="contact-avatar">
      {chair.photo ? (
        <img src={chair.photo} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
      ) : (
        <span aria-hidden="true" className="contact-initials">
          {initials(chair.name)}
        </span>
      )}
    </div>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="contact-section relative isolate">
      <div className="mx-auto max-w-5xl">
        <motion.div {...revealOnce} variants={stagger(0.1)} className="text-center">
          <motion.h2 variants={rise} id="contact-title" className="contact-title">
            Contact us
          </motion.h2>
          <motion.p variants={rise} className="mx-auto mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Questions about teams, tracks or registration? Reach the people running Spirit X 2.0 directly.
          </motion.p>
        </motion.div>

        <motion.ul
          {...revealOnce}
          variants={stagger(0.1, 0.1)}
          className="contact-cards mt-10 sm:mt-14"
          aria-label="Chairpersons"
        >
          {CHAIRS.map((chair) => (
            <motion.li key={chair.email} variants={lift} className="contact-card">
              <Avatar chair={chair} />
              <h3 className="mt-6 truncate text-lg font-semibold tracking-tight" title={chair.name}>
                {chair.name}
              </h3>
              <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-brand-ink">{chair.role}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{chair.affiliation}</p>
              <div className="mt-5 flex flex-col items-center gap-0.5 text-sm">
                <a href={`mailto:${chair.email}`} className="contact-link" title={chair.email}>
                  <Mail size={14} strokeWidth={1.75} aria-hidden="true" />
                  <span className="truncate">{chair.email}</span>
                </a>
                <a href={`tel:${chair.phone.replace(/\s+/g, '')}`} className="contact-link">
                  <Phone size={14} strokeWidth={1.75} aria-hidden="true" />
                  <span className="tabular-nums">{chair.phone}</span>
                </a>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
