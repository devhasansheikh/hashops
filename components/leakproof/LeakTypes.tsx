import { Rise } from "@/components/leakproof/Rise";
import { step } from "@/components/leakproof/stagger";

const LEAKS = [
  {
    lead: "Work delivered, never billed.",
    body: "Hours logged against a client with no invoice line to match them.",
  },
  {
    lead: "Clients priced below what they cost.",
    body: "Apply the real loaded cost of the people doing the work and a few accounts land under break-even, every month.",
  },
  {
    lead: "Retainers that skip a month.",
    body: "Eleven invoices for a twelve-month retainer. Rates below your own rate card. Drafts that sat unsent.",
  },
  {
    lead: "Cash stuck in overdue invoices.",
    body: "Your money sitting in someone else's account, month after month.",
  },
];

/**
 * A typographic list, not a card grid: hairline rows, a bold lead-in, one
 * sentence. No boxes, no icon tiles, no hover lift.
 */
export function LeakTypes() {
  return (
    <section className="relative px-5 sm:px-8">
      <div className="mx-auto max-w-content border-t border-line py-16 sm:py-20">
        <Rise>
          <h2 className="max-w-[16ch] font-display text-[clamp(1.85rem,3.9vw,2.7rem)] font-semibold leading-[1.1] tracking-[-0.028em] text-heading">
            Four places{" "}
            <span className="serif-accent gradient-text">
              the money actually goes.
            </span>
          </h2>
        </Rise>

        <ol className="mt-10 divide-y divide-[var(--border)] border-y border-line">
          {LEAKS.map((leak, i) => (
            <Rise as="li" key={leak.lead} delay={step(i)}>
              <div className="grid grid-cols-[auto_1fr] gap-x-5 py-7 sm:gap-x-9 sm:py-8">
                <span className="pt-[7px] font-mono text-[11px] tabular-nums tracking-[0.12em] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-[18px] font-semibold tracking-[-0.015em] text-heading sm:text-[20px]">
                    {leak.lead}
                  </h3>
                  <p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-body sm:text-[15.5px]">
                    {leak.body}
                  </p>
                </div>
              </div>
            </Rise>
          ))}
        </ol>

        <Rise delay={step(1)}>
          <p className="mt-10 max-w-[62ch] text-[16px] leading-relaxed text-bodystrong sm:text-[17px]">
            Every finding ships with its evidence attached: the time entry, the
            invoice, the clause in your own contract. Every dollar traces to a
            source record your bookkeeper can check.
          </p>
        </Rise>
      </div>
    </section>
  );
}
