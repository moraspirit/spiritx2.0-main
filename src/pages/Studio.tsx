import StudioShowcase from '../components/StudioShowcase.tsx';
import Footer from '../components/Footer.tsx';
import SpiritGallery from '../components/SpiritGallery.tsx';

export default function Studio() {
  return (
    <div className="min-h-screen bg-background">
      <StudioShowcase />
      <SpiritGallery />
      <Footer />
    </div>
  );
}
