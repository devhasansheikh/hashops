"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader } from "./ui/Section";
import { Reveal } from "./ui/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Audit",
    desc: "7-day deep audit. We find what's breaking and what it costs.",
  },
  {
    n: "02",
    title: "Structure",
    desc: "We design the system around how your business actually runs.",
  },
  {
    n: "03",
    title: "Operate & scale",
    desc: "You run daily ops inside it. Automation handles the rest.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Timeline() {
  return (
    <Section id="how">
      <SectionHeader
        eyebrow="How it works"
        heading="Diagnose first. Build what pays."
      />

      <div className="relative mx-auto mt-14 max-w-4xl">
        {/* Desktop horizontal connector */}
        <div className="absolute left-[16.6%] right-[16.6%] top-[34px] hidden h-[2px] bg-line-strong md:block">
          <motion.div
            className="h-full origin-left bg-[linear-gradient(90deg,#E55A00,#FF7A1A,#FFA033)]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.3, ease, delay: 0.2 }}
          />
        </div>

        {/* Mobile vertical connector */}
        <div className="absolute bottom-10 left-[34px] top-10 w-[2px] bg-line-strong md:hidden">
          <motion.div
            className="w-full origin-top bg-[linear-gradient(180deg,#E55A00,#FFA033)]"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.3, ease, delay: 0.2 }}
            style={{ height: "100%" }}
          />
        </div>

        <div className="grid gap-9 md:grid-cols-3 md:gap-6">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.n}
              delay={0.3 + i * 0.18}
              className="group flex items-start gap-5 md:flex-col md:items-center md:text-center"
            >
              <div className="relative grid h-[68px] w-[68px] shrink-0 place-items-center rounded-full border border-line-strong bg-surface transition-transform duration-300 ease-spring group-hover:-translate-y-1.5 group-hover:border-flame/50">
                <span className="gradient-text font-display text-[1.4rem] font-semibold">
                  {step.n}
                </span>
                <span className="absolute inset-0 rounded-full opacity-0 shadow-[0_0_30px_-4px_rgba(255,122,26,0.5)] transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="md:mt-5">
                <h3 className="font-display text-[1.2rem] font-semibold text-heading">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[16rem] text-[0.96rem] leading-relaxed text-body">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
