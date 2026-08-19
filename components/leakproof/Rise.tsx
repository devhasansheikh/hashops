"use client";

import { motion } from "framer-motion";
import { useCalm } from "@/components/leakproof/useCalm";

const EASE = [0.2, 0.7, 0.3, 1] as const;

const TAGS = { div: motion.div, li: motion.li } as const;

type RiseProps = {
  children: React.ReactNode;
  /** Seconds. Use `step(i)` so a stagger never exceeds 60ms per item. */
  delay?: number;
  /** Above-the-fold content animates on mount instead of on intersection. */
  immediate?: boolean;
  as?: keyof typeof TAGS;
  className?: string;
};

/**
 * The ONLY reveal on this page: an 8px rise and a fade, 400ms, once.
 *
 * Deliberately smaller and quicker than the homepage's `.sxn` band transition
 * (46px + blur + scale over ~1s, applied by SectionFX). This page is a
 * document you read straight through, not a sequence of stages you arrive at,
 * so nothing else moves on scroll — see Reconciliation for the one exception.
 */
export function Rise({
  children,
  delay = 0,
  immediate = false,
  as = "div",
  className,
}: RiseProps) {
  const calm = useCalm();
  const Motion = TAGS[as];

  if (calm) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const shown = { opacity: 1, y: 0 };

  return (
    <Motion
      className={className}
      initial={{ opacity: 0, y: 8 }}
      {...(immediate
        ? { animate: shown }
        : { whileInView: shown, viewport: { once: true, margin: "-64px" } })}
      transition={{ duration: 0.4, delay, ease: EASE }}
    >
      {children}
    </Motion>
  );
}
