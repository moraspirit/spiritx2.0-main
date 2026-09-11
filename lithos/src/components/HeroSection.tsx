import { useEffect, useRef, useState } from 'react';
import SiteNav from './SiteNav.tsx';
import { scrollToId } from '../scrollTo.ts';
import { type ThemedArt, themedArtStyle } from '../themedArt.ts';

const BASE_ART: ThemedArt = {
  dark: '/media/experience-sprinter.webp',
  light: '/media/experience-sprinter-light.webp',
};

const REVEAL_ART: ThemedArt = {
  dark: '/media/experience-sprinter-reveal.webp',
  light: '/media/experience-sprinter-reveal-light.webp',
};

const SPOTLIGHT_R = 260;

type RevealLayerProps = {
  art: ThemedArt;
  cursorX: number;
  cursorY: number;
};

function RevealLayer({ art, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Keep the offscreen canvas the size of the viewport so the generated mask
  // maps 1:1 onto the reveal layer.
  useEffect(() => {
    const sizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    return () => window.removeEventListener('resize', sizeCanvas);
  }, []);

  // Repaint the soft spotlight and push it onto the reveal div as a mask.
  useEffect(() => {
    const canvas = canvasRef.current;
    const reveal = revealRef.current;
    if (!canvas || !reveal) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const maskUrl = `url(${canvas.toDataURL()})`;
    reveal.style.setProperty('mask-image', maskUrl);
    reveal.style.setProperty('-webkit-mask-image', maskUrl);
    reveal.style.setProperty('mask-size', '100% 100%');
    reveal.style.setProperty('-webkit-mask-size', '100% 100%');
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        style={{ display: 'none' }}
      />
      <div
        ref={revealRef}
        className="themed-art pointer-events-none absolute inset-0 z-30 bg-cover bg-center bg-no-repeat"
        style={themedArtStyle(art)}
      />
    </>
  );
}

export default function HeroSection() {
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const tick = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-background"
    >
      <div
        className="hero-zoom themed-art absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
        style={themedArtStyle(BASE_ART)}
      />

      <RevealLayer art={REVEAL_ART} cursorX={cursorPos.x} cursorY={cursorPos.y} />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-56 bg-gradient-to-b from-transparent to-background" />

      <div className="pointer-events-none absolute inset-x-0 top-[18%] z-50 flex flex-col items-center px-5 text-center sm:top-[16%]">
        <p className="eyebrow hero-anim hero-fade" style={{ animationDelay: '0.1s' }}>
          the spirit x experience
        </p>
        <h1 className="hero-title mt-4 text-foreground">
          <span
            className="hero-anim hero-reveal block text-5xl font-light sm:text-7xl md:text-8xl"
            style={{ animationDelay: '0.25s' }}
          >
            create unforgettable
          </span>
          <span
            className="hero-anim hero-reveal block text-5xl font-semibold text-volt-ink sm:text-7xl md:text-8xl"
            style={{ animationDelay: '0.42s' }}
          >
            experiences
          </span>
        </h1>
      </div>

      <div
        className="hero-anim hero-fade absolute bottom-14 left-10 z-50 hidden max-w-[260px] sm:block md:left-14"
        style={{ animationDelay: '0.7s' }}
      >
        <p className="text-legible text-sm leading-relaxed text-foreground/85">
          Experience results-driven student innovation anytime, anywhere with Spirit X &mdash; Sri
          Lanka&rsquo;s flagship inter-university hackathon.
        </p>
      </div>

      <div
        className="hero-anim hero-fade absolute bottom-10 left-5 right-5 z-50 flex max-w-full flex-col items-start gap-4 sm:bottom-24 sm:left-auto sm:right-10 sm:max-w-[260px] sm:gap-5 md:right-14"
        style={{ animationDelay: '0.85s' }}
      >
        <p className="text-legible text-xs leading-relaxed text-foreground/85 sm:text-sm">
          48 hours. 200+ hackers. 20+ universities. Built by students, open to every undergraduate
          in Sri Lanka.
        </p>
        <button
          type="button"
          onClick={() => scrollToId('nl-email', { focus: true })}
          className="rounded-full bg-volt px-7 py-3 text-sm font-medium text-primary-foreground transition-[box-shadow,transform] hover:shadow-volt active:scale-95"
        >
          register now
        </button>
      </div>

      <SiteNav />
    </section>
  );
}
