import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import SiteNav from './SiteNav.tsx';
import { type ThemedArt, themedArtStyle } from '../themedArt.ts';
import './studio.css';

const BASE_ART: ThemedArt = {
  dark: '/media/stories-builder.webp',
  light: '/media/stories-builder-light.webp',
};
const REVEAL_ART: ThemedArt = {
  dark: '/media/stories-builder-reveal.webp',
  light: '/media/stories-builder-reveal-light.webp',
};

const HEADLINE =
  'Every podium moment starts as a prototype — the stories behind 48 hours of student-built sports tech.';

const SPOTLIGHT_R = 260;

export default function StudioShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    if (!canvas || !layer) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const mouse = { x: -999, y: -999 };
    const smooth = { x: -999, y: -999 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    let raf = 0;
    const loop = () => {
      smooth.x += (mouse.x - smooth.x) * 0.1;
      smooth.y += (mouse.y - smooth.y) * 0.1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, SPOTLIGHT_R);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.4, 'rgba(255,255,255,1)');
      grad.addColorStop(0.6, 'rgba(255,255,255,0.75)');
      grad.addColorStop(0.75, 'rgba(255,255,255,0.4)');
      grad.addColorStop(0.88, 'rgba(255,255,255,0.12)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.beginPath();
      ctx.arc(smooth.x, smooth.y, SPOTLIGHT_R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      const maskUrl = `url(${canvas.toDataURL()})`;
      layer.style.setProperty('mask-image', maskUrl);
      layer.style.setProperty('-webkit-mask-image', maskUrl);
      layer.style.setProperty('mask-size', '100% 100%');
      layer.style.setProperty('-webkit-mask-size', '100% 100%');

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    raf = requestAnimationFrame(loop);

    // Cancel on unmount so the loop stops encoding frames after navigating away.
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="studio-page">
      <div className="splash" aria-hidden="true">
        <div className="splash-row splash-row-top">
          {Array.from({ length: 5 }, (_, i) => (
            <div className="splash-box" key={`t${i}`} />
          ))}
        </div>
        <div className="splash-row splash-row-bottom">
          {Array.from({ length: 5 }, (_, i) => (
            <div className="splash-box" key={`b${i}`} />
          ))}
        </div>
      </div>

      <main className="hero">
        <div className="hero-big-text creator-text-animate" aria-hidden="true">
          <h2>stories</h2>
        </div>

        <div
          className="hero-base-img hero-image-animate themed-art"
          style={themedArtStyle(BASE_ART)}
        />

        <canvas ref={canvasRef} className="reveal-canvas" />
        <div ref={layerRef} className="hero-reveal-img themed-art" style={themedArtStyle(REVEAL_ART)} />

        <div className="hero-content">
          <div className="hero-content-inner">
            <div className="flex flex-col gap-3">
              <p className="eyebrow">spirit x · stories</p>
              <h1 className="hero-headline">
                {HEADLINE.split(' ').map((word, i) => (
                  <span
                    className="word-reveal"
                    style={{ animationDelay: `${1 + i * 0.05}s` }}
                    key={`${word}-${i}`}
                  >
                    {word}
                  </span>
                ))}
              </h1>
            </div>
            <a href="#/tracks" className="cta-btn cta-animate">
              <span className="cta-btn-bg" />
              <span className="cta-btn-text">explore the tracks</span>
              <span className="cta-btn-circle">
                <ArrowUpRight size={20} strokeWidth={2} />
              </span>
            </a>
          </div>
        </div>

        <SiteNav />
      </main>
    </div>
  );
}
