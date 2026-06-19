"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/** Thin Flame progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.3,
  });

  if (reduce) return null;

  return (
    <motion.div
      className="fixed left-0 top-0 z-[80] h-[2px] w-full origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #E55A00, #FF7A1A, #FFA033)",
      }}
      aria-hidden
    />
  );
}
