import { MotionConfig } from 'motion/react';
import { useHashRoute } from './useHashRoute.ts';
import SiteNav from './components/SiteNav.tsx';
import Home from './pages/Home.tsx';
import Register from './pages/Register.tsx';

export default function App() {
  const route = useHashRoute();
  return (
    // "user": motion drops transform/layout animation when the OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <SiteNav route={route} />
      {route === '/register' ? <Register /> : <Home />}
    </MotionConfig>
  );
}
