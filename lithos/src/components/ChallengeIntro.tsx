import { ArrowUpRight, Orbit, Radio, Layers } from 'lucide-react';

const ideas = [
  { icon: Orbit, title: 'Understand the athlete.', copy: 'Explore how intelligent agents and data can help athletes train, recover, and perform.', tag: 'Intelligence / performance' },
  { icon: Radio, title: 'Connect the crowd.', copy: 'Bring the energy of the game closer with connected experiences for fans and communities.', tag: 'Connection / experience' },
  { icon: Layers, title: 'Reimagine the field.', copy: 'Turn physical spaces into new possibilities through tracking, simulation, and digital twins.', tag: 'Spatial / innovation' },
];

export default function ChallengeIntro() {
  return (
    <section className="challenge-intro" aria-labelledby="challenge-intro-title">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">The next move is yours</p>
            <h2 id="challenge-intro-title" className="text-4xl font-medium leading-tight tracking-tight sm:text-5xl">From a bold idea<br />to a better <em className="font-serif font-normal text-brand-ink">game.</em></h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">A meeting point for sport, technology, and student ambition. Find the problem that matters to you. Build what comes next.</p>
        </div>
        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3">
          {ideas.map(({ icon: Icon, title, copy, tag }, i) => (
            <a href="#/tracks" key={title} className="challenge-idea group">
              <div className="mb-9 flex items-center justify-between"><Icon size={25} strokeWidth={1.4} className="text-brand-ink" /><span className="font-mono text-xs text-muted-foreground">0{i + 1}</span></div>
              <p className="mb-3 text-[10px] uppercase tracking-widest text-brand-ink">{tag}</p>
              <h3 className="text-xl font-medium">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium">Explore the tracks <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
            </a>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-sm">
          <p className="text-muted-foreground">Every new idea starts with a shared story.</p>
          <a href="#/studio" className="inline-flex min-h-11 items-center gap-2 font-medium text-brand-ink">Meet the Spirit X community <ArrowUpRight size={17} /></a>
        </div>
      </div>
    </section>
  );
}
