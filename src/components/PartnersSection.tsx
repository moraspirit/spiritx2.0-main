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
  /** Show the logo in its own colours instead of the muted greyscale treatment. */
  fullColour?: boolean;
  href?: string;
};

type Tier = { label: string; featured?: boolean; partners: Partner[] };

/** Only confirmed partners are listed. */
const TIERS: Tier[] = [
  {
    label: 'Organized by',
    partners: [
      { name: 'MoraSpirit 360', role: 'Organizing partner', moraspirit: true, href: 'https://moraspirit.com' },
    ],
  },
  {
    label: 'Bronze partner',
    partners: [{ name: 'Circles', role: 'Bronze partner', logo: '/partners/circles-horizontal.webp', fullColour: true }],
  },
];

function PartnerTile({ partner, featured }: { partner: Partner; featured?: boolean }) {
  const body = (
    <>
      <span className="partner-mark">
        {partner.moraspirit ? (
          <OrganizerBadge size="lg" />
        ) : partner.logo ? (
          <img src={partner.logo} alt="" loading="lazy" decoding="async" className={cn('partner-logo', partner.fullColour && 'is-full-colour')} />
        ) : (
          <span className="partner-wordmark">{partner.name}</span>
        )}
      </span>
      <span className="mt-4 block text-center">
        <span className="block text-sm font-medium text-foreground">{partner.name}</span>
        {partner.role ? <span className="mt-0.5 block text-xs text-muted-foreground">{partner.role}</span> : null}
      </span>
    </>
  );

  return (
    <motion.li variants={lift} className={cn('partner-tile list-none', featured && 'is-featured')}>
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
  const leftTier = TIERS[0];
  const rightTier = TIERS[1];

  return (
    <section id="partners" aria-labelledby="partners-title" className="partners-section relative isolate">
      <SectionBackdrop src="/media/bg/partners-stadium-streaks.webp" position="50% 55%" veil={0.74} />
      <div className="mx-auto max-w-6xl">
        <motion.div {...revealOnce} variants={stagger(0.1)} className="max-w-2xl">
          <motion.h2 variants={rise} id="partners-title" className="text-balance text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl">
            Organizers <em className="font-serif font-normal text-brand-ink">&amp; partners.</em>
          </motion.h2>
          <motion.p variants={rise} className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            The people putting Spirit X 2.0 on the field.
          </motion.p>
        </motion.div>

        <div className="partner-showcase mt-12 sm:mt-16">
          {/* Mobile titles header (< md) */}
          <div className="partner-mobile-titles flex md:hidden items-center justify-between pb-3 px-1">
            <motion.h3 {...revealOnce} variants={rise} className="partner-tier-label text-left">
              {leftTier.label}
            </motion.h3>
            <motion.h3 {...revealOnce} variants={rise} className="partner-tier-label text-right">
              {rightTier.label}
            </motion.h3>
          </div>

          <div className="partner-showcase-row">
            {/* Desktop Left Tier Title: aligned left */}
            <div className="partner-side-title is-left hidden md:flex items-center justify-start">
              <motion.h3 {...revealOnce} variants={rise} className="partner-tier-label text-left">
                {leftTier.label}
              </motion.h3>
            </div>

            {/* Badges in ONE row: centered */}
            <motion.ul
              {...revealOnce}
              variants={stagger(0.08)}
              className="partner-badges-center"
            >
              {leftTier.partners.map((partner) => (
                <PartnerTile key={partner.name} partner={partner} featured={leftTier.featured} />
              ))}
              {rightTier.partners.map((partner) => (
                <PartnerTile key={partner.name} partner={partner} featured={rightTier.featured} />
              ))}
            </motion.ul>

            {/* Desktop Right Tier Title: aligned right */}
            <div className="partner-side-title is-right hidden md:flex items-center justify-end">
              <motion.h3 {...revealOnce} variants={rise} className="partner-tier-label text-right">
                {rightTier.label}
              </motion.h3>
            </div>
          </div>
        </div>

        <motion.p {...revealOnce} variants={rise} className="mt-10 text-sm text-muted-foreground">
          Interested in partnering with Spirit X 2.0?{' '}
          <a href="#contact" className="font-medium text-brand-ink underline-offset-4 hover:underline">
            Talk to the organizing committee
          </a>
          .
        </motion.p>
      </div>
    </section>
  );
}
