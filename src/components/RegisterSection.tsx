import AmbientVideo from './AmbientVideo.tsx';
import RegisterPanel from './RegisterPanel.tsx';

const STADIUM = {
  src: '/media/home-stadium.mp4',
  poster: '/media/home-stadium-poster.webp',
};

/** Final chapter of home: countdown before registration opens, a CTA to #/register after. */
export default function RegisterSection() {
  return (
    <section
      id="register"
      aria-label="Registration"
      className="stage-dark relative isolate flex min-h-[100svh] items-center overflow-hidden bg-background"
    >
      <AmbientVideo
        className="ambient-drift absolute inset-0 h-full w-full object-cover opacity-55"
        cut={STADIUM}
        lazy
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/55 to-background" />
      <div className="relative z-10 w-full px-0 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
        <RegisterPanel />
      </div>
    </section>
  );
}
