import { Rise } from "@/components/leakproof/Rise";
import { BookCallButton } from "@/components/ui/Buttons";

/**
 * Closing panel. Deliberately NOT the homepage's centred always-dark band —
 * this one is left-aligned and theme-native, so it reads as the end of a
 * service page rather than the end of the site.
 */
export function LeakproofCTA() {
  return (
    <section id="book" className="relative px-5 pb-24 pt-6 sm:px-8 sm:pb-28">
      <Rise className="mx-auto max-w-content">
        <div className="surface-card relative overflow-hidden rounded-card px-6 py-12 sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(85% 130% at 100% 0%, var(--flame-glow), transparent 62%)",
            }}
            aria-hidden
          />

          <div className="relative max-w-[64ch]">
            <h2 className="font-display text-[clamp(1.85rem,3.9vw,2.7rem)] font-semibold leading-[1.1] tracking-[-0.028em] text-heading">
              You already know some clients{" "}
              <span className="serif-accent gradient-text">
                are unprofitable.
              </span>
            </h2>
            <p className="mt-5 max-w-[54ch] text-[16px] leading-relaxed text-bodystrong sm:text-[17px]">
              You&apos;re still not going to spend a weekend in a spreadsheet
              proving which ones. That&apos;s what we&apos;re for.
            </p>
            <div className="mt-9">
              <BookCallButton size="lg" label="Book a 30-minute call" />
            </div>
            <p className="mt-5 text-[13.5px] leading-relaxed text-muted">
              If it isn&apos;t a fit for your agency, we&apos;ll tell you on the
              call.
            </p>
          </div>
        </div>
      </Rise>
    </section>
  );
}
