import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

const TRUST = [
  {
    title: "Read-only, always",
    desc: "No write access to any system, ever. We look at your records, we never touch them.",
    icon: (
      <path d="M12 5c-5 0-8.5 4.2-9.7 6.4a1.2 1.2 0 0 0 0 1.2C3.5 14.8 7 19 12 19s8.5-4.2 9.7-6.4a1.2 1.2 0 0 0 0-1.2C20.5 9.2 17 5 12 5zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    ),
  },
  {
    title: "No passwords, no bank logins",
    desc: "Everything comes from exports your own team runs. We tell you what we don't ask for, up front.",
    icon: (
      <path d="M8 11V7a4 4 0 1 1 8 0v4M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM12 15v2" />
    ),
  },
  {
    title: "We never contact your clients",
    desc: "We draft the change orders and chase emails. Sending them, or not, is always your call.",
    icon: (
      <path d="M3 6.5L12 13l9-6.5M4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11A1.5 1.5 0 0 1 4.5 5z" />
    ),
  },
  {
    title: "Confidentiality signed first",
    desc: "Executed before a single number moves, and offered before you ask. Salaries can stay private behind role bands.",
    icon: (
      <path d="M12 3l8 4v5c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V7l8-4zM12 8.5v4M12 16h.01" />
    ),
  },
];

export function Guarantee() {
  return (
    <section id="guarantee" className="relative px-5 py-24 sm:px-8">
      <SectionHead
        index="05"
        eyebrow="In writing, every time"
        title={
          <>
            If we don&apos;t find it,{" "}
            <span className="serif-accent gradient-text">
              you don&apos;t pay.
            </span>
          </>
        }
      />

      <Reveal delay={0.1} className="mx-auto mt-12 max-w-[820px]">
        <div className="surface-card relative overflow-hidden rounded-card border-flame/50 p-8 text-center sm:p-12">
          {/* warm floor light — the horizon motif */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
            style={{
              background:
                "radial-gradient(100% 90% at 50% 115%, var(--flame-glow), transparent 70%)",
            }}
            aria-hidden
          />
          <div className="relative">
            <p className="font-serif text-[clamp(1.35rem,2.8vw,1.9rem)] italic leading-snug text-heading">
              &ldquo;If the audit does not identify at least{" "}
              <span className="gradient-text not-italic font-mono text-[0.82em] font-medium tracking-tight">
                A$100,000
              </span>{" "}
              of annualised recoverable leak, we tell you, and we refund the
              fee in full.&rdquo;
            </p>
            <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
              From the engagement letter, not just this page
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-content gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST.map((t, i) => (
          <Reveal key={t.title} delay={i * 0.08} className="h-full">
            <article className="surface-card group flex h-full flex-col rounded-card p-6">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-flametext transition-all duration-300 ease-premium group-hover:scale-110 group-hover:border-flame/50"
                style={{
                  background:
                    "linear-gradient(135deg, var(--flame-glow), transparent 70%)",
                }}
                aria-hidden
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {t.icon}
                </svg>
              </span>
              <h3 className="mt-4 font-display text-[15.5px] font-semibold text-heading">
                {t.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-body">
                {t.desc}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
