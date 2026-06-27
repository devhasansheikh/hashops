"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReduceMotion } from "@/lib/useReduceMotion";
import { COUNTRIES, type Country } from "@/lib/booking/countries";
import { ease } from "./parts";

/** Real SVG country flag (flag-icons) — renders crisply on every OS. */
function Flag({ iso2, className = "" }: { iso2: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`fi fi-${iso2} ${className}`}
      style={{
        width: 22,
        height: 16,
        borderRadius: 3,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}
    />
  );
}

/** Phone input with a searchable country-code dropdown. */
export function PhoneField({
  country,
  number,
  onCountry,
  onNumber,
  invalid,
  inputRef,
}: {
  country: Country;
  number: string;
  onCountry: (c: Country) => void;
  onNumber: (v: string) => void;
  invalid?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  const reduce = useReduceMotion();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

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

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.dial.includes(s) ||
        c.iso2.includes(s),
    );
  }, [q]);

  return (
    <div ref={ref} className="relative">
      <div
        className={`flex items-stretch overflow-hidden rounded-btn border bg-surface2/50 transition-colors focus-within:ring-2 focus-within:ring-[var(--flame-glow)] ${
          invalid ? "border-danger/60" : "border-strong focus-within:border-flame"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex shrink-0 items-center gap-1.5 border-r border-strong px-3 font-body text-[15px] text-heading transition-colors hover:bg-surface2/60"
        >
          <Flag iso2={country.iso2} />
          <span className="text-bodystrong">{country.dial}</span>
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            className="text-muted"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: reduce ? 0 : 0.25, ease }}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </button>
        <input
          ref={inputRef}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={number}
          onChange={(e) => onNumber(e.target.value)}
          placeholder="555 123 4567"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 font-body text-[15px] text-heading placeholder:text-muted focus:outline-none"
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.2, ease }}
            style={{ originY: 0 }}
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-card border border-strong bg-surface shadow-2xl"
          >
            <div className="p-2">
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search country…"
                className="w-full rounded-btn border border-strong bg-surface2/50 px-3 py-2 font-body text-[14px] text-heading placeholder:text-muted focus:border-flame focus:outline-none"
              />
            </div>
            <ul role="listbox" className="max-h-56 overflow-auto px-1.5 pb-1.5">
              {filtered.map((c) => (
                <li key={c.iso2 + c.dial}>
                  <button
                    type="button"
                    onClick={() => {
                      onCountry(c);
                      setOpen(false);
                      setQ("");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-btn px-3 py-2 text-left font-body text-[14px] text-bodystrong transition-colors hover:bg-surface2/60 hover:text-heading"
                  >
                    <Flag iso2={c.iso2} />
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-muted">{c.dial}</span>
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-3 py-3 text-center font-body text-[13px] text-muted">
                  No match
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
