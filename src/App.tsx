import { MotionConfig } from 'motion/react';
import { useHashRoute } from './useHashRoute.ts';
import SiteNav from './components/SiteNav.tsx';
import Home from './pages/Home.tsx';
import Register from './pages/Register.tsx';
import { ThemeProvider } from './theme.tsx';
import SplashCursor from './components/SplashCursor.tsx';

export default function App() {
  const route = useHashRoute();
  return (
    <ThemeProvider>
      {/* "user": motion drops transform/layout animation when the OS asks for reduced motion. */}
      <MotionConfig reducedMotion="user">
        <SplashCursor
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
        <SiteNav route={route} />
        {route === '/register' ? <Register /> : <Home />}
      </MotionConfig>
    </ThemeProvider>
  );
}
