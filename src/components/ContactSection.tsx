import { useEffect, useRef, useState, useCallback, type MouseEvent as ReactMouseEvent } from 'react';
import { ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import SectionBackdrop from './SectionBackdrop.tsx';
import ShineBorder from './ui/shine-border.tsx';
import { lift, revealOnce, rise, stagger } from '../motion.ts';

type Chair = {
  name: string;
  role?: string;
  affiliation: string;
  email?: string;
  phone: string;
  photo?: string;
};

/** Spirit X 2.0 contacts. */
const CHAIRS: Chair[] = [
  {
    name: 'Pamudu Chandeepa',
    role: 'CSO – MoraSpirit',
    affiliation: 'MoraSpirit 360',
    email: 'cso@moraspirit.com',
    phone: '+94 71 882 3065',
    photo: '/contact/pamudu.jpeg',
  },
  {
    name: 'Sangeeth Kariyapperuma',
    role: 'Pillar Head – Web & Technology Pillar',
    affiliation: 'MoraSpirit 360',
    email: 'web@moraspirit.com',
    phone: '0760858499',
    photo: '/contact/sangeeth.jpeg',
  },
  {
    name: 'Kusal Pabasara',
    role: 'Assistant Pillar Head – Web & Technology Pillar',
    affiliation: 'MoraSpirit 360',
    email: 'kusalpabasararcg@gmail.com',
    phone: '078 772 0767',
    photo: '/contact/kusal_pabasara.jpeg',
  },
  {
    name: 'Kusal Nirukshan',
    role: 'Co-Chair – SpiritX 2.0',
    affiliation: 'MoraSpirit 360',
    email: 'kusalnirukshan@moraspirit.com',
    phone: '071 114 5121',
    photo: '/contact/kusal_nirukshan.jpeg',
  },
  {
    name: 'Sawani Thiwandika',
    role: 'Co-Chair – SpiritX 2.0',
    affiliation: 'MoraSpirit 360',
    email: 'thiwandika.whs02@gmail.com',
    phone: '076 351 9008',
    photo: '/contact/sawani.jpeg',
  },
  {
    name: 'Pragathi Jayasinghe',
    role: 'Delegate Lead',
    affiliation: 'MoraSpirit 360',
    email: 'pragathijayasinghe@gmail.com',
    phone: '071 581 4164',
    photo: '/contact/pragathi.jpeg',
  },
  {
    name: 'D.G.S Anuchana Jayarathne',
    role: 'Delegate Lead',
    affiliation: 'MoraSpirit 360',
    email: 'shavindaanuchana@gmail.com',
    phone: '070 398 5778',
    photo: '/contact/anuchana.jpeg',
  },
];

/** Three copies so the carousel can wrap around without a visible rewind. */
/** Sri Lankan numbers (0XX… or +94…) to a wa.me link. */
const whatsappHref = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits.startsWith('94') ? digits : `94${digits.replace(/^0/, '')}`}`;
};

const LOOP = [...CHAIRS, ...CHAIRS, ...CHAIRS];

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(false);

  // Mouse drag-to-scroll support
  const [isMouseDown, setIsMouseDown] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  /** Moves to the neighbouring slide by scrolling the track sideways only. `scrollIntoView` is
   *  deliberately avoided: it also scrolls the page, which dragged the whole site down to this
   *  section every time the auto-advance fired. */
  const goToSlide = useCallback((direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    if (slides.length === 0) return;

    const align = getComputedStyle(slides[0]).scrollSnapAlign.split(' ').pop() === 'center' ? 'center' : 'start';
    const box = el.getBoundingClientRect();
    const anchor = align === 'center' ? box.left + box.width / 2 : box.left;
    const pointOf = (slide: HTMLElement) => {
      const r = slide.getBoundingClientRect();
      return align === 'center' ? r.left + r.width / 2 : r.left;
    };

    let current = 0;
    let best = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs(pointOf(slide) - anchor);
      if (dist < best) {
        best = dist;
        current = i;
      }
    });

    const target = slides[Math.min(slides.length - 1, Math.max(0, current + direction))];
    el.scrollBy({ left: pointOf(target) - anchor, behavior: 'smooth' });
  }, []);

  const scrollToNext = useCallback(() => goToSlide(1), [goToSlide]);
  const scrollToPrev = useCallback(() => goToSlide(-1), [goToSlide]);

  // The track holds three copies of the list. Park on the middle copy, and whenever scrolling
  // settles in an outer copy, jump one set-width back to the same card in the middle copy.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const setWidth = () => el.scrollWidth / 3;
    const jump = (delta: number) => {
      el.style.scrollBehavior = 'auto';
      el.style.scrollSnapType = 'none';
      el.scrollLeft += delta;
      requestAnimationFrame(() => {
        el.style.scrollBehavior = '';
        el.style.scrollSnapType = '';
      });
    };
    jump(setWidth());
    let timer: number | undefined;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const w = setWidth();
        if (el.scrollLeft < w * 0.5) jump(w);
        else if (el.scrollLeft > w * 1.5) jump(-w);
      }, 140);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      el.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Only auto-advance while the carousel is actually on screen.
  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Automatic loop swiping to the left
  useEffect(() => {
    const interval = setInterval(() => {
      if (inViewRef.current && !isHoveredRef.current && !isInteractingRef.current) {
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
            Questions about teams, your idea or registration? Reach the people running Spirit X 2.0 directly.
          </motion.p>
        </motion.div>

        {/* Carousel Container with Flanking Left & Right Arrow Buttons */}
        <div
          ref={wrapperRef}
          className="relative mt-10"
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { isHoveredRef.current = false; handleMouseUpOrLeave(); }}
          onTouchStart={() => { isInteractingRef.current = true; }}
          onTouchEnd={() => { isInteractingRef.current = false; }}
        >
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
            {LOOP.map((chair, index) => (
              <motion.li
                key={`${chair.name}-${index}`}
                variants={lift}
                className="contact-slide"
                aria-hidden={index >= CHAIRS.length ? true : undefined}
              >
                <ShineBorder
                  borderWidth={2}
                  duration={3.5}
                  color="hsl(var(--brand-ink))"
                  borderRadius="1.25rem"
                  showOnHover={true}
                  className="contact-card-shine"
                >
                  <div className="contact-card flex flex-col justify-between">
                    <div>
                      <Avatar chair={chair} />
                      <h3 className="mt-6 truncate text-lg font-semibold tracking-tight text-foreground" title={chair.name}>
                        {chair.name}
                      </h3>
                      {chair.role ? (
                        <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-brand-ink">{chair.role}</p>
                      ) : null}
                      {/*<p className="mt-1 truncate text-xs text-muted-foreground">{chair.affiliation}</p>*/}
                    </div>
                    
                    <div className="mt-6 flex flex-col items-center gap-1 border-t border-border/60 pt-4 text-sm">
                      {chair.email ? (
                      <a
                          href={`mailto:${chair.email}`}
                          className="contact-link"
                        tabIndex={index >= CHAIRS.length ? -1 : undefined}
                          title={chair.email}
                          onClick={(e) => {
                            if (isDraggingRef.current) e.preventDefault();
                          }}
                        >
                          <Mail size={14} strokeWidth={1.75} aria-hidden="true" />
                          <span className="truncate">{chair.email}</span>
                        </a>
                      ) : null}
                      <a
                        href={whatsappHref(chair.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${chair.name} on ${chair.phone}`}
                        className="contact-link"
                        tabIndex={index >= CHAIRS.length ? -1 : undefined}
                        onClick={(e) => {
                          if (isDraggingRef.current) e.preventDefault();
                        }}
                      >
                        <Phone size={14} strokeWidth={1.75} aria-hidden="true" />
                        <span className="tabular-nums">{chair.phone}</span>
                      </a>
                    </div>
                  </div>
                </ShineBorder>
              </motion.li>
            ))}
          </motion.ul>

          {/* Left Arrow Button */}
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              scrollToPrev();
            }}
            aria-label="Previous chairperson"
            title="Previous chairperson"
            className="absolute left-1 sm:-left-4 lg:-left-6 top-1/2 z-50 flex h-11 w-11 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-2xl backdrop-blur-md transition-all duration-200 hover:border-brand hover:text-brand hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto select-none touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft size={24} strokeWidth={2.2} />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              scrollToNext();
            }}
            aria-label="Next chairperson"
            title="Next chairperson"
            className="absolute right-1 sm:-right-4 lg:-right-6 top-1/2 z-50 flex h-11 w-11 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-2xl backdrop-blur-md transition-all duration-200 hover:border-brand hover:text-brand hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto select-none touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRight size={24} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </section>
  );
}
