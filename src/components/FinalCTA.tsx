"use client";

import { Section } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { BookButton } from "./ui/BookButton";
import { HashMark } from "./ui/HashMark";

export function FinalCTA() {
  return (
    <Section id="contact" className="overflow-hidden">
      {/* Radial Flame glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--flame-glow), transparent 68%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
      >
        <HashMark className="h-[420px] w-[420px]" />
      </div>

      <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-balance font-display text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-[1.05] tracking-tightest text-heading">
          Ready to stop losing money to unclear operations?
        </h2>
        <p className="mt-5 text-[1.1rem] text-body-strong">
          20 minutes. A real audit. No slide deck.
        </p>
        <div className="mt-9">
          <BookButton size="lg" />
        </div>
        <p className="mt-5 text-[0.9rem] text-muted">
          No upfront payment. Just clarity on what&apos;s leaking and how to fix it.
        </p>
      </Reveal>
    </Section>
  );
}
