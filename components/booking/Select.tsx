"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReduceMotion } from "@/lib/useReduceMotion";
import type { QuizOption } from "@/lib/booking/quiz";
import { ease } from "./parts";

/** Premium animated single-select (replaces the native <select>). */
export function Select({
  options,
  value,
  onChange,
  placeholder = "Select",
  invalid,
}: {
  options: QuizOption[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  invalid?: boolean;
}) {
  const reduce = useReduceMotion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-btn border bg-surface2/50 px-4 py-3 text-left font-body text-[15px] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--flame-glow)] ${
          invalid
            ? "border-danger/60"
            : open
              ? "border-flame"
              : "border-strong hover:border-flame/60"
        }`}
      >
        <span className={selected ? "text-heading" : "text-muted"}>
          {selected ? selected.label : placeholder}
        </span>
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0 text-muted"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.25, ease }}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.2, ease }}
            style={{ originY: 0 }}
            className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-card border border-strong bg-surface p-1.5 shadow-2xl"
          >
            {options.map((o) => {
              const sel = o.value === value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={sel}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-btn px-3.5 py-2.5 text-left font-body text-[14.5px] transition-colors ${
                      sel
                        ? "bg-[var(--flame-glow)] text-heading"
                        : "text-bodystrong hover:bg-surface2/60 hover:text-heading"
                    }`}
                  >
                    {o.label}
                    {sel && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-flame">
                        <path
                          d="M4.5 12.5l5 5 10-11"
                          stroke="currentColor"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
