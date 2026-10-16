import { lazy, Suspense, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { useHashRoute } from './useHashRoute.ts';
import SiteNav from './components/SiteNav.tsx';
import Home from './pages/Home.tsx';
import { ThemeProvider } from './theme.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';
import SmoothScroll from './components/SmoothScroll.tsx';

const Register = lazy(() => import('./pages/Register.tsx'));
const SplashCursor = lazy(() => import('./components/SplashCursor.tsx'));

function checkDesktopPointer(): boolean {
  if (typeof window === 'undefined') return false;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth < 1024;
  return isFinePointer && !isCoarse && !isMobileUA && !isSmallScreen;
}

export default function App() {
  const route = useHashRoute();
  const [hasDesktopCursor, setHasDesktopCursor] = useState(checkDesktopPointer);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const update = () => setHasDesktopCursor(checkDesktopPointer());
    const mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const mqCoarse = window.matchMedia('(pointer: coarse)');

    window.addEventListener('resize', update, { passive: true });
    mqFine.addEventListener?.('change', update);
    mqCoarse.addEventListener?.('change', update);

    return () => {
      window.removeEventListener('resize', update);
      mqFine.removeEventListener?.('change', update);
      mqCoarse.removeEventListener?.('change', update);
    };
  }, []);

  // Take the cursor effect off the page while scrolling, then mount it again once scrolling stops.
  useEffect(() => {
    if (!hasDesktopCursor) return;
    let timer = 0;
    const onScroll = () => {
      setScrolling(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setScrolling(false), 160);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasDesktopCursor]);

  return (
    <ThemeProvider>
      {/* "user": motion drops transform/layout animation when the OS asks for reduced motion. */}
      <MotionConfig reducedMotion="user">
        <SmoothScroll>
          {hasDesktopCursor && (
            <Suspense fallback={null}>
              <SplashCursor
                hidden={scrolling}
                DENSITY_DISSIPATION={2.2}
                VELOCITY_DISSIPATION={1.8}
                PRESSURE={0.1}
                CURL={3}
                SPLAT_RADIUS={0.18}
                SPLAT_FORCE={5000}
                COLOR_UPDATE_SPEED={10}
                SHADING
                RAINBOW_MODE={false}
                COLOR="#7C3AED"
                COLOR_PALETTE={['#4C1D95', '#1E3A8A', '#0369A1', '#6B21A8', '#0F172A']}
              />
            </Suspense>
          )}
          <SiteNav route={route} />
          {route === '/register' ? (
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Register />
            </Suspense>
          ) : (
            <Home />
          )}
          <ScrollToTop />
        </SmoothScroll>
      </MotionConfig>
    </ThemeProvider>
  );
}
