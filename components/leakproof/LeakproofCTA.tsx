import { Rise } from "@/components/leakproof/Rise";
import { BookCallButton } from "@/components/ui/Buttons";
import { CONTACT_EMAIL } from "@/lib/site";

/**
 * Where a Leak Scan lands, and what lands in the subject line.
 *
 * Kept as constants so this can be repointed at a dedicated inbox without
 * anyone editing markup.
 */
const LEAK_SCAN_EMAIL = CONTACT_EMAIL;
const LEAK_SCAN_SUBJECT = "Leak Scan";
const LEAK_SCAN_MAILTO = `mailto:${LEAK_SCAN_EMAIL}?subject=${encodeURIComponent(
  LEAK_SCAN_SUBJECT,
)}`;

/**
 * Closing panel. Deliberately NOT the homepage's centred always-dark band —
 * this one is left-aligned and theme-native, so it reads as the end of a
 * service page rather than the end of the site.
 *
 * Two asks, in order of size. The call stays the primary path and keeps its
 * own reassurance line; the Leak Scan sits below a hairline as a text link, a
 * standing low-commitment path for anyone not ready to book. It is not a
 * campaign mechanic and it is offered to every visitor.
 *
 * The link's label IS the address, on purpose: `mailto:` is unreliable in an
 * in-app webview, and a tap that silently does nothing is worse than no link
 * at all. Rendered this way the address is always readable and always
 * copyable, whether or not the handler fires.
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

            <div className="mt-8 border-t border-line pt-7">
              <p className="max-w-[58ch] text-[14.5px] leading-relaxed text-body">
                <strong className="font-semibold text-heading">
                  Not ready for a call?
                </strong>{" "}
                Send us one client&apos;s contract and one month of time
                entries. We&apos;ll reconcile them and send back what we find:
                one page, no meeting, inside 48 hours.
              </p>
              <a
                href={LEAK_SCAN_MAILTO}
                className="mt-3.5 inline-block break-all font-mono text-[13.5px] font-medium text-flametext underline decoration-[var(--border-strong)] underline-offset-[5px] transition-colors duration-300 hover:decoration-current"
              >
                {LEAK_SCAN_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </Rise>
    </section>
  );
}
