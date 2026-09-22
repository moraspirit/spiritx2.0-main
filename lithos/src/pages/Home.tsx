import ChallengeHero from '../components/ChallengeHero.tsx';
import SpiritGallery from '../components/SpiritGallery.tsx';
import Footer from '../components/Footer.tsx';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <ChallengeHero />
      <div className="home-theme-bridge home-theme-bridge--into-gallery" aria-hidden="true" />
      <SpiritGallery />
      <div className="home-theme-bridge home-theme-bridge--into-footer" aria-hidden="true" />
      <Footer />
    </div>
  );
}
