import { useHashRoute } from './useHashRoute.ts';
import Home from './pages/Home.tsx';
import Tracks from './pages/Tracks.tsx';
import Experience from './pages/Experience.tsx';
import Studio from './pages/Studio.tsx';

export default function App() {
  const route = useHashRoute();
  if (route === '/tracks') return <Tracks />;
  if (route === '/experience') return <Experience />;
  if (route === '/studio') return <Studio />;
  return <Home />;
}
