"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { BookCallButton } from "@/components/ui/Buttons";
import { Magnetic } from "@/components/ui/Magnetic";

const ease = [0.2, 0.7, 0.3, 1] as const;

type WidgetProps = { play: boolean; reduce: boolean };

/* ------------------------------------------------------------------ */
/* Small inline icons                                                  */
/* ------------------------------------------------------------------ */
const ICON_PROPS = {
  width: 21,
  height: 21,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function CheckMini({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STEP_ICONS = [
  // Audit — magnifier
  <svg key="audit" {...ICON_PROPS} aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>,
  // Structure — layout / modules
  <svg key="structure" {...ICON_PROPS} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 9v12" />
  </svg>,
  // Operate & Scale — trending up
  <svg key="scale" {...ICON_PROPS} aria-hidden>
    <path d="M3 17l6-6 4 4 7-7" />
    <path d="M16 8h5v5" />
  </svg>,
  // Optimize — sliders / tune
  <svg key="optimize" {...ICON_PROPS} aria-hidden>
    <path d="M4 6h18M4 12h18M4 18h18" />
    <circle cx="9" cy="6" r="2.2" fill="currentColor" stroke="none" />
    <circle cx="16" cy="12" r="2.2" fill="currentColor" stroke="none" />
    <circle cx="8" cy="18" r="2.2" fill="currentColor" stroke="none" />
  </svg>,
  // Onboarding — user plus
  <svg key="onboarding" {...ICON_PROPS} aria-hidden>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.6 20a5.8 5.8 0 0 1 10.8 0" />
    <path d="M18 8v6M15 11h6" />
  </svg>,
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const frame =
  "rounded-xl border border-line bg-surface2/50 p-3.5 backdrop-blur-sm";

/** Counts 0→to once whenever the widget becomes active. */
function useCountUp(to: number, play: boolean, reduce: boolean, duration = 1.4) {
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) {
      setV(to);
      return;
    }
    if (!play) {
      setV(0);
      return;
    }
    const controls = animate(0, to, { duration, ease, onUpdate: (x) => setV(x) });
    return () => controls.stop();
  }, [play, to, reduce, duration]);
  return Math.round(v);
}

/* ------------------------------------------------------------------ */
/* 1. Audit — radar diagnostic scan                                    */
/* ------------------------------------------------------------------ */
function ScanWidget({ play, reduce }: WidgetProps) {
  const leaks = useCountUp(3, play, reduce, 1.6);
  const blips = [
    { x: 70, y: 26, t: 0.16 },
    { x: 34, y: 60, t: 0.52 },
    { x: 64, y: 72, t: 0.78 },
  ];
  return (
    <div className={frame}>
      <div className="flex items-center gap-4">
        <div className="relative h-[100px] w-[100px] shrink-0">
          <div className="absolute inset-0 rounded-full border border-line" />
          <div className="absolute inset-[20%] rounded-full border border-line" />
          <div className="absolute inset-[40%] rounded-full border border-line" />
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--border)]" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--border)]" />
          {/* sweeping beam */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(255,122,26,0.32) 46deg, transparent 66deg)",
              willChange: "transform",
            }}
            animate={play ? { rotate: 360 } : { rotate: 0 }}
            transition={
              play
                ? { duration: 2.6, repeat: Infinity, ease: "linear" }
                : { duration: 0.3 }
            }
          />
          {/* leak blips */}
          {blips.map((b, i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-flame"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                boxShadow: "0 0 8px 1px rgba(255,122,26,0.75)",
                willChange: "transform, opacity",
              }}
              animate={
                play
                  ? { opacity: [0, 0, 1, 0.85, 0], scale: [0.4, 0.4, 1.5, 1, 0.7] }
                  : { opacity: 0.9, scale: 1 }
              }
              transition={
                play
                  ? {
                      duration: 2.6,
                      repeat: Infinity,
                      times: [0, b.t, b.t + 0.05, b.t + 0.4, 1],
                      ease,
                    }
                  : { duration: 0.3 }
              }
            />
          ))}
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-flametext" />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-flametext">
            Diagnostic scan
          </p>
          <p className="mt-1.5 font-display text-[26px] font-bold leading-none text-heading tabular-nums">
            {leaks}
            <span className="text-[0.46em] font-semibold text-muted"> / 7 leaks</span>
          </p>
          <p className="mt-2 text-[11px] leading-snug text-body">
            Pinpointing where hours and margin leak across all seven layers.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Structure — systems connect into one core, data pulses inward    */
/* ------------------------------------------------------------------ */
function BuildWidget({ play, reduce }: WidgetProps) {
  const hub = { x: 100, y: 60 };
  const sats = [
    { x: 26, y: 30 },
    { x: 26, y: 90 },
    { x: 100, y: 20 },
    { x: 174, y: 30 },
    { x: 174, y: 90 },
  ];
  return (
    <div className={frame}>
      <p className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-flametext">
        Connecting your stack
      </p>
      <svg viewBox="0 0 200 120" className="w-full" style={{ height: 118 }}>
        {/* edges drawing in */}
        {sats.map((s, i) => (
          <motion.line
            key={`l${i}`}
            x1={hub.x}
            y1={hub.y}
            x2={s.x}
            y2={s.y}
            stroke="var(--border-strong)"
            strokeWidth="1"
            initial={false}
            animate={play ? { pathLength: [0, 1, 1, 1] } : { pathLength: 1 }}
            transition={
              play
                ? {
                    duration: 3.4,
                    repeat: Infinity,
                    times: [0, 0.22 + i * 0.05, 0.92, 1],
                    ease,
                  }
                : { duration: 0.3 }
            }
          />
        ))}
        {/* data pulses traveling into the hub */}
        {play &&
          sats.map((s, i) => (
            <motion.circle
              key={`p${i}`}
              r="2.2"
              fill="#FF7A1A"
              animate={{ cx: [s.x, hub.x], cy: [s.y, hub.y], opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.4 + i * 0.16,
                ease: "easeInOut",
              }}
            />
          ))}
        {/* satellite nodes */}
        {sats.map((s, i) => (
          <g key={`s${i}`}>
            <motion.circle
              cx={s.x}
              cy={s.y}
              fill="var(--surface)"
              stroke="var(--border-strong)"
              animate={play ? { r: [0, 11, 11, 0] } : { r: 11 }}
              transition={
                play
                  ? {
                      duration: 3.4,
                      repeat: Infinity,
                      times: [0, 0.2 + i * 0.05, 0.92, 1],
                      ease,
                    }
                  : { duration: 0.3 }
              }
            />
            <motion.circle
              cx={s.x}
              cy={s.y}
              fill="#FF7A1A"
              animate={play ? { r: [0, 2.4, 2.4, 0] } : { r: 2.4 }}
              transition={
                play
                  ? {
                      duration: 3.4,
                      repeat: Infinity,
                      times: [0, 0.24 + i * 0.05, 0.92, 1],
                      ease,
                    }
                  : { duration: 0.3 }
              }
            />
          </g>
        ))}
        {/* pulsing hub */}
        <motion.circle
          cx={hub.x}
          cy={hub.y}
          fill="none"
          stroke="#FF7A1A"
          strokeWidth="1.5"
          animate={play ? { r: [15, 24], opacity: [0.55, 0] } : { r: 15, opacity: 0 }}
          transition={
            play
              ? { duration: 1.9, repeat: Infinity, ease: "easeOut" }
              : { duration: 0.3 }
          }
        />
        <circle
          cx={hub.x}
          cy={hub.y}
          r="15"
          fill="var(--surface-2)"
          stroke="rgba(255,122,26,0.65)"
          strokeWidth="1.5"
        />
        <text
          x={hub.x}
          y={hub.y + 3}
          textAnchor="middle"
          fontSize="7.5"
          fill="var(--heading)"
          fontFamily="monospace"
          letterSpacing="0.5"
        >
          OPS
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Operate & Scale — area chart draws and trends up                 */
/* ------------------------------------------------------------------ */
function ScaleWidget({ play, reduce }: WidgetProps) {
  const hrs = useCountUp(12, play, reduce, 1.8);
  const line = "M4 70 L42 60 L80 64 L118 44 L156 50 L196 14";
  const area = `${line} L196 80 L4 80 Z`;
  return (
    <div className={frame}>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-flametext">
          Hours recovered / week
        </span>
        <span className="font-display text-[16px] font-bold leading-none text-heading tabular-nums">
          +{hrs}
        </span>
      </div>
      <svg
        viewBox="0 0 200 80"
        className="w-full"
        style={{ height: 86 }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="scaleArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 40, 60].map((y) => (
          <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="var(--border)" strokeWidth="0.5" />
        ))}
        <motion.path
          d={area}
          fill="url(#scaleArea)"
          initial={false}
          animate={play ? { opacity: [0, 1, 1, 0] } : { opacity: 1 }}
          transition={
            play
              ? { duration: 4, repeat: Infinity, times: [0, 0.45, 0.86, 1], ease }
              : { duration: 0.3 }
          }
        />
        <motion.path
          d={line}
          fill="none"
          stroke="#FF8A3D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={play ? { pathLength: [0, 1, 1, 0] } : { pathLength: 1 }}
          transition={
            play
              ? { duration: 4, repeat: Infinity, times: [0, 0.45, 0.86, 1], ease }
              : { duration: 0.3 }
          }
        />
        <motion.circle
          cx="196"
          cy="14"
          r="3"
          fill="#FFA033"
          style={{ filter: "drop-shadow(0 0 4px rgba(255,160,51,0.85))" }}
          animate={play ? { opacity: [0, 0, 1, 0] } : { opacity: 1 }}
          transition={
            play
              ? { duration: 4, repeat: Infinity, times: [0, 0.42, 0.55, 1], ease }
              : { duration: 0.3 }
          }
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Optimize — live tuning bars + counting efficiency metric         */
/* ------------------------------------------------------------------ */
function OptimizeWidget({ play, reduce }: WidgetProps) {
  const eff = useCountUp(94, play, reduce, 1.8);
  const rows = [
    { label: "Automations", to: 92 },
    { label: "Dashboards", to: 76 },
    { label: "SOPs", to: 100 },
  ];
  return (
    <div className={frame}>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-flametext">
          System efficiency
        </span>
        <span className="font-display text-[16px] font-bold leading-none text-heading tabular-nums">
          {eff}%
        </span>
      </div>
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div key={r.label}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10.5px] text-bodystrong">{r.label}</span>
              <motion.span
                className="text-success"
                animate={play ? { opacity: [0, 0, 1, 1, 0] } : { opacity: 1 }}
                transition={
                  play
                    ? {
                        duration: 3.6,
                        repeat: Infinity,
                        times: [0, 0.32 + i * 0.07, 0.42 + i * 0.07, 0.92, 1],
                        ease,
                      }
                    : { duration: 0.3 }
                }
              >
                <CheckMini size={11} />
              </motion.span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface">
              <motion.div
                className="h-full origin-left rounded-full bg-gradient-to-r from-ember to-sunrise"
                style={{ width: `${r.to}%`, willChange: "transform" }}
                animate={play ? { scaleX: [0, 1, 1, 0] } : { scaleX: 1 }}
                transition={
                  play
                    ? {
                        duration: 3.6,
                        repeat: Infinity,
                        times: [0, 0.3 + i * 0.07, 0.9, 1],
                        ease,
                      }
                    : { duration: 0.3 }
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Onboarding — ramp progress ring + completing checklist           */
/* ------------------------------------------------------------------ */
function OnboardingWidget({ play, reduce }: WidgetProps) {
  const days = useCountUp(4, play, reduce, 1.5);
  const steps = ["Access granted", "Playbook read", "First task shipped", "Running solo"];
  return (
    <div className={frame}>
      <div className="flex items-center gap-4">
        <div className="relative h-[74px] w-[74px] shrink-0">
          <svg viewBox="0 0 74 74" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="rampGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E55A00" />
                <stop offset="100%" stopColor="#FFA033" />
              </linearGradient>
            </defs>
            <circle cx="37" cy="37" r="31" fill="none" stroke="var(--border)" strokeWidth="4" />
            <motion.circle
              cx="37"
              cy="37"
              r="31"
              fill="none"
              stroke="url(#rampGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={false}
              animate={play ? { pathLength: [0, 1, 1, 0] } : { pathLength: 1 }}
              transition={
                play
                  ? { duration: 4, repeat: Infinity, times: [0, 0.62, 0.88, 1], ease }
                  : { duration: 0.3 }
              }
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-[19px] font-bold leading-none text-heading tabular-nums">
              {days}
            </span>
            <span className="mt-0.5 font-mono text-[7.5px] uppercase tracking-[0.1em] text-muted">
              days
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          {steps.map((s, i) => (
            <motion.div
              key={s}
              className="flex items-center gap-2 text-[11px] text-bodystrong"
              style={{ willChange: "transform, opacity" }}
              animate={
                play ? { opacity: [0.3, 1, 1, 0.3], x: [-4, 0, 0, -4] } : { opacity: 1, x: 0 }
              }
              transition={
                play
                  ? {
                      duration: 4,
                      repeat: Infinity,
                      times: [0, 0.16 + i * 0.16, 0.88, 1],
                      ease,
                    }
                  : { duration: 0.3 }
              }
            >
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-flame/15 text-flame">
                <CheckMini size={9} />
              </span>
              {s}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */
type Step = {
  title: string;
  desc: string;
  Widget: (p: WidgetProps) => React.ReactElement;
};

const STEPS: Step[] = [
  {
    title: "Audit",
    desc: "A 7-day diagnostic across all seven layers of your operation. You get a written Bottleneck Report with your top three leaks costed in hours and dollars.",
    Widget: ScanWidget,
  },
  {
    title: "Structure",
    desc: "We build the one or two systems the report says will pay for themselves first — dashboards, automations, and a workspace that matches how you actually run.",
    Widget: BuildWidget,
  },
  {
    title: "Operate & Scale",
    desc: "Your team runs the new system live while we make sure it holds up under real volume — and scales with you instead of breaking at the next tier.",
    Widget: ScaleWidget,
  },
  {
    title: "Optimize",
    desc: "We read how the system actually gets used, then tighten it: pruning friction, sharpening automations, and compounding the wins the audit surfaced.",
    Widget: OptimizeWidget,
  },
  {
    title: "Onboarding",
    desc: "We turn your operation into something teachable — documented playbooks and onboarding so every new hire ramps in days, not months, without shadowing you.",
    Widget: OnboardingWidget,
  },
];

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-flametext transition-all duration-300 ease-premium group-hover:scale-110 group-hover:border-flame/50"
      style={{ background: "linear-gradient(135deg, var(--flame-glow), transparent 70%)" }}
      aria-hidden
    >
      {children}
    </span>
  );
}

function StepHeader({ index }: { index: number }) {
  return (
    <div className="flex items-center gap-3">
      <IconTile>{STEP_ICONS[index]}</IconTile>
      <span className="rounded-pill border border-line bg-surface2 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-flametext">
        Step 0{index + 1}
      </span>
    </div>
  );
}

export function ProcessSteps() {
  const reduce = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { margin: "-10% 0px -10% 0px" });
  const play = inView && !reduce;

  return (
    <section id="process" className="relative px-5 py-24 sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[55%] w-[min(900px,100vw)] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--flame-glow), transparent 72%)",
        }}
      />

      <SectionHead
        index="05"
        eyebrow="How it works"
        title={
          <>
            Simple, smart, and{" "}
            <span className="gradient-text">built to scale.</span>
          </>
        }
        lead="Five steps from first diagnostic to a team that runs the system without you. No retainer pitch on day one — the audit decides what gets built."
      />

      <div
        ref={gridRef}
        className="mx-auto mt-14 grid max-w-content gap-5 sm:mt-16 lg:grid-cols-2"
      >
        {STEPS.map((step, i) => {
          const { Widget } = step;
          const isLast = i === STEPS.length - 1;
          return (
            <Reveal
              key={step.title}
              delay={(i % 2) * 0.08}
              y={28}
              blur
              className={`h-full ${isLast ? "lg:col-span-2" : ""}`}
            >
              <article
                className={`surface-card surface-card-lift group h-full rounded-card p-6 sm:p-7 ${
                  isLast ? "lg:flex lg:items-center lg:gap-10" : "flex flex-col"
                }`}
              >
                <div className={isLast ? "lg:flex-1" : ""}>
                  <StepHeader index={i} />
                  <h3 className="mt-4 font-display text-[20px] font-semibold tracking-[-0.01em] text-heading sm:text-[22px]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-body">
                    {step.desc}
                  </p>
                </div>
                <div className={`mt-5 ${isLast ? "lg:mt-0 lg:w-[46%] lg:shrink-0" : ""}`}>
                  <Widget play={play} reduce={!!reduce} />
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal
        delay={0.05}
        className="mx-auto mt-12 flex max-w-xl flex-col items-center gap-5 text-center"
      >
        <p className="text-[14.5px] leading-relaxed text-body">
          It starts with the free Ops Strategy Call — the audit, run live on your
          business in 60 minutes.
        </p>
        <Magnetic strength={0.35} className="inline-flex">
          <BookCallButton size="md" />
        </Magnetic>
      </Reveal>
    </section>
  );
}
