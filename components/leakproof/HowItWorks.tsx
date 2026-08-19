import { Rise } from "@/components/leakproof/Rise";
import { step } from "@/components/leakproof/stagger";

const WEEKS = [
  {
    label: "Week 1",
    body: "We rebuild what each client is actually contracted to, in one place, usually for the first time.",
  },
  {
    label: "Week 2",
    body: "Twelve months of time and accounting data reconciled, every mismatch priced at your own contracted rates.",
  },
  {
    label: "Week 3",
    body: "A written findings report, then a 90-minute session where you approve, reject or defer each item. You leave with a decision log and named owners, not a slide deck.",
  },
];

const GUARDRAILS = [
  "Read-only access",
  "No passwords or bank logins",
  "We never contact your clients",
  "Confidentiality signed before any data moves.",
];

/**
 * The procedure as a single hairline rule with three markers — a timeline you
 * read down, rather than four cards you scan across.
 */
export function HowItWorks() {
  return (
    <section className="relative px-5 sm:px-8">
      <div className="mx-auto max-w-content border-t border-line py-16 sm:py-20">
        <Rise>
          <h2 className="max-w-[18ch] font-display text-[clamp(1.85rem,3.9vw,2.7rem)] font-semibold leading-[1.1] tracking-[-0.028em] text-heading">
            Three weeks. Fixed fee.{" "}
            <span className="serif-accent gradient-text">
              Read-only, always.
            </span>
          </h2>
        </Rise>

        <ol className="relative mt-11">
          {/* the rule the markers sit on */}
          <span
            className="absolute bottom-3 left-1 top-3 w-px bg-[var(--border-strong)]"
            aria-hidden
          />
          {WEEKS.map((week, i) => (
            <Rise
              as="li"
              key={week.label}
              delay={step(i)}
              className="relative pb-9 pl-8 last:pb-0 sm:pl-10"
            >
              <span
                className="absolute left-0 top-[5px] h-[9px] w-[9px] rounded-full bg-flame shadow-[0_0_0_4px_var(--flame-glow)]"
                aria-hidden
              />
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-flametext">
                {week.label}
              </p>
              <p className="mt-2.5 max-w-[62ch] text-[15.5px] leading-relaxed text-bodystrong sm:text-[16px]">
                {week.body}
              </p>
            </Rise>
          ))}
        </ol>

        <Rise delay={step(1)}>
          <div className="mt-10 border-t border-line pt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              Then, ongoing
            </p>
            <h3 className="mt-2.5 font-display text-[19px] font-semibold tracking-[-0.015em] text-heading sm:text-[21px]">
              Recovery Operations
            </h3>
            <p className="mt-2.5 max-w-[62ch] text-[15.5px] leading-relaxed text-body sm:text-[16px]">
              The reconciliation re-run monthly, change orders and chase emails
              drafted for you to approve, and a running ledger of recovered
              dollars against what you pay us.
            </p>
          </div>
        </Rise>

        <Rise delay={step(2)}>
          <p className="mt-9 max-w-[74ch] text-[13.5px] leading-relaxed text-body">
            {GUARDRAILS.map((g, i) => (
              <span key={g}>
                {i > 0 && (
                  <span className="px-[7px] text-muted" aria-hidden>
                    ·
                  </span>
                )}
                {g}
              </span>
            ))}
          </p>
        </Rise>
      </div>
    </section>
  );
}
