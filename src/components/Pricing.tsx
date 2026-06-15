"use client";

import { Section, SectionHeader } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { BookButton } from "./ui/BookButton";
import { Check } from "./ui/icons";
import { cn } from "@/lib/utils";

interface Tier {
  name: string;
  tag: string;
  blurb: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "The Audit",
    tag: "Start here",
    blurb: "A diagnosis before any build. Know exactly what's leaking and what it costs.",
    features: [
      "60-min 7-layer diagnostic",
      "Written Bottleneck Report",
      "Your top 3 bottlenecks, costed",
      "A clear fix-first roadmap",
    ],
    cta: "Book the audit",
  },
  {
    name: "The Build",
    tag: "Audit + build",
    blurb: "We build the systems the audit justifies, then hand them over documented.",
    features: [
      "Everything in The Audit",
      "1–2 core systems built",
      "Automations + AI agents",
      "Full documentation + training",
      "20-day post-launch support",
    ],
    cta: "Book a call",
    featured: true,
  },
  {
    name: "Operate & Scale",
    tag: "Full partnership",
    blurb: "An ongoing partnership that keeps optimizing as the business grows.",
    features: [
      "Everything in The Build",
      "Multi-system overhaul",
      "Ongoing optimization retainer",
      "Quarterly re-audits",
      "Priority support",
    ],
    cta: "Talk to us",
  },
];

export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeader
        eyebrow="Engagements"
        heading="Three ways to work with us."
        lead="Every engagement is scoped to your audit, so you only build what pays for itself."
      />

      <div className="mt-12 grid items-start gap-5 lg:grid-cols-3">
        {TIERS.map((tier, i) => (
          <Reveal
            key={tier.name}
            delay={i * 0.1}
            className={cn(tier.featured && "lg:-mt-3")}
          >
            <div
              className={cn(
                "relative flex h-full flex-col rounded-card border p-7 transition-transform duration-300 hover:-translate-y-1",
                tier.featured
                  ? "border-flame/40 bg-surface shadow-[0_0_0_1px_rgba(255,122,26,0.25),0_30px_70px_-40px_rgba(255,122,26,0.45)]"
                  : "border-line bg-surface/60",
              )}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[linear-gradient(120deg,#E55A00,#FF7A1A)] px-3.5 py-1 font-mono text-[0.66rem] uppercase tracking-eyebrow text-white shadow-[0_6px_18px_-6px_rgba(216,87,6,0.7)]">
                  Most chosen
                </span>
              )}

              <span className="inline-flex w-fit rounded-full border border-line bg-surface-2/60 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-eyebrow text-flame-text">
                {tier.tag}
              </span>

              <h3 className="mt-5 font-display text-[1.5rem] font-semibold text-heading">
                {tier.name}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-body">
                {tier.blurb}
              </p>

              <ul className="mt-6 space-y-3 border-t border-line pt-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[0.92rem] text-body-strong">
                    <span
                      className={cn(
                        "mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full",
                        tier.featured
                          ? "bg-flame/15 text-flame"
                          : "bg-surface-2 text-body-strong",
                      )}
                    >
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-7 pt-1">
                <BookButton
                  variant={tier.featured ? "primary" : "secondary"}
                  size="md"
                  className="w-full"
                >
                  {tier.cta}
                </BookButton>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
