"use client";

import type { SVGProps } from "react";
import { Section, SectionHeader } from "./ui/Section";
import { Reveal } from "./ui/Reveal";

type IconP = SVGProps<SVGSVGElement>;
const ib = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

const ClockIcon = (p: IconP) => (
  <svg {...ib} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </svg>
);
const LeakIcon = (p: IconP) => (
  <svg {...ib} {...p}>
    <path d="M12 3c3 3.5 5 6.2 5 9a5 5 0 0 1-10 0c0-2.8 2-5.5 5-9Z" />
    <path d="M12 14.5a2 2 0 0 0 2-2" />
  </svg>
);
const ChainIcon = (p: IconP) => (
  <svg {...ib} {...p}>
    <path d="M9 12a3 3 0 0 1 3-3h1.5a3 3 0 0 1 0 6H12" />
    <path d="M15 12a3 3 0 0 1-3 3h-1.5a3 3 0 0 1 0-6H12" />
    <path d="M5 5l3 3M19 19l-3-3" />
  </svg>
);
const NetIcon = (p: IconP) => (
  <svg {...ib} {...p}>
    <path d="M12 3v18M3 9.5h18M5.5 5.5 12 12l6.5-6.5M5.5 18.5 12 12l6.5 6.5" />
  </svg>
);

const LEAKS = [
  {
    icon: ClockIcon,
    title: "Delayed decisions cost revenue",
    desc: "Opportunities are gone by the time the numbers reach you.",
  },
  {
    icon: LeakIcon,
    title: "Money slips without being tracked",
    desc: "Projects move forward while costs and margins quietly erode.",
  },
  {
    icon: ChainIcon,
    title: "Follow-ups fall through the cracks",
    desc: "Missed touches turn into lost deals and unpaid work.",
  },
  {
    icon: NetIcon,
    title: "You become the safety net",
    desc: "When systems aren't clear, your time fills every gap and growth stalls.",
  },
];

export function LeakList() {
  return (
    <Section id="problem">
      <SectionHeader
        eyebrow="The problem"
        heading={
          <>
            You&apos;re not losing time.{" "}
            <span className="gradient-text">You&apos;re losing money.</span>{" "}
            Quietly.
          </>
        }
        lead="Poor systems don't look like mistakes. They look like 'normal operations' until growth stalls."
      />

      <div className="mx-auto mt-12 max-w-2xl">
        {LEAKS.map((leak, i) => {
          const Icon = leak.icon;
          return (
            <Reveal key={leak.title} delay={i * 0.08}>
              <div className="group flex items-center gap-5 border-t border-line py-6 transition-transform duration-300 ease-spring hover:translate-x-1.5 last:border-b">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] border border-line bg-[linear-gradient(150deg,rgba(255,122,26,0.16),rgba(255,122,26,0.04))] text-flame">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[1.15rem] font-medium text-heading transition-colors duration-300 group-hover:text-flame">
                    {leak.title}
                  </h3>
                  <p className="mt-1 text-[0.98rem] leading-relaxed text-body">
                    {leak.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
