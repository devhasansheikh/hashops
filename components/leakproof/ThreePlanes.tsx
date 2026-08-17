"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { useReduceMotion } from "@/lib/useReduceMotion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

const ease = [0.2, 0.7, 0.3, 1] as const;

const PLANES = [
  {
    letter: "A",
    title: "Contracted",
    desc: "Fees, included hours, rate cards, renewal dates. It lives in PDFs, Google Docs and old email threads. No system holds it.",
    checked: "Checked by nobody",
  },
  {
    letter: "B",
    title: "Delivered",
    desc: "Time entries, who did the work, what actually shipped. It lives in Harvest, Toggl, Clockify or your PM tool.",
    checked: "Checked loosely",
  },
  {
    letter: "C",
    title: "Billed",
    desc: "Invoices raised, amounts, dates, payments received. It lives in Xero, and it's the only record anyone reconciles.",
    checked: "Checked by your bookkeeper",
  },
];

function useCountUp(to: number, play: boolean, reduce: boolean, duration = 1.8) {
  const [v, setV] = useState(reduce ? to : 0);
  const started = useRef(false);
  useEffect(() => {
    if (reduce) {
      setV(to);
      return;
    }
    if (!play || started.current) return;
    started.current = true;
    const controls = animate(0, to, {
      duration,
      ease,
      onUpdate: (x) => setV(x),
    });
    return () => controls.stop();
  }, [play, reduce, to, duration]);
  return v;
}

const aud = (n: number) => `A$${Math.round(n).toLocaleString("en-AU")}`;

/**
 * The reconciliation, drawn: one client, one month, three records that
 * don't line up. The mismatch segments are the leak. (Illustrative bars,
 * same faux-UI language as the homepage OpsWorkspace.)
 */
function ReconWidget() {
  const reduce = useReduceMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px -15% 0px" });
  const play = inView && !reduce;
  const leak = useCountUp(8800, play, reduce);

  // Contracted A$12,000 is the baseline at 62% width.
  const BASE = 62;
  const rows = [
    {
      label: "A · Contracted",
      value: "A$12,000",
      width: BASE,
      gap: null,
    },
    {
      label: "B · Delivered",
      value: "A$17,800",
      width: BASE,
      // work done past the contracted scope
      gap: { left: BASE, width: BASE * (5800 / 12000), kind: "over" as const },
    },
    {
      label: "C · Billed",
      value: "A$9,000",
      width: BASE * (9000 / 12000),
      // contracted fee that never became an invoice
      gap: {
        left: BASE * (9000 / 12000),
        width: BASE * (3000 / 12000),
        kind: "missing" as const,
      },
    },
  ];

  const bar = (play: boolean, delay: number) =>
    reduce
      ? {}
      : {
          initial: { scaleX: 0 },
          animate: play ? { scaleX: 1 } : { scaleX: 0 },
          transition: { duration: 0.9, delay, ease },
        };

  return (
    <div
      ref={ref}
      className="surface-card rounded-card p-6 sm:p-8"
      aria-label="Illustration: one client's contracted, delivered and billed records compared for one month"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-flametext">
          The reconciliation · one client, one month
        </p>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" aria-hidden />
          Read-only
        </span>
      </div>

      <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        {/* the three ledger rows */}
        <div className="min-w-0 space-y-5">
          {rows.map((row, i) => (
            <div key={row.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-bodystrong">
                  {row.label}
                </span>
                <span className="font-mono text-[12px] font-medium tabular-nums text-heading">
                  {row.value}
                </span>
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-surface2">
                {/* baseline marker at the contracted fee */}
                <span
                  className="absolute top-0 z-[1] h-full w-px bg-[var(--border-strong)]"
                  style={{ left: `${BASE}%` }}
                  aria-hidden
                />
                <motion.div
                  className="h-full origin-left rounded-full"
                  style={{
                    width: `${row.width}%`,
                    background:
                      "linear-gradient(90deg, var(--surface-2), var(--border-strong))",
                    border: "1px solid var(--border-strong)",
                  }}
                  {...bar(play, 0.15 + i * 0.2)}
                />
                {row.gap && (
                  <motion.div
                    className="absolute top-0 h-full origin-left rounded-full"
                    style={{
                      left: `${row.gap.left}%`,
                      width: `${row.gap.width}%`,
                      background:
                        row.gap.kind === "over"
                          ? "linear-gradient(90deg, var(--ember), var(--sunrise))"
                          : "repeating-linear-gradient(115deg, var(--ember) 0 5px, transparent 5px 9px)",
                      opacity: 0.9,
                    }}
                    {...(reduce
                      ? {}
                      : {
                          initial: { scaleX: 0, opacity: 0 },
                          animate: play
                            ? { scaleX: 1, opacity: [0.55, 0.95, 0.55] }
                            : { scaleX: 0, opacity: 0 },
                          transition: {
                            scaleX: { duration: 0.8, delay: 0.9 + i * 0.2, ease },
                            opacity: {
                              duration: 2.4,
                              delay: 1.7,
                              repeat: Infinity,
                              ease: "easeInOut",
                            },
                          },
                        })}
                  />
                )}
              </div>
            </div>
          ))}

          {/* what the highlighted segments mean */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
            <span className="flex items-center gap-2 text-[11.5px] text-body">
              <span
                className="h-2 w-3.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--ember), var(--sunrise))",
                }}
                aria-hidden
              />
              A$5,800 delivered past scope
            </span>
            <span className="flex items-center gap-2 text-[11.5px] text-body">
              <span
                className="h-2 w-3.5 rounded-full"
                style={{
                  background:
                    "repeating-linear-gradient(115deg, var(--ember) 0 4px, transparent 4px 7px)",
                }}
                aria-hidden
              />
              A$3,000 contracted, never invoiced
            </span>
          </div>
        </div>

        {/* the number that falls out */}
        <div className="border-t border-line pt-6 text-left lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-flametext">
            The mismatch
          </p>
          <p className="mt-2 font-display text-[34px] font-bold leading-none tabular-nums text-heading">
            {aud(leak)}
          </p>
          <p className="mt-2 max-w-[180px] text-[11.5px] leading-snug text-body">
            recoverable, from one client, in one month. Now multiply by your
            client list and a year.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ThreePlanes() {
  return (
    <section id="planes" className="relative px-5 py-24 sm:px-8">
      <SectionHead
        index="01"
        eyebrow="The blind spot"
        title={
          <>
            Three sets of records.{" "}
            <span className="serif-accent gradient-text">
              Nobody lines them up.
            </span>
          </>
        }
        lead="Every agency keeps a record of what it promised, what it delivered, and what it billed. Money falls into the gaps between them, while every report in the business still looks fine."
      />

      <div className="mx-auto mt-14 grid max-w-content gap-5 lg:grid-cols-3">
        {PLANES.map((plane, i) => (
          <Reveal key={plane.letter} delay={i * 0.1} className="h-full">
            <article className="surface-card surface-card-lift group flex h-full flex-col rounded-card p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-line font-mono text-[15px] font-medium text-flametext transition-all duration-300 ease-premium group-hover:scale-110 group-hover:border-flame/50"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--flame-glow), transparent 70%)",
                  }}
                  aria-hidden
                >
                  {plane.letter}
                </span>
                <h3 className="font-display text-[19px] font-semibold text-heading">
                  {plane.title}
                </h3>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-body">
                {plane.desc}
              </p>
              <p className="mt-auto pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {plane.checked}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      {/* the sentence that closes the sale, given the centerpiece */}
      <Reveal delay={0.15} className="mx-auto mt-12 max-w-2xl text-center">
        <p className="font-display text-[clamp(1.25rem,2.4vw,1.6rem)] font-medium leading-snug tracking-[-0.01em] text-heading">
          Your accountant sees what was billed. Your project manager sees what
          was done.{" "}
          <span className="serif-accent gradient-text">
            Nobody sees what was promised.
          </span>{" "}
          We line up all three.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-12 max-w-[880px]">
        <ReconWidget />
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mx-auto mt-8 max-w-md text-center text-[14px] text-muted">
          A leak is any mismatch between the three. No tool you already pay
          for spans them, which is why every dashboard says you&apos;re fine.
        </p>
      </Reveal>
    </section>
  );
}
