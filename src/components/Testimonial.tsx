"use client";

import { Section } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { HashMark } from "./ui/HashMark";

export function Testimonial() {
  return (
    <Section id="testimonial">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="eyebrow flex items-center justify-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-flame" />
          What clients say
        </p>

        <figure className="relative mt-8 overflow-hidden rounded-card border border-line bg-surface/70 p-9 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-6 opacity-[0.06]"
          >
            <HashMark className="h-40 w-40" />
          </div>

          <blockquote className="relative text-balance font-display text-[clamp(1.4rem,3.4vw,2rem)] font-medium leading-snug text-heading">
            &ldquo;You made me write down how my business actually works.
            That&apos;s the thing I&apos;ll remember.&rdquo;
          </blockquote>

          <figcaption className="relative mt-7 flex items-center justify-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(150deg,#FF8838,#D85706)] font-display text-sm font-semibold text-white">
              F
            </span>
            <div className="text-left">
              <p className="text-[0.92rem] font-medium text-heading">Founder</p>
              <p className="font-mono text-[0.72rem] text-muted">
                Sales-led consultancy · United States
              </p>
            </div>
          </figcaption>
        </figure>
      </Reveal>
    </Section>
  );
}
