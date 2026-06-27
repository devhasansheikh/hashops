"use client";

import { motion } from "framer-motion";
import { useReduceMotion } from "@/lib/useReduceMotion";
import type { QuizOption } from "@/lib/booking/quiz";

/** Multi-select toggle chips (e.g. "What tools do you use now?"). */
export function Chips({
  options,
  value,
  onToggle,
}: {
  options: QuizOption[];
  value: string[];
  onToggle: (v: string) => void;
}) {
  const reduce = useReduceMotion();
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const sel = value.includes(o.value);
        return (
          <motion.button
            key={o.value}
            type="button"
            onClick={() => onToggle(o.value)}
            aria-pressed={sel}
            whileTap={reduce ? undefined : { scale: 0.95 }}
            className={`inline-flex items-center gap-1.5 rounded-pill border px-3.5 py-2 font-body text-[13.5px] transition-colors duration-200 ${
              sel
                ? "border-flame bg-[var(--flame-glow)] text-heading"
                : "border-strong bg-surface2/30 text-bodystrong hover:border-flame/60 hover:text-heading"
            }`}
          >
            {sel && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-flame">
                <path
                  d="M4.5 12.5l5 5 10-11"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {o.label}
          </motion.button>
        );
      })}
    </div>
  );
}
