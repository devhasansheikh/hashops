"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { useReduceMotion } from "@/lib/useReduceMotion";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";

const ease = [0.2, 0.7, 0.3, 1] as const;
const WEEKS = 52;

/** Smoothly tweens a displayed number toward `target` once `active`. */
function useAnimatedNumber(target: number, active: boolean, reduce: boolean) {
  const [value, setValue] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      current.current = target;
      setValue(target);
      return;
    }
    const controls = animate(current.current, target, {
      duration: 0.4,
      ease,
      onUpdate: (v) => {
        current.current = v;
        setValue(v);
      },
    });
    return () => controls.stop();
  }, [target, active, reduce]);

  return Math.round(value);
}

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
  onChange: (n: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-[13.5px] font-medium text-bodystrong">
          {label}
        </label>
        <span className="rounded-lg border border-line bg-surface2 px-3 py-1 font-mono text-[13px] font-medium text-flametext tabular-nums">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        className="roi-slider mt-4"
        value={value}
        min={min}
        max={max}
        step={step}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(90deg, var(--ember), var(--sunrise) ${pct}%, var(--surface-2) ${pct}%, var(--surface-2))`,
        }}
      />
      <div className="mt-2 flex justify-between font-mono text-[10px] text-muted">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface2/50 px-4 py-3.5 text-center">
      <p className="font-display text-[19px] font-bold tracking-[-0.01em] text-heading tabular-nums sm:text-[21px]">
        {value}
      </p>
      <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
    </div>
  );
}

export function CostBlock() {
  const reduce = useReduceMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [hours, setHours] = useState(8);
  const [rate, setRate] = useState(35);

  const perWeek = hours * rate;
  const perYear = perWeek * WEEKS;
  const threeYear = perYear * 3;
  const hoursYear = hours * WEEKS;

  const animatedYear = useAnimatedNumber(perYear, inView, !!reduce);

  return (
    <section id="cost" className="relative px-5 py-24 sm:px-8">
      <SectionHead
        index="07"
        eyebrow="The math"
        title="Put your own numbers in."
        lead="Manual work never shows up on an invoice. Set the two sliders to your reality and watch what it quietly costs you, before you've paid a single salary."
      />

      <Reveal delay={0.12} scale={0.97} blur className="mx-auto mt-12 max-w-[820px]">
        <div
          ref={ref}
          className="surface-card overflow-hidden rounded-card border-strong p-6 shadow-[var(--window-shadow)] sm:p-10"
        >
          {/* inputs */}
          <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
            <Slider
              label="Hours / week lost to manual work"
              value={hours}
              min={1}
              max={40}
              step={1}
              format={(n) => `${n} hrs`}
              onChange={setHours}
            />
            <Slider
              label="Blended hourly rate"
              value={rate}
              min={15}
              max={250}
              step={5}
              format={money}
              onChange={setRate}
            />
          </div>

          <div className="my-8 h-px bg-line sm:my-9" />

          {/* headline result */}
          <div className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              What it&apos;s costing you
            </p>
            <p className="mt-2.5 whitespace-nowrap font-display text-[clamp(2.15rem,8vw,4.4rem)] font-bold leading-none tracking-[-0.02em]">
              <span className="gradient-text tabular-nums">
                {money(animatedYear)}
              </span>
              <span className="ml-1 text-[0.32em] font-semibold text-muted">
                /yr
              </span>
            </p>
          </div>

          {/* breakdown */}
          <div className="mt-8 grid grid-cols-3 gap-2.5 sm:gap-3">
            <Stat label="Per week" value={money(perWeek)} />
            <Stat label="Hours / year" value={`${hoursYear.toLocaleString("en-US")} hrs`} />
            <Stat
              label="3-year drag"
              value={money(threeYear)}
            />
          </div>

          {/* framing */}
          <p className="mx-auto mt-8 max-w-md text-center text-[14.5px] leading-relaxed text-bodystrong">
            That&apos;s the cost of doing nothing. A one-time systems build
            typically pays for itself in the first few months —{" "}
            <span className="font-display font-semibold text-flametext">
              every week after is recovered margin.
            </span>
          </p>

          <p className="mt-5 text-center font-mono text-[10.5px] text-muted">
            Estimate only · hours/week × rate × 52 weeks. The Audit replaces
            this guess with your real numbers.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
