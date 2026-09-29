import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import OrganizerBadge from './OrganizerBadge.tsx';
import SectionBackdrop from './SectionBackdrop.tsx';
import { lift, revealOnce, rise, stagger } from '../motion.ts';

type Partner = {
  name: string;
  /** What they do for the event, shown under the name. */
  role?: string;
  /** Logo under public/, e.g. "/media/partners/acme.svg". The name shows as a wordmark until set. */
  logo?: string;
  /** Renders the MoraSpirit 360 badge (theme-aware) instead of a plain logo. */
  moraspirit?: boolean;
  href?: string;
};

type Tier = { label: string; featured?: boolean; partners: Partner[] };

/** Organisers are real; every other tier is MOCK until partnerships are confirmed. */
const TIERS: Tier[] = [
  {
    label: 'Organised by',
    partners: [
      { name: 'University of Moratuwa', role: 'Host university', href: 'https://uom.lk/' },
      { name: 'MoraSpirit 360', role: 'Organising partner', moraspirit: true, href: 'https://moraspirit.com' },
    ],
  },
  {
    label: 'Title partner',
    featured: true,
    partners: [{ name: 'Title Partner', role: 'Presenting Spirit X 2.0' }],
  },
  {
    label: 'Official partners',
    partners: [
      { name: 'Connectivity Partner', role: 'Official connectivity partner' },
      { name: 'Technology Partner', role: 'Official technology partner' },
      { name: 'Sports Partner', role: 'Official sports partner' },
    ],
  },
  {
    label: 'Knowledge & media',
    partners: [
      { name: 'Knowledge Partner', role: 'Knowledge partner' },
      { name: 'Media Partner', role: 'Official media partner' },
      { name: 'Content Partner', role: 'Visual content partner' },
    ],
  },
];

function PartnerTile({ partner, featured }: { partner: Partner; featured?: boolean }) {
  const body = (
    <>
      <span className="partner-mark">
        {partner.moraspirit ? (
          <OrganizerBadge size={featured ? 'lg' : 'md'} />
        ) : partner.logo ? (
          <img src={partner.logo} alt="" loading="lazy" decoding="async" className="partner-logo" />
        ) : (
          <span className="partner-wordmark">{partner.name}</span>
        )}
      </span>
      <span className="mt-4 block">
        <span className="block text-sm font-medium text-foreground">{partner.name}</span>
        {partner.role ? <span className="mt-0.5 block text-xs text-muted-foreground">{partner.role}</span> : null}
      </span>
    </>
  );

  return (
    <motion.li variants={lift} className={cn('partner-tile', featured && 'is-featured')}>
      {partner.href ? (
        <a href={partner.href} target="_blank" rel="noopener noreferrer" className="partner-tile-inner">
          {body}
        </a>
      ) : (
        <div className="partner-tile-inner">{body}</div>
      )}
    </motion.li>
  );
}

export default function PartnersSection() {
  return (
    <section id="partners" aria-labelledby="partners-title" className="partners-section relative isolate">
      <SectionBackdrop src="/media/bg/partners-stadium-streaks.webp" position="50% 55%" veil={0.74} />
      <div className="mx-auto max-w-6xl">
        <motion.div {...revealOnce} variants={stagger(0.1)} className="max-w-2xl">
          <motion.h2 variants={rise} id="partners-title" className="text-balance text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl">
            Organisers <em className="font-serif font-normal text-brand-ink">&amp; partners.</em>
          </motion.h2>
          <motion.p variants={rise} className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            The institutions and companies putting Spirit X 2.0 on the field.
          </motion.p>
        </motion.div>

        <div className="mt-12 sm:mt-16">
          {TIERS.map((tier) => (
            <div key={tier.label} className="partner-tier">
              <motion.h3 {...revealOnce} variants={rise} className="partner-tier-label">
                {tier.label}
              </motion.h3>
              <motion.ul
                {...revealOnce}
                variants={stagger(0.08)}
                className={cn('partner-grid', tier.featured && 'is-featured')}
              >
                {tier.partners.map((partner) => (
                  <PartnerTile key={partner.name} partner={partner} featured={tier.featured} />
                ))}
              </motion.ul>
            </div>
          ))}
        </div>

        <motion.p {...revealOnce} variants={rise} className="mt-10 text-sm text-muted-foreground">
          Interested in partnering with Spirit X 2.0?{' '}
          <a href="#contact" className="font-medium text-brand-ink underline-offset-4 hover:underline">
            Talk to the organising committee
          </a>
          .
        </motion.p>
      </div>
    </section>
  );
}
