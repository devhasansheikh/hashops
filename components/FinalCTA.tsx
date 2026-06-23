import { Reveal } from "@/components/ui/Reveal";
import { BookCallButton } from "@/components/ui/Buttons";

export function FinalCTA() {
  return (
    <section id="book" className="relative overflow-hidden px-5 py-28 sm:px-8">
      {/* radial Flame glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[min(1100px,120vw)] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--flame-glow), transparent 68%)",
        }}
        aria-hidden
      />

      <Reveal className="relative mx-auto max-w-2xl text-center">
        <p className="eyebrow">Last step</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,4.6vw,3rem)] font-semibold leading-[1.1] tracking-[-0.018em] text-heading">
          Ready to stop losing money to{" "}
          <span className="gradient-text">the way you run?</span>
        </h2>
        <p className="mt-5 text-[16px] text-bodystrong">
          20 minutes. A real audit. No slide deck.
        </p>
        <div className="mt-9">
          <BookCallButton size="lg" />
        </div>
        <p className="mt-6 text-[13.5px] text-muted">
          If the math says you don&apos;t need a build, we tell you that on the
          call.
        </p>
      </Reveal>
    </section>
  );
}
