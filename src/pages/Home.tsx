import ChallengeHero from '../components/ChallengeHero.tsx';
import ChallengeIntro from '../components/ChallengeIntro.tsx';
import TracksSection from '../components/TracksSection.tsx';
import TimelineSection from '../components/TimelineSection.tsx';
import HeroSection from '../components/HeroSection.tsx';
import StudioShowcase from '../components/StudioShowcase.tsx';
import SpiritGallery from '../components/SpiritGallery.tsx';
import RegisterSection from '../components/RegisterSection.tsx';
import ContactSection from '../components/ContactSection.tsx';
import Footer from '../components/Footer.tsx';

/** The whole story on one scroll. Section ids match SECTIONS in useHashRoute.ts. */
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <ChallengeHero />
      <ChallengeIntro />
      <TracksSection />
      <TimelineSection />
      <HeroSection />
      <div id="stories">
        <StudioShowcase />
        <SpiritGallery />
      </div>
      <RegisterSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
