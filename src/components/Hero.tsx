"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AvailabilityPill } from "./ui/AvailabilityPill";
import { BookButton } from "./ui/BookButton";
import { Button } from "./ui/Button";
import { Play } from "./ui/icons";
import { useSmoothScroll } from "./providers/SmoothScroll";

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollTo } = useSmoothScroll();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.09, delayChildren: 0.15 },
    },
  };
  const item = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 22 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <section
      id="top"
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 pb-20 pt-[var(--nav-height)] sm:px-8"
    >
      {/* Soft radial Flame glow behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] -z-[1] h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--flame-glow), transparent 68%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex max-w-3xl flex-col items-center text-center"
      >
        <motion.div variants={item}>
          <AvailabilityPill />
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-7 text-balance font-display text-[clamp(2.5rem,7vw,4.1rem)] font-semibold leading-[1.02] tracking-tightest text-heading"
        >
          Your business isn&apos;t disorganized.{" "}
          <span className="gradient-text">Your systems are.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-pretty text-[1.12rem] leading-relaxed text-body-strong"
        >
          Audit-first systems that scale your ops, not your headcount.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <BookButton size="md" />
          <Button
            variant="secondary"
            size="md"
            onClick={() => scrollTo("#walkthrough")}
            arrowIcon={<Play className="h-3.5 w-3.5" />}
            withArrow
          >
            Watch 90-sec walkthrough
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      {!reduce && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2"
        >
          <div className="flex h-9 w-[22px] items-start justify-center rounded-full border border-line-strong p-1.5">
            <motion.span
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-flame"
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
