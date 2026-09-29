import { useEffect, useRef } from 'react';

type Dust = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  pulse: number;
  warm: number;
};

export default function HeroDustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let width = 0;
    let height = 0;
    let previous = performance.now();
    let dust: Dust[] = [];

    const createDust = (): Dust => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.35) * 18,
      vy: -(4 + Math.random() * 18),
      radius: 0.7 + Math.random() * 2.1,
      phase: Math.random() * Math.PI * 2,
      pulse: 0.0015 + Math.random() * 0.003,
      warm: Math.random(),
    });

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.round(Math.min(150, Math.max(58, (width * height) / 9500)));
      dust = Array.from({ length: count }, createDust);
    };

    const draw = (now: number) => {
      const delta = Math.min(0.04, (now - previous) / 1000);
      previous = now;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'screen';

      for (const particle of dust) {
        if (!reduceMotion.matches) {
          particle.x += particle.vx * delta;
          particle.y += particle.vy * delta;
        }
        if (particle.y < -12 || particle.x > width + 12 || particle.x < -12) {
          particle.x = Math.random() * width;
          particle.y = height + Math.random() * 60;
        }

        const shimmer = 0.28 + 0.72 * Math.abs(Math.sin(now * particle.pulse + particle.phase));
        const red = 255;
        const green = Math.round(184 + particle.warm * 52);
        const blue = Math.round(72 + particle.warm * 88);
        const glow = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 4.2
        );
        glow.addColorStop(0, `rgba(${red},${green},${blue},${0.92 * shimmer})`);
        glow.addColorStop(0.28, `rgba(255,213,125,${0.48 * shimmer})`);
        glow.addColorStop(1, 'rgba(255,190,70,0)');
        context.fillStyle = glow;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius * 4.2, 0, Math.PI * 2);
        context.fill();

        if (particle.radius > 2.25) {
          context.strokeStyle = `rgba(255,224,151,${0.34 * shimmer})`;
          context.lineWidth = 0.8;
          context.beginPath();
          context.moveTo(particle.x - particle.radius * 5, particle.y);
          context.lineTo(particle.x + particle.radius * 5, particle.y);
          context.moveTo(particle.x, particle.y - particle.radius * 5);
          context.lineTo(particle.x, particle.y + particle.radius * 5);
          context.stroke();
        }
      }

      if (!reduceMotion.matches) frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    draw(previous);

    // Stop the loop while the hero is scrolled away; resume without a time jump.
    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting && !reduceMotion.matches) {
        previous = performance.now();
        frame = requestAnimationFrame(draw);
      }
    });
    visibility.observe(canvas);

    return () => {
      observer.disconnect();
      visibility.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-dust-canvas" aria-hidden="true" />;
}
