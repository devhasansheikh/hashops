"use client";

import { Section, SectionHeader } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { CountUp } from "./ui/CountUp";
import { cn } from "@/lib/utils";

interface Stat {
  to: number;
  suffix?: string;
  label: string;
}
interface Block {
  tag: string;
  title: string;
  desc: string;
  chips: string[];
  stats: [Stat, Stat];
}

const BLOCKS: Block[] = [
  {
    tag: "Case 01 · Sales consultancy",
    title: "AI-powered Notion CRM",
    desc: "Manual CRM, no visibility, reps on gut feel. We built 5 AI agents, 30 automations, 20 KPIs.",
    chips: ["5 AI agents", "30 automations", "20 KPIs", "2 dashboards"],
    stats: [
      { to: 80, suffix: "%", label: "CRM work automated" },
      { to: 4, suffix: " wks", label: "to delivery" },
    ],
  },
  {
    tag: "Case 02 · 20-person team",
    title: "Business management OS",
    desc: "Scattered notes across 5 departments became one command center with structured 1-on-1s.",
    chips: ["1 command center", "5 departments", "20-person 1-on-1s"],
    stats: [
      { to: 12, suffix: " hrs", label: "saved / week" },
      { to: 14, suffix: " days", label: "to delivery" },
    ],
  },
];

function StatTile({ stat }: { stat: Stat }) {
  return (
    <div className="rounded-xl border border-line bg-surface-2/40 p-5">
      <p className="font-display text-[clamp(2.2rem,5vw,2.8rem)] font-semibold leading-none">
        <CountUp to={stat.to} suffix={stat.suffix} className="gradient-text" />
      </p>
      <p className="mt-2 text-[0.85rem] text-body">{stat.label}</p>
    </div>
  );
}

export function ProofStats() {
  return (
    <Section id="work">
      <SectionHeader
        eyebrow="Proof, real builds, real numbers"
        heading="We use what we build."
      />

      <div className="mt-12 space-y-5">
        {BLOCKS.map((block, i) => (
          <Reveal key={block.title} delay={i * 0.08}>
            <div className="card overflow-hidden p-6 sm:p-8">
              <div
                className={cn(
                  "grid items-center gap-8 md:grid-cols-2",
                  i % 2 === 1 && "md:[&>*:first-child]:order-2",
                )}
              >
                <div>
                  <p className="eyebrow !text-muted">{block.tag}</p>
                  <h3 className="mt-3 font-display text-[1.6rem] font-semibold text-heading">
                    {block.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[1rem] leading-relaxed text-body">
                    {block.desc}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {block.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-line bg-surface-2/60 px-3 py-1 font-mono text-[0.72rem] text-body-strong"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <StatTile stat={block.stats[0]} />
                  <StatTile stat={block.stats[1]} />
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
