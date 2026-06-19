"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => setMounted(true), []);

  const dark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="group relative flex h-[32px] w-[62px] items-center rounded-pill border border-strong bg-surface2 p-[3px] transition-colors duration-300 hover:border-flame/50"
      style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.25)" }}
    >
      {/* faint track icons */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-[9px] text-muted">
        <MoonIcon size={11} faded />
        <SunIcon size={11} faded />
      </span>

      {/* sliding knob */}
      <motion.span
        className="relative z-[1] flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.16)]"
        animate={{ x: dark ? 0 : 30 }}
        transition={{ type: "spring", stiffness: 480, damping: 32 }}
        style={{
          background: dark
            ? "linear-gradient(160deg, #2A2A30, #131316)"
            : "linear-gradient(160deg, #FF8838, #E55A00)",
          boxShadow: dark
            ? "0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)"
            : "0 4px 12px -2px rgba(216,87,6,0.6), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={dark ? "moon" : "sun"}
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.3, 1] }}
            className="flex text-white"
          >
            {dark ? <MoonIcon size={13} /> : <SunIcon size={13} />}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}

function SunIcon({ size = 12, faded = false }: { size?: number; faded?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity: faded ? 0.5 : 1 }} aria-hidden>
      <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7L17 17M7 7L5.3 5.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ size = 12, faded = false }: { size?: number; faded?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity: faded ? 0.5 : 1 }} aria-hidden>
      <path
        d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
