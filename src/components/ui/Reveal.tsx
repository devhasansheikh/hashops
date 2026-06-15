"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ElementType, ReactNode } from "react";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
}

export function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 18,
  once = true,
  amount = 0.3,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  // The framer-motion proxy returns a stable, cached motion component for any
  // intrinsic tag string (motion.h2, motion.p, …).
  const MotionTag = (motion as unknown as Record<string, ElementType>)[
    as as string
  ];

  if (reduce) {
    const Tag = as as ElementType;
    return <Tag {...(rest as object)}>{children}</Tag>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
