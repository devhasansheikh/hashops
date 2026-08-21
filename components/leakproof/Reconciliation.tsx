"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { useCalm } from "@/components/leakproof/useCalm";
import { useObserverDown } from "@/components/leakproof/useObserverDown";
import { Rise } from "@/components/leakproof/Rise";
import { step } from "@/components/leakproof/stagger";

const EASE = [0.2, 0.7, 0.3, 1] as const;

/* The worked example. Illustrative, and labelled as such on the page — these
   are the only numbers here, and nothing is derived beyond the arithmetic. */
const CONTRACTED = 12_000;
const DELIVERED = 17_800;
const BILLED = 9_000;
const OVERRUN = DELIVERED - CONTRACTED; // 5,800 delivered past scope
const SHORTFALL = CONTRACTED - BILLED; // 3,000 contracted, never invoiced
const RECOVERABLE = OVERRUN + SHORTFALL; // 8,800

/* One shared scale for all three bars: the largest record is full width, so
   the mismatch is legible as LENGTH before anyone reads a number. */
const SCALE = DELIVERED;
const pct = (n: number) => (n / SCALE) * 100;

const aud = (n: number) => `A$${Math.round(n).toLocaleString("en-AU")}`;

type Row = {
  key: string;
  name: string;
  value: number;
  /** Neutral fill: the part of the bar that is simply accounted for. */
  base: number;
  gap: {
    from: number;
    to: number;
    kind: "over" | "short";
    amount: number;
    note: string;
  } | null;
};

const ROWS: Row[] = [
  { key: "A", name: "Contracted", value: CONTRACTED, base: CONTRACTED, gap: null },
  {
    key: "B",
    name: "Delivered",
    value: DELIVERED,
    base: CONTRACTED,
    gap: {
      from: CONTRACTED,
      to: DELIVERED,
      kind: "over",
      amount: OVERRUN,
      note: "delivered past scope",
    },
  },
  {
    key: "C",
    name: "Billed",
    value: BILLED,
    base: BILLED,
    gap: {
      from: BILLED,
      to: CONTRACTED,
      kind: "short",
      amount: SHORTFALL,
      note: "contracted, never invoiced",
    },
  },
];

const FILL = {
  base: "var(--muted)",
  over: "linear-gradient(90deg, var(--ember), var(--sunrise))",
  short:
    "repeating-linear-gradient(115deg, var(--ember) 0 5px, transparent 5px 10px)",
} as const;

/**
 * Visibility, checked two ways.
 *
 * The bars are the page argument, and plenty of arrivals land here in a
 * constrained webview: a viewport short enough that a percentage rootMargin
 * leaves very little band to intersect, in an engine nobody here has tested.
 * If the IntersectionObserver never reports, the figure renders as three empty
 * troughs and a counter stuck on zero, which reads as a broken page rather
 * than a page that chose not to animate.
 *
 * So there are two more paths. The shared probe catches an observer that is
 * missing or silent outright. Measuring the rect on scroll and resize catches
 * the subtler case: an observer that works elsewhere but never reports THIS
 * element, in a viewport shorter than the margins assume. Whichever path fires
 * first wins, and the listeners remove themselves the moment one does. Below
 * the fold with a working observer, nothing here ever runs.
 */
function useRevealed() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const observerDown = useObserverDown();
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    if (inView || measured) return;
    const check = () => {
      const el = ref.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.9 && box.bottom > 0) {
        setMeasured(true);
      }
    };
    const settle = window.setTimeout(check, 1200);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [inView, measured]);

  return { ref, revealed: inView || observerDown || measured };
}

/** Counts once, after the bars have drawn. Static under reduced motion. */
function useTally(play: boolean, calm: boolean) {
  const [v, setV] = useState(calm ? RECOVERABLE : 0);
  const started = useRef(false);

  useEffect(() => {
    if (calm) {
      setV(RECOVERABLE);
      return;
    }
    if (!play || started.current) return;
    started.current = true;
    const controls = animate(0, RECOVERABLE, {
      duration: 1.2,
      delay: 0.85,
      ease: EASE,
      onUpdate: (x) => setV(x),
    });
    return () => controls.stop();
  }, [play, calm]);

  return v;
}

/**
 * The page's one signature visual, and the only thing on it that asks for
 * attention: three records drawn on a shared scale so the money falling
 * between them is a shape, not a paragraph. Plain divs and existing tokens —
 * no chart library.
 */
function Bars() {
  const calm = useCalm();
  const { ref, revealed } = useRevealed();
  const play = revealed && !calm;
  const tally = useTally(revealed, calm);

  const draw = (delay: number, width: number, duration: number) =>
    calm
      ? { style: { width: `${width}%` } }
      : {
          initial: { width: 0 },
          animate: play ? { width: `${width}%` } : { width: 0 },
          transition: { duration, delay, ease: EASE },
        };

  return (
    <figure
      ref={ref}
      className="surface-card mt-12 rounded-card p-5 sm:p-8"
    >
      <figcaption className="sr-only">
        Illustrative example, one client over one month, drawn on a shared
        scale. A, contracted: A$12,000. B, delivered: A$17,800, which is
        A$5,800 more than was contracted. C, billed: A$9,000, which is A$3,000
        less than was contracted. The two gaps come to A$8,800 recoverable.
      </figcaption>

      <div aria-hidden>
        <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 border-b border-line pb-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-flametext">
            Illustrative · one client, one month
          </p>
          {/* desktop garnish — on a phone the label above already wraps and a
              second line of mono would read as clutter */}
          <p className="hidden font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted sm:block">
            One shared scale
          </p>
        </div>

        <div className="mt-7 space-y-7 sm:space-y-8">
          {ROWS.map((row, i) => (
            <div key={row.key}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[11px] font-medium text-flametext">
                    {row.key}
                  </span>
                  <span className="font-display text-[15px] font-semibold tracking-[-0.01em] text-heading sm:text-[16px]">
                    {row.name}
                  </span>
                </p>
                <span className="whitespace-nowrap font-mono text-[13px] font-medium tabular-nums text-heading sm:text-[14px]">
                  {aud(row.value)}
                </span>
              </div>

              <div
                className="relative mt-2.5 h-4 overflow-hidden rounded-[4px] bg-surface2 shadow-[inset_0_0_0_1px_var(--border)]"
              >
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{ background: FILL.base }}
                  {...draw(0.08 + i * 0.1, pct(row.base), 0.7)}
                />
                {row.gap && (
                  <motion.div
                    className="absolute inset-y-0"
                    style={{
                      left: `${pct(row.gap.from)}%`,
                      background: FILL[row.gap.kind],
                    }}
                    {...draw(
                      0.52 + i * 0.1,
                      pct(row.gap.to) - pct(row.gap.from),
                      0.55,
                    )}
                  />
                )}
                {/* The contracted line, carried across all three bars: A ends
                    on it, B runs past it, C stops short of it. Painted in the
                    page background so it reads as a notch cut through both the
                    neutral fill and the flame, in either theme. */}
                <span
                  className="absolute inset-y-0 z-[2] w-[2px]"
                  style={{
                    left: `calc(${pct(CONTRACTED)}% - 1px)`,
                    background: "var(--bg)",
                  }}
                />
              </div>

              {row.gap && (
                <div
                  className="ml-0 mt-1.5 max-w-full sm:ml-[var(--ind)] sm:max-w-[calc(100%-var(--ind))]"
                  style={
                    {
                      "--ind": `${pct(row.gap.from)}%`,
                    } as React.CSSProperties
                  }
                >
                  <span className="mb-1 hidden h-2 w-px bg-[var(--border-strong)] sm:block" />
                  <p className="text-[12px] leading-snug text-body sm:text-[12.5px]">
                    <span className="whitespace-nowrap font-mono font-medium text-flametext">
                      {row.gap.kind === "over" ? "+" : "−"}
                      {aud(row.gap.amount)}
                    </span>{" "}
                    {row.gap.note}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-9 flex flex-wrap items-baseline gap-x-3 gap-y-2 border-t border-line pt-7">
          <span className="whitespace-nowrap font-mono text-[13px] tabular-nums text-body sm:text-[14px]">
            {aud(OVERRUN)}
          </span>
          <span className="font-mono text-[13px] text-muted sm:text-[14px]">+</span>
          <span className="whitespace-nowrap font-mono text-[13px] tabular-nums text-body sm:text-[14px]">
            {aud(SHORTFALL)}
          </span>
          <span className="font-mono text-[13px] text-muted sm:text-[14px]">=</span>
          <span className="whitespace-nowrap pl-1 font-display text-[clamp(2rem,5vw,2.9rem)] font-bold leading-none tabular-nums text-flametext">
            {aud(tally)}
          </span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
            Recoverable
          </span>
        </p>
      </div>
    </figure>
  );
}

const RECORDS = [
  {
    key: "A",
    name: "Contracted",
    what: "what you promised",
    where: "PDFs, Google Docs, old email threads",
    who: "Nobody",
    orphan: true,
  },
  {
    key: "B",
    name: "Delivered",
    what: "what your team actually did",
    where: "Harvest, Toggl, or your PM tool",
    who: "Loosely",
    orphan: false,
  },
  {
    key: "C",
    name: "Billed",
    what: "what you invoiced",
    where: "Xero",
    who: "Your bookkeeper",
    orphan: false,
  },
];

export function Reconciliation() {
  return (
    <section className="relative px-5 sm:px-8">
      <div className="mx-auto max-w-content border-t border-line py-16 sm:py-20">
        <Rise>
          <h2 className="max-w-[18ch] font-display text-[clamp(1.85rem,3.9vw,2.7rem)] font-semibold leading-[1.1] tracking-[-0.028em] text-heading">
            Three sets of records.{" "}
            <span className="serif-accent gradient-text">
              Nobody lines them up.
            </span>
          </h2>
        </Rise>

        <Rise delay={step(1)} className="mt-10">
          <table className="w-full border-collapse text-left">
            <thead className="hidden sm:table-header-group">
              <tr>
                {["Record", "Where it lives", "Who checks it"].map((h, i) => (
                  <th
                    key={h}
                    scope="col"
                    className={`border-b border-line pb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted ${
                      i === 0 ? "w-[38%]" : i === 1 ? "w-[38%]" : "w-[24%]"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECORDS.map((r) => (
                <tr
                  key={r.key}
                  className="block border-b border-line py-5 sm:table-row sm:py-0"
                >
                  <td className="block align-top sm:table-cell sm:border-b sm:border-line sm:py-5 sm:pr-6">
                    <span className="flex items-baseline gap-2.5">
                      <span className="font-mono text-[11px] font-medium text-flametext">
                        {r.key}
                      </span>
                      <span className="font-display text-[16px] font-semibold tracking-[-0.01em] text-heading sm:text-[17px]">
                        {r.name}
                      </span>
                    </span>
                    <span className="mt-1 block pl-[22px] text-[14px] text-body">
                      {r.what}
                    </span>
                  </td>
                  <td className="mt-3 block pl-[22px] align-top text-[14px] leading-relaxed text-body sm:mt-0 sm:table-cell sm:border-b sm:border-line sm:py-5 sm:pl-0 sm:pr-6">
                    <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:hidden">
                      Where it lives
                    </span>
                    {r.where}
                  </td>
                  <td className="mt-3 block pl-[22px] align-top text-[14px] leading-relaxed sm:mt-0 sm:table-cell sm:border-b sm:border-line sm:py-5 sm:pl-0">
                    <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:hidden">
                      Who checks it
                    </span>
                    <span className={r.orphan ? "text-flametext" : "text-body"}>
                      {r.who}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Rise>

        <Rise delay={step(2)}>
          <Bars />
        </Rise>

        <Rise delay={step(3)}>
          <p className="mt-10 max-w-[62ch] text-[16px] leading-relaxed text-bodystrong sm:text-[17px]">
            Your accountant sees{" "}
            <span className="font-mono text-flametext">C</span>. Your project
            manager sees <span className="font-mono text-flametext">B</span>.
            Nobody owns <span className="font-mono text-flametext">A</span>. No
            tool you already pay for spans all three, which is why every
            dashboard says you&apos;re fine.
          </p>
        </Rise>
      </div>
    </section>
  );
}
