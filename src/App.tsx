import { useHashRoute } from './useHashRoute.ts';
import Home from './pages/Home.tsx';
import Tracks from './pages/Tracks.tsx';
import Experience from './pages/Experience.tsx';
import Studio from './pages/Studio.tsx';
import Register from './pages/Register.tsx';

export default function App() {
  const route = useHashRoute();
  if (route === '/tracks') return <Tracks />;
  if (route === '/experience') return <Experience />;
  if (route === '/studio') return <Studio />;
  if (route === '/register') return <Register />;
  return <Home />;
}
