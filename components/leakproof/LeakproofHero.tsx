import { Rise } from "@/components/leakproof/Rise";
import { step } from "@/components/leakproof/stagger";
import { BookCallButton } from "@/components/ui/Buttons";

/**
 * Service-page hero: a left-aligned band at the top of the page, not a
 * full-viewport centred screen. The centred 100svh treatment is the
 * homepage's gesture — wearing it here is most of why this route used to
 * read as a separate product site.
 */
export function LeakproofHero() {
  return (
    <section
      id="top"
      className="relative px-5 pb-14 pt-24 sm:px-8 sm:pb-16 sm:pt-28"
    >
      <div className="mx-auto flex min-h-[42svh] max-w-content flex-col justify-center">
        <Rise immediate>
          <p className="eyebrow">
            A HASH service <span className="text-muted">·</span> For Australian
            creative agencies
          </p>
        </Rise>

        <Rise immediate delay={step(1)}>
          <h1 className="mt-4 max-w-[26ch] font-display text-[clamp(2.2rem,5vw,3.7rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-heading">
            <span className="block">Money you&apos;ve already earned.</span>
            <span className="serif-accent gradient-text block">
              Never billed.
            </span>
          </h1>
        </Rise>

        <Rise immediate delay={step(2)}>
          <p className="mt-5 max-w-[56ch] font-body text-[16px] leading-relaxed text-bodystrong sm:text-[16.5px]">
            Leakproof is a forensic profit audit. We line up what you promised,
            what you delivered and what you billed, then hand you an evidenced
            list of the money falling through the gaps.
          </p>
        </Rise>

        <Rise immediate delay={step(3)}>
          <p className="mt-7 max-w-[60ch] border-l-2 border-flame pl-4 font-body text-[15px] leading-relaxed text-bodystrong">
            If we don&apos;t find at least{" "}
            <span className="whitespace-nowrap font-mono font-medium text-flametext">
              A$100,000
            </span>{" "}
            a year of recoverable leak, you don&apos;t pay.
          </p>
        </Rise>

        <Rise immediate delay={step(4)} className="mt-8">
          <BookCallButton size="md" label="Book a 30-minute call" />
        </Rise>
      </div>
    </section>
  );
}
