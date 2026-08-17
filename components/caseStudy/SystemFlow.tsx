"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReduceMotion } from "@/lib/useReduceMotion";

const ease = [0.2, 0.7, 0.3, 1] as const;

/**
 * "How the system works" — the one rule the build rests on, drawn:
 * scattered sources feed a single record, which renders twice. The internal
 * view sees everything; each client view sees exactly one account.
 *
 * Deliberately schematic, not a screenshot: no client data, no Notion UI.
 */

const SOURCES = [
  { label: "GitHub work", d: "M9 19c-4 1.4-4-2.2-6-2.7m12 5.2v-3.6a3.1 3.1 0 0 0-.9-2.4c2.9-.3 6-1.4 6-6.4a5 5 0 0 0-1.4-3.4 4.6 4.6 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.6 0C6.4 1.9 5.3 2.2 5.3 2.2a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 3.8 9.2c0 4.9 3 6 5.9 6.4a3.1 3.1 0 0 0-.9 2.3v3.6" },
  { label: "Scoping calls", d: "M4.5 4h15A1.5 1.5 0 0 1 21 5.5v10a1.5 1.5 0 0 1-1.5 1.5H8l-4 4V5.5A1.5 1.5 0 0 1 4.5 4z" },
  { label: "Client approvals", d: "M9 12.5l2 2 4.5-5M12 3l8 4v5c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V7l8-4z" },
  { label: "Payments", d: "M3 7.5h18v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-11zM3 10.5h18M6.5 4h11" },
];

function SourceIcon({ d }: { d: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

export function SystemFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReduceMotion();
  const play = inView && !reduce;

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: play ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.55, delay, ease },
        };

  return (
    <div ref={ref} className="surface-card rounded-card p-6 sm:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-flametext">
        One record, rendered twice
      </p>
      <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-body">
        Internal truth and client view are the same data. The difference is
        what each one is allowed to show.
      </p>

      <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_auto_minmax(0,1.15fr)] lg:items-center">
        {/* inputs */}
        <div className="flex flex-col gap-2">
          {SOURCES.map((s, i) => (
            <motion.div
              key={s.label}
              {...rise(0.05 + i * 0.07)}
              className="flex items-center gap-2.5 rounded-xl border border-line bg-surface2/60 px-3 py-2"
            >
              <span className="text-flametext" aria-hidden>
                <SourceIcon d={s.d} />
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-bodystrong">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* flow arrow into the core */}
        <motion.div
          {...rise(0.35)}
          className="flex items-center justify-center lg:h-full lg:flex-col"
          aria-hidden
        >
          <svg
            viewBox="0 0 60 12"
            className="h-3 w-16 rotate-90 text-flametext lg:rotate-0"
            fill="none"
          >
            <path
              d="M1 6h50"
              stroke="var(--border-strong)"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <motion.circle
              r="2.4"
              cy="6"
              fill="currentColor"
              {...(reduce || !play
                ? { cx: 51 }
                : {
                    animate: { cx: [1, 51] },
                    transition: {
                      duration: 2.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  })}
            />
            <path d="M47 2.5L51.5 6 47 9.5" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </motion.div>

        {/* core + the two renders */}
        <div className="flex flex-col gap-3">
          <motion.div
            {...rise(0.45)}
            className="rounded-xl border border-flame/40 px-4 py-3"
            style={{
              background:
                "linear-gradient(135deg, var(--flame-glow), transparent 75%)",
            }}
          >
            <p className="font-display text-[14px] font-semibold text-heading">
              One project record
            </p>
            <p className="mt-1 text-[12px] leading-snug text-body">
              Planned date, actual date, owner of the gap
            </p>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2">
            <motion.div
              {...rise(0.58)}
              className="rounded-xl border border-line bg-surface2/60 p-3.5"
            >
              <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-flametext">
                Internal view
              </p>
              <p className="mt-1.5 font-display text-[13.5px] font-semibold text-heading">
                Every account
              </p>
              <p className="mt-1 text-[11.5px] leading-snug text-body">
                Phase, workload, blockers, delay, margin signals
              </p>
            </motion.div>

            <motion.div
              {...rise(0.68)}
              className="relative overflow-hidden rounded-xl border border-line bg-surface2/60 p-3.5"
            >
              <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--success)]">
                Client view
              </p>
              <p className="mt-1.5 font-display text-[13.5px] font-semibold text-heading">
                Their account only
              </p>
              <p className="mt-1 text-[11.5px] leading-snug text-body">
                Read-only, published, isolated from every other client
              </p>
            </motion.div>
          </div>

          <motion.p
            {...rise(0.8)}
            className="text-[11.5px] leading-snug text-muted"
          >
            Tested from an outside browser on a clean account until the client
            view showed exactly what it should and nothing else.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
