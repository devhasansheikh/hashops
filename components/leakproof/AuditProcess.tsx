import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

const STEPS = [
  {
    week: "Week 0",
    title: "Kickoff and data request",
    desc: "Engagement letter and confidentiality signed before any data moves. Then a data request your own team can export in an afternoon: no passwords, no bank logins, no write access to anything.",
    icon: (
      <path d="M9 12.5l2 2 4-4.5M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v4h4" />
    ),
  },
  {
    week: "Week 1",
    title: "Rebuild the record",
    desc: "We read every active contract and build the Scope Ledger: what each client is actually paying for, in one place, usually for the first time. Then the true loaded cost of an hour of your team's time, so margin means something.",
    icon: (
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5zM4 18.5A2.5 2.5 0 0 1 6.5 16H20M8 7.5h8M8 11h5" />
    ),
  },
  {
    week: "Week 2",
    title: "Run the reconciliation",
    desc: "Promised, delivered and billed, lined up per client, per month, across twelve months. Every mismatch valued at your own contracted rates and pinned to the record that proves it.",
    icon: (
      <path d="M4 6h16M4 12h16M4 18h16M8 4v4M12 10v4M16 16v4" />
    ),
  },
  {
    week: "Week 3",
    title: "Findings and decisions",
    desc: "You get the written report, then a 90-minute working session. We walk the ranked list together and you decide each item on the spot. You leave with a decision log and named owners, not a slide deck.",
    icon: (
      <path d="M12 3l8 4v5c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V7l8-4zM9 12l2 2 4-4.5" />
    ),
  },
];

export function AuditProcess() {
  return (
    <section id="process" className="relative px-5 py-24 sm:px-8">
      {/* soft ambient glow behind the grid */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[min(900px,100%)] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at center, var(--flame-glow), transparent 70%)",
        }}
        aria-hidden
      />

      <SectionHead
        index="04"
        eyebrow="The procedure"
        title={
          <>
            Three weeks from exports{" "}
            <span className="serif-accent gradient-text">to decisions.</span>
          </>
        }
        lead="A fixed procedure, followed exactly, on data your team already has. Nobody changes how they work while it runs."
      />

      <div className="mx-auto mt-14 grid max-w-content gap-5 sm:grid-cols-2">
        {STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.08} className="h-full">
            <article className="surface-card surface-card-lift group flex h-full flex-col rounded-card p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-flametext transition-all duration-300 ease-premium group-hover:scale-110 group-hover:border-flame/50"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--flame-glow), transparent 70%)",
                  }}
                  aria-hidden
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {step.icon}
                  </svg>
                </span>
                <span className="rounded-pill border border-line bg-surface2 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-flametext">
                  {step.week}
                </span>
              </div>
              <h3 className="mt-4 font-display text-[19px] font-semibold tracking-[-0.01em] text-heading">
                {step.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-body">
                {step.desc}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mx-auto mt-10 max-w-lg text-center text-[14px] leading-relaxed text-muted">
          Messy data is expected, not a problem: inconsistent names, missing
          rates and contracts nobody can find are usually where the money
          went. We count the mess and report it as a finding.
        </p>
      </Reveal>
    </section>
  );
}
