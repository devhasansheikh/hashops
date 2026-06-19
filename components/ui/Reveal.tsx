"use client";

import { motion, useReducedMotion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  scale?: number;
  blur?: boolean;
  className?: string;
  once?: boolean;
};

/** Scroll-triggered fade-up. Renders static under prefers-reduced-motion. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  scale = 1,
  blur = false,
  className,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y,
        scale,
        ...(blur ? { filter: "blur(10px)" } : {}),
      }}
      whileInView={{ opacity: 1, y: 0, scale: 1, ...(blur ? { filter: "blur(0px)" } : {}) }}
      viewport={{ once, margin: "-72px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
