import Footer from '../components/Footer.tsx';
import AmbientVideo from '../components/AmbientVideo.tsx';
import RegisterPanel from '../components/RegisterPanel.tsx';
import TeamRegisterForm from '../components/TeamRegisterForm.tsx';
import ProposalForm from '../components/ProposalForm.tsx';
import { registrationOpen } from '../lib/api.ts';

const STADIUM = {
  src: '/media/home-stadium.mp4',
  poster: '/media/home-stadium-poster.webp',
};

/** The only page besides home: the team and proposal forms (or the countdown until they open). */
export default function Register() {
  return (
    <div className="min-h-screen bg-background">
      <section className="stage-dark relative min-h-[100svh] overflow-hidden bg-background">
        <AmbientVideo
          className="ambient-drift absolute inset-0 h-full w-full object-cover opacity-55"
          cut={STADIUM}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/80 via-background/55 to-background" />

        <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-0 pt-[max(5.5rem,calc(env(safe-area-inset-top)+4.5rem))] pb-[max(2rem,env(safe-area-inset-bottom))]">
          {registrationOpen ? (
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 sm:px-5 lg:flex-row lg:items-start lg:gap-16">
              <h1 className="sr-only">Register for Spirit X 2.0</h1>
              <TeamRegisterForm />
              <ProposalForm />
            </div>
          ) : (
            <RegisterPanel titleAs="h1" />
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
