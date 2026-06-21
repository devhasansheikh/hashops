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

const LINE1 = ["Your", "business", "isn’t", "disorganized."];
const LINE2 = ["Your", "systems", "are."];

export function Hero() {
  const reduce = useReduceMotion();
  const ref = useRef<HTMLElement>(null);

  // Scroll-linked parallax — the hero gracefully drifts + fades as you leave it.
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
      {/* soft glow that lifts the headline off the 3D field */}
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
        {/* availability pill */}
        <motion.div {...item(0.05)}>
          <span className="inline-flex items-center gap-2.5 rounded-pill border border-strong bg-surface/80 py-[5px] pl-[5px] pr-4 shadow-[0_8px_28px_-14px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <span
              className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-[3px] font-body text-[11px] font-medium text-white"
              style={{ background: "linear-gradient(180deg, #FF8838, #E55A00)" }}
            >
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              3 spots
            </span>
            <span className="font-body text-[12px] font-medium text-bodystrong">
              Available for new clients
            </span>
          </span>
        </motion.div>

        {/* dominant headline with word-stagger reveal */}
        {reduce ? (
          <h1 className="mt-8 max-w-[15ch] font-display text-[clamp(2.5rem,7.2vw,5.1rem)] font-semibold leading-[1.04] tracking-[-0.025em] text-heading">
            Your business isn&rsquo;t disorganized.{" "}
            <span className="gradient-text">Your systems are.</span>
          </h1>
        ) : (
          <motion.h1
            variants={container}
            initial="hidden"
            animate="show"
            aria-label="Your business isn’t disorganized. Your systems are."
            className="mt-8 max-w-[15ch] font-display text-[clamp(2.5rem,7.2vw,5.1rem)] font-semibold leading-[1.04] tracking-[-0.025em] text-heading"
          >
            <span className="inline-block" aria-hidden>
              {LINE1.map((w, i) => (
                <motion.span
                  key={`a${i}`}
                  variants={word}
                  className="mr-[0.26em] inline-block"
                >
                  {w}
                </motion.span>
              ))}
            </span>{" "}
            <span className="inline-block" aria-hidden>
              {LINE2.map((w, i) => (
                <motion.span
                  key={`b${i}`}
                  variants={word}
                  className="gradient-text mr-[0.26em] inline-block"
                >
                  {w}
                </motion.span>
              ))}
            </span>
          </motion.h1>
        )}

        <motion.p
          {...item(0.9)}
          className="mt-7 max-w-md font-body text-[16px] leading-relaxed text-bodystrong"
        >
          Audit-first systems that scale your ops, not your headcount.
        </motion.p>

        <motion.div
          {...item(1.05)}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <BookCallButton size="md" />
          <SecondaryButton size="md" onClick={() => scrollToId("#video")}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2.5 1.5l8 4.5-8 4.5v-9z" fill="currentColor" />
            </svg>
            Watch 90-sec walkthrough
          </SecondaryButton>
        </motion.div>
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
