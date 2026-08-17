import { Reveal } from "@/components/ui/Reveal";
import { BookCallButton } from "@/components/ui/Buttons";

/** Closing CTA — the same cinematic dark band as the homepage FinalCTA. */
export function LeakproofCTA() {
  return (
    <section id="book" className="relative px-4 py-24 sm:px-8">
      <Reveal className="mx-auto max-w-wide">
        <div
          className="relative overflow-hidden rounded-[32px] border border-[rgba(255,255,255,0.1)] px-6 py-20 text-center sm:px-12 sm:py-24"
          style={{
            background:
              "radial-gradient(120% 130% at 50% 125%, rgba(255,122,26,0.34), rgba(229,90,0,0.1) 44%, transparent 72%), linear-gradient(180deg, #101013, #0a0a0b)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), 0 40px 90px -40px rgba(0,0,0,0.7)",
          }}
        >
          {/* thin ember rim along the bottom edge — the horizon motif */}
          <div
            className="pointer-events-none absolute inset-x-10 bottom-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,138,61,0.75), transparent)",
            }}
            aria-hidden
          />

          <div className="relative">
            <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[#ff8a3d]">
              Last step
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-[clamp(2.1rem,4.8vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.025em] text-[#fafaf7]">
              You already know some clients{" "}
              <span className="serif-accent gradient-text">
                are unprofitable.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[16px] text-[rgba(250,250,247,0.72)]">
              You&apos;re still not going to spend a weekend in a spreadsheet
              proving which ones. That&apos;s what we&apos;re for.
            </p>
            <div className="mt-9 flex justify-center">
              <BookCallButton size="lg" label="Book a 30-minute call" />
            </div>
            <p className="mt-6 text-[13.5px] text-[rgba(250,250,247,0.45)]">
              If the audit isn&apos;t a fit for your agency, we tell you that
              on the call.
            </p>

            {/* meta row */}
            <div className="mx-auto mt-14 grid max-w-xl grid-cols-1 gap-6 border-t border-[rgba(255,255,255,0.1)] pt-8 text-center sm:grid-cols-2 sm:gap-4">
              {[
                { label: "Format", value: "30 minutes, direct questions" },
                { label: "You leave with", value: "A clear yes or no on fit" },
              ].map((m) => (
                <div key={m.label}>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[rgba(250,250,247,0.4)]">
                    {m.label}
                  </p>
                  <p className="mt-1.5 font-display text-[14.5px] font-medium text-[rgba(250,250,247,0.9)]">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
