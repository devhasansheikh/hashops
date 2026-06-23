"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { useCalendly } from "@/components/CalendlyModal";

type Tier = {
  name: string;
  tag: string;
  outcome: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "The Fix",
    tag: "Start focused",
    outcome:
      "For when one part of your delivery is clearly bleeding time or money, and you want it gone.",
    features: [
      "Live Ops Audit + your written Leak Report",
      "The single highest-ROI system from the audit, built",
      "Automations + AI agents where they actually pay off",
      "Full documentation + team training",
      "20-day post-launch support",
    ],
    cta: "Book your Strategy Call",
  },
  {
    name: "The Build",
    tag: "Audit + build",
    featured: true,
    outcome:
      "The system your whole business runs on. Every client handled the same way, nothing dropped.",
    features: [
      "Everything in The Fix",
      "2–3 connected systems: onboarding, delivery, pipeline, and reporting in one workspace",
      "One place your whole team runs from, instead of scattered tools",
      "AI agents + automations across the stack",
      "Full documentation + training",
      "30-day support",
    ],
    cta: "Book your Strategy Call",
  },
  {
    name: "Operate & Scale",
    tag: "Full partnership",
    outcome:
      "We build the whole operation, then keep it sharp as you grow, so scaling doesn't reintroduce the chaos.",
    features: [
      "Everything in The Build",
      "Full multi-system build, end to end",
      "Ongoing optimization retainer: we run and tighten it with you",
      "Quarterly re-audits to catch new leaks as you grow",
      "Priority support",
    ],
    cta: "Book your Strategy Call",
  },
];

function CheckIcon() {
  return (
    <svg
      className="mt-[3px] shrink-0 text-flametext"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4.5 12.5l5 5 10-11"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Pricing() {
  const { openCalendly } = useCalendly();

  return (
    <section id="pricing" className="relative px-5 py-24 sm:px-8">
      <SectionHead
        index="08"
        eyebrow="Engagements"
        title="Three ways to work with us."
      />

      <Reveal delay={0.08} className="mx-auto mt-8 max-w-2xl">
        <div className="flex items-center justify-center gap-3 rounded-pill border border-strong bg-surface/70 px-5 py-3 text-center shadow-[0_10px_30px_-18px_rgba(0,0,0,0.55)] backdrop-blur-md">
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
            style={{ background: "linear-gradient(135deg, #FF8838, #E55A00)" }}
            aria-hidden
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path
                d="M4.5 12.5l5 5 10-11"
                stroke="#fff"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="text-[13.5px] font-medium leading-snug text-bodystrong sm:text-[14px]">
            Every engagement begins with the Ops Audit, the diagnosis that scopes
            the build.
          </p>
        </div>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-content items-stretch gap-5 lg:grid-cols-3">
        {TIERS.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.1} className="h-full">
            <div
              className={`surface-card surface-card-lift relative flex h-full flex-col rounded-card p-7 ${
                tier.featured
                  ? "border-flame/50 lg:![--lift:-12px] lg:hover:![--lift:-31px]"
                  : ""
              }`}
            >
              {tier.featured && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill px-3.5 py-1 font-body text-[11px] font-medium text-white"
                  style={{
                    background: "linear-gradient(120deg, #E55A00, #FF7A1A)",
                    boxShadow: "0 8px 20px -8px rgba(216,87,6,0.6)",
                  }}
                >
                  Most chosen
                </span>
              )}

              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-flametext">
                {tier.tag}
              </p>
              <h3 className="mt-2.5 font-display text-[22px] font-semibold text-heading">
                {tier.name}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-body">
                {tier.outcome}
              </p>

              <ul className="mt-6 flex flex-col gap-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-[14px] leading-snug text-bodystrong"
                  >
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <button
                  onClick={openCalendly}
                  className={`${
                    tier.featured ? "btn-primary" : "btn-secondary"
                  } w-full px-5 py-3 text-sm`}
                >
                  {tier.cta}
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.25}>
        <p className="mx-auto mt-10 max-w-md text-center text-[14px] text-muted">
          Every engagement is scoped to your audit, so you only build what pays
          for itself.
        </p>
      </Reveal>
    </section>
  );
}
