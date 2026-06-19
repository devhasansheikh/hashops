import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

const LEAKS = [
  {
    title: "Delayed decisions cost revenue",
    desc: "Numbers arrive a month late, so calls get made on instinct and momentum stalls.",
    icon: (
      <path d="M12 8v4l2.5 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    ),
  },
  {
    title: "Money slips without being tracked",
    desc: "Unbilled hours, missed renewals, tools nobody opens. None of it shows up until it's gone.",
    icon: (
      <path d="M12 2v20M16.5 5.5h-6.2a2.8 2.8 0 1 0 0 5.6h3.4a2.8 2.8 0 1 1 0 5.6H6.5" />
    ),
  },
  {
    title: "Follow-ups fall through the cracks",
    desc: "Leads go quiet because nobody owns the next touch. The pipeline leaks at the seams.",
    icon: (
      <path d="M3 6.5L12 13l9-6.5M4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11A1.5 1.5 0 0 1 4.5 5zM16 16l5 5M21 16l-5 5" />
    ),
  },
  {
    title: "You become the safety net",
    desc: "Every exception lands on your desk. The business scales exactly as fast as your inbox.",
    icon: (
      <path d="M12 3l8 4v5c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V7l8-4zM12 8.5v4M12 16h.01" />
    ),
  },
];

export function LeakList() {
  return (
    <section id="problem" className="relative px-5 py-24 sm:px-8">
      <SectionHead
        index="02"
        eyebrow="The problem"
        title={
          <>
            You&apos;re not losing time.
            <br />
            You&apos;re losing money. <span className="gradient-text">Quietly.</span>
          </>
        }
      />

      <div className="mx-auto mt-12 max-w-[680px]">
        {LEAKS.map((leak, i) => (
          <Reveal key={leak.title} delay={i * 0.09}>
            <div
              className={`group flex items-start gap-5 py-7 transition-transform duration-300 ease-premium hover:translate-x-2 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
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
                  {leak.icon}
                </svg>
              </span>
              <div className="text-left">
                <h3 className="font-display text-[17px] font-semibold text-heading transition-colors duration-300 group-hover:text-flametext">
                  {leak.title}
                </h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-body">
                  {leak.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
