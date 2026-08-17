"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useReduceMotion } from "@/lib/useReduceMotion";
import { BookCallButton, SecondaryButton } from "@/components/ui/Buttons";
import { scrollToId } from "@/components/SmoothScroll";

const ease = [0.2, 0.7, 0.3, 1] as const;

const LINE1 = ["Money", "you've", "already", "earned."];
const LINE2 = ["Never", "billed."];

export function LeakproofHero() {
  const reduce = useReduceMotion();
  const ref = useRef<HTMLElement>(null);

  // Scroll-linked parallax — same drift + fade as the homepage hero.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.07, delayChildren: 0.18 },
    },
  };
  const word: Variants = {
    hidden: { opacity: 0, y: "0.6em", filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.75, ease },
    },
  };

  const item = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease },
        };

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pb-24 pt-32 text-center"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] h-[70%] w-[min(1000px,95vw)] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at center, var(--flame-glow), transparent 70%)",
        }}
        aria-hidden
      />

      <motion.div
        style={reduce ? undefined : { y, opacity, willChange: "transform, opacity" }}
        className="flex flex-col items-center"
      >
        {/* service pill */}
        <motion.div {...item(0.05)}>
          <span className="inline-flex items-center gap-2.5 rounded-pill border border-strong bg-surface/80 py-[5px] pl-[5px] pr-4 shadow-[0_8px_28px_-14px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <span
              className="inline-flex items-center rounded-pill px-2.5 py-[3px] font-body text-[11px] font-medium text-white"
              style={{ background: "linear-gradient(180deg, #FF8838, #E55A00)" }}
            >
              Leakproof
            </span>
            <span className="inline-flex items-center gap-2 font-body text-[12px] font-medium text-bodystrong">
              <span
                className="fi fi-au rounded-[2px]"
                style={{ fontSize: "11px" }}
                aria-hidden
              />
              For Australian creative agencies
            </span>
          </span>
        </motion.div>

        {/* headline — same word-stagger + serif payoff as the homepage */}
        {reduce ? (
          <h1 className="mt-8 max-w-[min(92vw,1040px)] font-display text-[clamp(2.5rem,7.4vw,5.4rem)] font-semibold leading-[1.03] tracking-[-0.028em] text-heading">
            <span className="block">Money you&apos;ve already earned.</span>
            <span className="serif-accent gradient-text block">
              Never billed.
            </span>
          </h1>
        ) : (
          <motion.h1
            variants={container}
            initial="hidden"
            animate="show"
            aria-label="Money you've already earned. Never billed."
            className="mt-8 max-w-[min(92vw,1040px)] font-display text-[clamp(2.5rem,7.4vw,5.4rem)] font-semibold leading-[1.03] tracking-[-0.028em] text-heading"
          >
            <span className="block" aria-hidden>
              {LINE1.map((w, i) => (
                <motion.span
                  key={`a${i}`}
                  variants={word}
                  className="mr-[0.26em] inline-block last:mr-0"
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <span className="mt-1 block" aria-hidden>
              {LINE2.map((w, i) => (
                <motion.span
                  key={`b${i}`}
                  variants={word}
                  className="serif-accent gradient-text mr-[0.24em] inline-block pr-[0.02em] last:mr-0"
                >
                  {w}
                </motion.span>
              ))}
            </span>
          </motion.h1>
        )}

        <motion.p
          {...item(0.9)}
          className="mt-7 max-w-lg font-body text-[16px] leading-relaxed text-bodystrong"
        >
          Leakproof is a forensic profit audit for creative agencies. We
          reconcile what you promised, what you delivered, and what you
          billed, then hand you an evidenced list of the money falling
          through the gaps.
        </motion.p>

        <motion.div
          {...item(1.05)}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <BookCallButton size="md" label="Book a 30-minute call" />
          <SecondaryButton size="md" onClick={() => scrollToId("#planes")}>
            See how it works
          </SecondaryButton>
        </motion.div>

        {/* the floor guarantee, up front */}
        <motion.p
          {...item(1.2)}
          className="mt-7 max-w-lg font-body text-[13.5px] leading-relaxed text-muted"
        >
          If we don&apos;t find at least{" "}
          <span className="font-mono font-medium text-flametext">
            A$100,000
          </span>{" "}
          a year of recoverable leak, you don&apos;t pay.
        </motion.p>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 1, delay: 1.5 },
            })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            Scroll
          </span>
          <motion.span
            className="block h-8 w-px bg-gradient-to-b from-flame/70 to-transparent"
            animate={reduce ? undefined : { scaleY: [1, 0.55, 1], opacity: [1, 0.45, 1] }}
            transition={
              reduce ? undefined : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
            }
            style={{ transformOrigin: "top" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
