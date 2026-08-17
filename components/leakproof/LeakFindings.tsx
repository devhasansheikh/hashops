import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

const FINDINGS = [
  {
    title: "Work you delivered and never billed",
    desc: "Hours logged against a client with no invoice line to match them. The work happened, the bill never did, and nothing in your reporting flags it.",
    icon: (
      <path d="M12 8v4l2.5 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    ),
  },
  {
    title: "Clients priced below what they cost",
    desc: "Apply the real, loaded cost of the people doing the work and a few accounts usually land under break-even. You service them at a loss every single month.",
    icon: (
      <path d="M3 17l5-5 4 4 8-8M16 8h5v5" />
    ),
  },
  {
    title: "Retainers that skip a month",
    desc: "A monthly retainer that produced eleven invoices last year. Rates applied below your own rate card. Drafts that sat unsent. Pure arithmetic against your own contracts.",
    icon: (
      <path d="M8 2v4M16 2v4M3.5 9h17M4.5 4h15A1.5 1.5 0 0 1 21 5.5v14a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-14A1.5 1.5 0 0 1 4.5 4zM9 14.5l2 2 4-4.5" />
    ),
  },
  {
    title: "Money stuck in overdue invoices",
    desc: "Work paid for weeks late, month after month. That's your cash sitting in someone else's account, and a ranked chase list gets most of it moving.",
    icon: (
      <path d="M12 2v20M16.5 5.5h-6.2a2.8 2.8 0 1 0 0 5.6h3.4a2.8 2.8 0 1 1 0 5.6H6.5" />
    ),
  },
];

export function LeakFindings() {
  return (
    <section id="leaks" className="relative px-5 py-24 sm:px-8">
      <SectionHead
        index="02"
        eyebrow="What we find"
        title={
          <>
            Four places the money{" "}
            <span className="serif-accent gradient-text">actually goes.</span>
          </>
        }
      />

      <div className="mx-auto mt-14 grid max-w-content gap-5 sm:grid-cols-2">
        {FINDINGS.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.08} className="h-full">
            <article className="surface-card surface-card-lift group flex h-full flex-col rounded-card p-6 sm:p-7">
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
                  {f.icon}
                </svg>
              </span>
              <h3 className="mt-4 font-display text-[18px] font-semibold text-heading transition-colors duration-300 group-hover:text-flametext">
                {f.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-body">
                {f.desc}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mx-auto mt-10 max-w-xl text-center text-[14px] leading-relaxed text-muted">
          Every finding comes with its evidence attached: the time entries,
          the invoice, the clause in your own contract. Every dollar traces
          back to a source record your bookkeeper can check.
        </p>
      </Reveal>
    </section>
  );
}
