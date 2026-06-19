import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { CountUp } from "@/components/ui/CountUp";

type CaseBlock = {
  tag: string;
  title: string;
  desc: string;
  chips: string[];
  stat: { to: number; suffix: string; label: string };
  meta: string;
};

const CASES: CaseBlock[] = [
  {
    tag: "Case study 01 · Sales consultancy",
    title: "AI-powered Notion CRM",
    desc: "A sales-led consultancy running its CRM by hand: no pipeline visibility, reps working on gut feel. We shipped 5 AI agents, 30 automations, 20 tracked KPIs, and 2 dashboards on top of the tools they already had.",
    chips: ["5 AI agents", "30 automations", "20 KPIs", "2 dashboards"],
    stat: { to: 80, suffix: "%", label: "of CRM work automated" },
    meta: "4 weeks · audit to live",
  },
  {
    tag: "Case study 02 · 20-person team",
    title: "Business Management OS",
    desc: "An exec managing 20 people across departments from scattered notes. We built a single control dashboard and a 1-on-1 operating system for the whole team, delivered in two weeks.",
    chips: ["Control dashboard", "20-person 1-on-1 system", "Full documentation"],
    stat: { to: 12, suffix: " hrs", label: "recovered every week" },
    meta: "14 days · delivered",
  },
];

export function ProofStats() {
  return (
    <section id="work" className="relative px-5 py-24 sm:px-8">
      <SectionHead
        index="06"
        eyebrow="Proof"
        title="Built, shipped, measured."
        lead="Two recent builds, with the numbers that mattered to the founder."
      />

      <div className="mx-auto mt-14 flex max-w-content flex-col gap-6">
        {CASES.map((block, i) => (
          <Reveal key={block.title} delay={i * 0.12}>
            <div
              className={`surface-card surface-card-lift grid items-center gap-10 rounded-card p-8 sm:p-12 lg:grid-cols-[1.25fr_1fr] ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-flametext">
                  {block.tag}
                </p>
                <h3 className="mt-3 font-display text-[clamp(1.4rem,3vw,1.8rem)] font-semibold text-heading">
                  {block.title}
                </h3>
                <p className="mt-3.5 max-w-xl text-[15px] leading-relaxed text-body">
                  {block.desc}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {block.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-pill border border-line bg-surface2 px-3 py-1 font-mono text-[10.5px] text-bodystrong"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center border-line text-center lg:border-l lg:py-4">
                <p className="font-display text-[clamp(3.4rem,7vw,4.6rem)] font-bold leading-none tracking-[-0.02em]">
                  <CountUp
                    to={block.stat.to}
                    suffix={block.stat.suffix}
                    className="gradient-text"
                  />
                </p>
                <p className="mt-2 text-[14.5px] text-bodystrong">
                  {block.stat.label}
                </p>
                <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
                  {block.meta}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
