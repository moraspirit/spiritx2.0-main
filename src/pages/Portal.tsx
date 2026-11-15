import Footer from '../components/Footer.tsx';
import AmbientVideo from '../components/AmbientVideo.tsx';
import TeamPortal from '../components/TeamPortal.tsx';
import { REGISTER_HREF, portalOpen } from '../lib/api.ts';

const STADIUM = {
  src: '/media/home-stadium.mp4',
  poster: '/media/home-stadium-poster.webp',
};

/** Team portal (#/portal): team-code login, then the team's open submissions. */
export default function Portal() {
  return (
    <div className="min-h-screen bg-background">
      <section className="stage-dark relative min-h-[100svh] overflow-hidden bg-background">
        <AmbientVideo
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          cut={STADIUM}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/80 via-background/55 to-background" />

        <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 pt-[max(5.5rem,calc(env(safe-area-inset-top)+4.5rem))] pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-5">
          <h1 className="sr-only">Spirit X 2.0 team portal</h1>
          {portalOpen ? (
            <TeamPortal />
          ) : (
            <div className="mx-auto w-full max-w-xl space-y-3 text-left">
              <h2 className="text-balance text-2xl font-medium text-foreground sm:text-3xl">
                Submissions are not open right now.
              </h2>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                The team portal opens when the proposal round starts. Your team code from registration is all you
                need to log in.
              </p>
              <a href={REGISTER_HREF} className="inline-block text-sm text-brand-ink underline-offset-4 hover:underline">
                Register your team
              </a>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
