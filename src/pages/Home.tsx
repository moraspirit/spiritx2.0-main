import ChallengeHero from '../components/ChallengeHero.tsx';
import ChallengeIntro from '../components/ChallengeIntro.tsx';
import Footer from '../components/Footer.tsx';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <ChallengeHero />
      <ChallengeIntro />
      <Footer />
    </div>
  );
}
