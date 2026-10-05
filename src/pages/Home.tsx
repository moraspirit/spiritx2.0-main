import ChallengeHero from '../components/ChallengeHero.tsx';
import ChallengeIntro from '../components/ChallengeIntro.tsx';
import TracksSection from '../components/TracksSection.tsx';
import TimelineSection from '../components/TimelineSection.tsx';
import PrizesAnnouncedLaterSection from '../components/PrizesAnnouncedLaterSection.tsx';
// Kept for when official prize pool is announced:
// import PrizesSection from '../components/PrizesSection.tsx';
import HeroSection from '../components/HeroSection.tsx';
import StudioShowcase from '../components/StudioShowcase.tsx';
import SpiritGallery from '../components/SpiritGallery.tsx';
import PartnersSection from '../components/PartnersSection.tsx';
import RegisterSection from '../components/RegisterSection.tsx';
import FaqSection from '../components/FaqSection.tsx';
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
      <PrizesAnnouncedLaterSection />
      <HeroSection />
      <div id="stories">
        <StudioShowcase />
        <SpiritGallery />
      </div>
      <PartnersSection />
      <RegisterSection />
      <FaqSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
