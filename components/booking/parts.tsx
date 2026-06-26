"use client";

import { motion } from "framer-motion";
import { useReduceMotion } from "@/lib/useReduceMotion";

export const ease = [0.2, 0.7, 0.3, 1] as const;

export const inputClass =
  "w-full rounded-btn border border-strong bg-surface2/50 px-4 py-3 font-body text-[15px] text-heading placeholder:text-muted transition-colors focus:border-flame focus:outline-none focus:ring-2 focus:ring-[var(--flame-glow)]";

/** Slim flame progress bar with a soft glow; fill animates on each step. */
export function ProgressBar({ value }: { value: number }) {
  const reduce = useReduceMotion();
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface2/80">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: "linear-gradient(90deg, #E55A00, #FF7A1A 60%, #FFA033)",
          boxShadow: "0 0 12px -1px var(--flame)",
        }}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: reduce ? 0 : 0.6, ease }}
      />
    </div>
  );
}

export function StepHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-[clamp(1.3rem,3.2vw,1.7rem)] font-semibold leading-snug tracking-[-0.012em] text-heading">
      {children}
    </h3>
  );
}

/**
 * Premium selectable option: surface gradient, hover lift, spring tap, a left
 * flame accent that scales in on select, and a checkmark that draws itself.
 * `index` staggers its entrance reveal.
 */
export function OptionCard({
  label,
  selected,
  onSelect,
  index = 0,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  index?: number;
}) {
  const reduce = useReduceMotion();
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduce ? 0 : 0.05 + index * 0.045, duration: 0.32, ease }}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      className={`group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-btn border py-3.5 pl-5 pr-4 text-left font-body text-[15px] transition-colors duration-200 ${
        selected
          ? "border-flame bg-[var(--flame-glow)] text-heading"
          : "border-strong bg-surface2/25 text-bodystrong hover:border-flame/55 hover:bg-surface2/60 hover:text-heading"
      }`}
    >
      {/* left flame accent — scales in on select */}
      <motion.span
        aria-hidden
        className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full"
        style={{
          background: "linear-gradient(180deg, #FFA033, #E55A00)",
          transformOrigin: "center",
        }}
        initial={false}
        animate={{ scaleY: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.3, ease }}
      />
      <span>{label}</span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
          selected ? "border-flame bg-flame" : "border-strong group-hover:border-flame/55"
        }`}
        aria-hidden
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M4.5 12.5l5 5 10-11"
            stroke="#fff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease, delay: selected && !reduce ? 0.04 : 0 }}
          />
        </svg>
      </span>
    </motion.button>
  );
}

export function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 font-body text-[13px] font-medium text-bodystrong">
        {label}
        {required && <span className="text-flametext">*</span>}
        {hint && <span className="font-normal text-muted">{hint}</span>}
      </span>
      {children}
      {error && (
        <motion.span
          role="alert"
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease }}
          className="mt-1 block font-body text-[12.5px] text-danger"
        >
          {error}
        </motion.span>
      )}
    </label>
  );
}

export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-line bg-surface2/40 px-5 py-6 text-center font-body text-[14.5px] leading-relaxed text-body">
      {children}
    </div>
  );
}
