import { Rise } from "@/components/leakproof/Rise";

/**
 * How many design-partner places are still open.
 *
 * This is the whole switch. 2 and 1 change the label; 0 removes the band and
 * the section around it, so "How it works" runs straight into the closing
 * panel with no orphaned spacing. Scarcity copy that has gone stale is worse
 * than no scarcity copy, and this one WILL go stale — keep it a one-line edit.
 */
const DESIGN_PARTNER_SLOTS = 2;

const NAMED_SLOTS: Record<number, string> = {
  2: "Two places open",
  1: "One place left",
};

const slotLabel = (n: number) => NAMED_SLOTS[n] ?? `${n} places open`;

/**
 * The public commercial position: two full audits at no fee before pricing
 * goes on the page.
 *
 * Channel-neutral on purpose. It has to read correctly to someone who found
 * this page through search and has never heard of us, not only to someone who
 * was told about the offer somewhere else first.
 *
 * Deliberately NOT a card. It sits between the last explanatory block and the
 * closing panel, and a glass panel stacked directly on another glass panel
 * makes the offer and the ask read as siblings when one is an insert and the
 * other is the destination. A full-bleed tinted inset with hairline edges
 * interrupts the page instead of competing with the end of it: lighter in
 * weight, wider in extent, unmistakably not the thing you act on.
 *
 * The flame rule on the last paragraph is the same device the hero uses for
 * the guarantee, because that paragraph is the guarantee, restated.
 */
export function DesignPartners() {
  if (DESIGN_PARTNER_SLOTS < 1) return null;

  return (
    <section className="relative border-y border-line bg-surface2 px-5 sm:px-8">
      <div className="mx-auto max-w-content py-16 sm:py-20">
        <Rise>
          <p className="flex items-center gap-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-flametext">
            <span
              className="h-[7px] w-[7px] shrink-0 rounded-full bg-flame shadow-[0_0_0_4px_var(--flame-glow)]"
              aria-hidden
            />
            {slotLabel(DESIGN_PARTNER_SLOTS)}
          </p>

          <h2 className="mt-4 max-w-[20ch] font-display text-[clamp(1.7rem,3.4vw,2.3rem)] font-semibold leading-[1.1] tracking-[-0.028em] text-heading">
            Two agencies,{" "}
            <span className="serif-accent gradient-text">at no fee.</span>
          </h2>

          <p className="mt-5 max-w-[62ch] text-[15.5px] leading-relaxed text-bodystrong sm:text-[16px]">
            Before we put pricing on this page, we&apos;re running the full
            audit for two Australian agencies at no charge, same three weeks,
            same evidenced report, same read-only access.
          </p>

          <p className="mt-4 max-w-[62ch] text-[15.5px] leading-relaxed text-body sm:text-[16px]">
            What we ask in return: a named case study with the real numbers,
            wording approved by you. A reference call. Two introductions to
            founders you rate.
          </p>

          <p className="mt-6 max-w-[62ch] border-l-2 border-flame pl-4 text-[15px] leading-relaxed text-bodystrong">
            No fee means the refund guarantee has nothing to refund, so it
            becomes a promise instead: if we don&apos;t find at least{" "}
            <span className="whitespace-nowrap font-mono font-medium text-flametext">
              A$100,000
            </span>{" "}
            a year of recoverable leak, we&apos;ll tell you plainly rather than
            dress a small number up as a big one.
          </p>
        </Rise>
      </div>
    </section>
  );
}
