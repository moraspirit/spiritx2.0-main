import { useEffect, useRef, useState, useCallback, type MouseEvent as ReactMouseEvent } from 'react';
import { ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import SectionBackdrop from './SectionBackdrop.tsx';
import { lift, revealOnce, rise, stagger } from '../motion.ts';

type Chair = {
  name: string;
  role: string;
  affiliation: string;
  email: string;
  phone: string;
  photo?: string;
};

/** 8 Spirit X 2.0 Organizing Committee Chairperson Cards */
const CHAIRS: Chair[] = [
  {
    name: 'Chairperson 1',
    role: 'Overall Chairperson',
    affiliation: 'Spirit X 2.0 Organising Committee',
    email: 'chair1@moraspirit.com',
    phone: '+94 70 000 0001',
    photo: '/media/team/chair-1.webp',
  },
  {
    name: 'Chairperson 2',
    role: 'Co-Chairperson',
    affiliation: 'Spirit X 2.0 Organising Committee',
    email: 'chair2@moraspirit.com',
    phone: '+94 70 000 0002',
    photo: '/media/team/chair-2.webp',
  },
  {
    name: 'Chairperson 3',
    role: 'Co-Chairperson',
    affiliation: 'Spirit X 2.0 Organising Committee',
    email: 'chair3@moraspirit.com',
    phone: '+94 70 000 0003',
    photo: '/media/team/chair-3.webp',
  },
  {
    name: 'Chairperson 4',
    role: 'Lead — Technical',
    affiliation: 'Spirit X 2.0 Organising Committee',
    email: 'chair4@moraspirit.com',
    phone: '+94 70 000 0004',
    photo: '/media/team/chair-4.webp',
  },
  {
    name: 'Chairperson 5',
    role: 'Lead — Operations',
    affiliation: 'Spirit X 2.0 Organising Committee',
    email: 'chair5@moraspirit.com',
    phone: '+94 70 000 0005',
    photo: '/media/team/chair-5.webp',
  },
  {
    name: 'Chairperson 6',
    role: 'Lead — Partnerships',
    affiliation: 'Spirit X 2.0 Organising Committee',
    email: 'chair6@moraspirit.com',
    phone: '+94 70 000 0006',
    photo: '/media/team/chair-6.webp',
  },
  {
    name: 'Chairperson 7',
    role: 'Lead — Public Relations',
    affiliation: 'Spirit X 2.0 Organising Committee',
    email: 'chair7@moraspirit.com',
    phone: '+94 70 000 0007',
    photo: '/media/team/chair-7.webp',
  },
  {
    name: 'Chairperson 8',
    role: 'Lead — Logistics',
    affiliation: 'Spirit X 2.0 Organising Committee',
    email: 'chair8@moraspirit.com',
    phone: '+94 70 000 0008',
    photo: '/media/team/chair-8.webp',
  },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

function Avatar({ chair }: { chair: Chair }) {
  const [imgError, setImgError] = useState(false);
  const showPhoto = Boolean(chair.photo && !imgError);

  return (
    <div className="contact-avatar">
      {showPhoto ? (
        <img
          src={chair.photo}
          alt={chair.name}
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <span aria-hidden="true" className="contact-initials">
          {initials(chair.name)}
        </span>
      )}
    </div>
  );
}

export default function ContactSection() {
  const scrollRef = useRef<HTMLUListElement>(null);
  const isHoveredRef = useRef(false);
  const isInteractingRef = useRef(false);

  // Mouse drag-to-scroll support
  const [isMouseDown, setIsMouseDown] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const scrollToNext = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const child = el.firstElementChild as HTMLElement | null;
    const cardWidth = child ? child.getBoundingClientRect().width + 20 : 340;

    // If near or at the end, smoothly loop back to the first card
    if (el.scrollLeft >= maxScroll - 15) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }, []);

  const scrollToPrev = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const child = el.firstElementChild as HTMLElement | null;
    const cardWidth = child ? child.getBoundingClientRect().width + 20 : 340;

    // If near or at the start, loop around to the end
    if (el.scrollLeft <= 15) {
      el.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  }, []);

  // Automatic loop swiping to the left
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHoveredRef.current && !isInteractingRef.current) {
        scrollToNext();
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [scrollToNext]);

  // Mouse drag handlers for desktop swipe feel
  const handleMouseDown = (e: ReactMouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    isInteractingRef.current = true;
    setIsMouseDown(true);
    isDraggingRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    startScrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!isMouseDown) return;
    const el = scrollRef.current;
    if (!el) return;

    const x = e.pageX - el.offsetLeft;
    const walk = x - startXRef.current;

    if (Math.abs(walk) > 5) {
      isDraggingRef.current = true;
    }

    if (isDraggingRef.current) {
      e.preventDefault();
      el.scrollLeft = startScrollLeftRef.current - walk;
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
    setTimeout(() => {
      isDraggingRef.current = false;
      isInteractingRef.current = false;
    }, 50);
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="contact-section relative isolate">
      <SectionBackdrop src="/media/gallery/10.webp" tone="duotone" position="50% 30%" veil={0.86} cropWatermark />
      
      <div className="mx-auto max-w-6xl px-1 sm:px-4">
        {/* Header with Title and Subtitle */}
        <motion.div {...revealOnce} variants={stagger(0.1)} className="text-center">
          <motion.h2 variants={rise} id="contact-title" className="contact-title">
            Contact us
          </motion.h2>
          <motion.p variants={rise} className="mx-auto mt-2 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Questions about teams, tracks or registration? Reach the people running Spirit X 2.0 directly.
          </motion.p>
        </motion.div>

        {/* Carousel Container with Flanking Left & Right Arrow Buttons */}
        <div
          className="relative mt-10"
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { isHoveredRef.current = false; handleMouseUpOrLeave(); }}
          onTouchStart={() => { isInteractingRef.current = true; }}
          onTouchEnd={() => { isInteractingRef.current = false; }}
        >
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={scrollToPrev}
            aria-label="Previous chairperson"
            title="Previous chairperson"
            className="absolute -left-3 sm:-left-5 top-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-xl backdrop-blur-md transition-all duration-200 hover:border-brand hover:text-brand hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft size={24} strokeWidth={2.2} />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={scrollToNext}
            aria-label="Next chairperson"
            title="Next chairperson"
            className="absolute -right-3 sm:-right-5 top-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-xl backdrop-blur-md transition-all duration-200 hover:border-brand hover:text-brand hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRight size={24} strokeWidth={2.2} />
          </button>

          {/* Swipeable / Scrollable Slider Track */}
          <motion.ul
            {...revealOnce}
            variants={stagger(0.08, 0.08)}
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            className="contact-slider-track cursor-grab active:cursor-grabbing px-2 sm:px-4"
            aria-label="Chairpersons"
          >
            {CHAIRS.map((chair, index) => (
              <motion.li
                key={`${chair.email}-${index}`}
                variants={lift}
                className="contact-slide"
              >
                <div className="contact-card flex flex-col justify-between">
                  <div>
                    <Avatar chair={chair} />
                    <h3 className="mt-6 truncate text-lg font-semibold tracking-tight text-foreground" title={chair.name}>
                      {chair.name}
                    </h3>
                    <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-brand-ink">{chair.role}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{chair.affiliation}</p>
                  </div>
                  
                  <div className="mt-6 flex flex-col items-center gap-1 border-t border-border/60 pt-4 text-sm">
                    <a
                      href={`mailto:${chair.email}`}
                      className="contact-link"
                      title={chair.email}
                      onClick={(e) => {
                        if (isDraggingRef.current) e.preventDefault();
                      }}
                    >
                      <Mail size={14} strokeWidth={1.75} aria-hidden="true" />
                      <span className="truncate">{chair.email}</span>
                    </a>
                    <a
                      href={`tel:${chair.phone.replace(/\s+/g, '')}`}
                      className="contact-link"
                      onClick={(e) => {
                        if (isDraggingRef.current) e.preventDefault();
                      }}
                    >
                      <Phone size={14} strokeWidth={1.75} aria-hidden="true" />
                      <span className="tabular-nums">{chair.phone}</span>
                    </a>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
