"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { useCalendly } from "@/components/CalendlyModal";
import { BOOK_CTA } from "@/lib/site";

type Tier = {
  name: string;
  tag: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "The Audit",
    tag: "Start here",
    features: [
      "60-min 7-layer diagnostic",
      "Written Bottleneck Report",
      "Top 3 bottlenecks costed",
      "Fix-first roadmap",
    ],
    cta: "Book the audit call",
  },
  {
    name: "The Build",
    tag: "Audit + build",
    featured: true,
    features: [
      "Everything in The Audit",
      "1–2 core systems built",
      "Automations + AI agents",
      "Full documentation + training",
      "20-day support",
    ],
    cta: BOOK_CTA,
  },
  {
    name: "Operate & Scale",
    tag: "Full partnership",
    features: [
      "Everything in The Build",
      "Multi-system overhaul",
      "Ongoing optimization retainer",
      "Quarterly re-audits",
      "Priority support",
    ],
    cta: "Book a scoping call",
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
        lead="No menu of prices here, because the scope comes from your audit, not a package page."
      />

      <div className="mx-auto mt-16 grid max-w-content items-stretch gap-5 lg:grid-cols-3">
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
