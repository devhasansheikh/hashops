"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { ArrowOrb } from "@/components/ui/ArrowOrb";
import { useCalendly } from "@/components/CalendlyModal";

type Product = {
  name: string;
  tag: string;
  meta: string;
  outcome: string;
  features: string[];
  featured?: boolean;
};

const PRODUCTS: Product[] = [
  {
    name: "The Leak Audit",
    tag: "Start here",
    meta: "Three weeks · Fixed fee",
    featured: true,
    outcome:
      "A forensic reconciliation of your last twelve months, delivered as a findings report a skeptical bookkeeper can verify line by line.",
    features: [
      "A Scope Ledger of every active client: what's actually contracted, in one place, for the first time",
      "Twelve months of accounting and time data reconciled, up to 25 active clients",
      "A written findings report with evidence for every dollar claimed",
      "Findings graded honestly: hard fact, judgement call, or pattern to watch. A guess is never presented as a fact",
      "A 90-minute session where you decide each item: approve, reject, or defer",
      "A recovery list ranked by dollars against effort",
    ],
  },
  {
    name: "Recovery Operations",
    tag: "After the audit",
    meta: "Monthly · Ongoing",
    outcome:
      "The audit finds the money once. This keeps finding it, and helps you get it back, month after month.",
    features: [
      "The full reconciliation re-run every month on fresh data",
      "Change orders and chase emails drafted for you: you approve them, we never contact your clients",
      "A short monthly decision session on a ranked list",
      "A running ledger of recovered dollars against what you pay us, so renewal is a math conversation",
      "Process rules that stop the same leak from reopening next quarter",
    ],
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

const BUCKETS = [
  {
    name: "Recoverable now",
    desc: "A specific invoice to raise or payment to chase, this month.",
  },
  {
    name: "Structural",
    desc: "A repricing or exit decision, made at the next renewal.",
  },
  {
    name: "Preventable",
    desc: "A process rule, so the same leak stops recurring.",
  },
];

export function AuditOffer() {
  const { openCalendly } = useCalendly();

  return (
    <section id="offer" className="relative px-5 py-24 sm:px-8">
      <SectionHead
        index="03"
        eyebrow="The service"
        title={
          <>
            First we find it.{" "}
            <span className="serif-accent gradient-text">
              Then you get it back.
            </span>
          </>
        }
        lead="Two ways of working together, and they only ever happen in this order. Everything starts with the audit."
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
            Fixed fee, agreed in writing before we start. Read-only access,
            always.
          </p>
        </div>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-[940px] items-stretch gap-5 lg:grid-cols-2">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1} className="h-full">
            <div
              className={`surface-card surface-card-lift relative flex h-full flex-col rounded-card p-7 ${
                p.featured
                  ? "border-flame/50 lg:![--lift:-12px] lg:hover:![--lift:-31px]"
                  : ""
              }`}
            >
              {p.featured && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-pill px-3.5 py-1 font-body text-[11px] font-medium text-white"
                  style={{
                    background: "linear-gradient(120deg, #E55A00, #FF7A1A)",
                    boxShadow: "0 8px 20px -8px rgba(216,87,6,0.6)",
                  }}
                >
                  Where every engagement starts
                </span>
              )}

              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-flametext">
                  {p.tag}
                </p>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
                  {p.meta}
                </p>
              </div>
              <h3 className="mt-2.5 font-display text-[22px] font-semibold text-heading">
                {p.name}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-body">
                {p.outcome}
              </p>

              <ul className="mt-6 flex flex-col gap-3">
                {p.features.map((feature) => (
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
                    p.featured ? "btn-primary" : "btn-secondary"
                  } w-full px-5 py-2 text-sm`}
                >
                  Book a 30-minute call
                  <ArrowOrb className="!h-7 !w-7" />
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* how a finding becomes money */}
      <Reveal delay={0.2} className="mx-auto mt-12 max-w-[940px]">
        <div className="surface-card rounded-card p-6 sm:p-8">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-flametext">
            How a finding becomes money
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3 sm:gap-5">
            {BUCKETS.map((b, i) => (
              <div
                key={b.name}
                className={`text-center sm:px-3 ${
                  i > 0 ? "border-t border-line pt-6 sm:border-l sm:border-t-0 sm:pt-0" : ""
                }`}
              >
                <p className="font-display text-[15.5px] font-semibold text-heading">
                  {b.name}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-body">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
