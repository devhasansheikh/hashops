"use client";

import { Section } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { CountUp } from "./ui/CountUp";
import { ArrowRight } from "./ui/icons";

export function CostBlock() {
  return (
    <Section id="cost">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="eyebrow flex items-center justify-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-flame" />
          The real cost of manual ops
        </p>
      </Reveal>

      <Reveal delay={0.1} y={26} className="mx-auto mt-8 max-w-3xl">
        <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
          {/* Status quo */}
          <div className="rounded-card border border-error/25 bg-error/[0.05] p-7 text-center">
            <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-error">
              Status quo
            </p>
            <p className="mt-3 font-mono text-[0.82rem] text-body">
              8 hrs/wk × $35 × 52 wks
            </p>
            <p className="mt-3 font-display text-[clamp(2rem,5vw,2.7rem)] font-semibold leading-none text-heading">
              <CountUp to={14560} prefix="$" />
            </p>
            <p className="mt-2 text-[0.86rem] text-body">lost every year</p>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-flame md:rotate-0">
              <ArrowRight className="h-5 w-5 rotate-90 md:rotate-0" />
            </span>
          </div>

          {/* One-time build */}
          <div className="relative overflow-hidden rounded-card border border-flame/30 bg-[linear-gradient(150deg,rgba(255,122,26,0.1),rgba(255,122,26,0.02))] p-7 text-center">
            <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-flame-text">
              One-time build
            </p>
            <p className="mt-3 font-mono text-[0.82rem] text-body">
              Pays back in
            </p>
            <p className="mt-3 font-display text-[clamp(2rem,5vw,2.7rem)] font-semibold leading-none">
              <span className="gradient-text">
                <CountUp to={9} suffix=" weeks" />
              </span>
            </p>
            <p className="mt-2 text-[0.86rem] text-body">then it&apos;s margin</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
