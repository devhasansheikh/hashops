"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useReduceMotion } from "@/lib/useReduceMotion";
import type { Slot } from "@/lib/booking/types";
import { ease, Notice } from "./parts";

export function visitorTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function tzOffsetLabel(tz: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value || "";
  } catch {
    return "";
  }
}

function dayLabel(iso: string, tz: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: tz,
  });
}

function timeLabel(iso: string, tz: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  });
}

function Shimmer() {
  return (
    <div className="space-y-5" aria-hidden>
      {[0, 1].map((g) => (
        <div key={g}>
          <div className="mb-2.5 h-3 w-32 animate-pulse rounded bg-surface2" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-11 animate-pulse rounded-btn bg-surface2"
                style={{ animationDelay: `${(g * 6 + i) * 40}ms` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SlotPicker({
  onPick,
  selected,
  slotsOverride,
  reloadKey = 0,
}: {
  onPick: (slot: Slot) => void;
  selected?: string | null;
  /** When provided, render these slots instead of fetching. */
  slotsOverride?: Slot[];
  /** Bump to force a re-fetch. */
  reloadKey?: number;
}) {
  const reduce = useReduceMotion();
  const tz = useMemo(() => visitorTimezone(), []);
  const offset = useMemo(() => tzOffsetLabel(tz), [tz]);
  const [slots, setSlots] = useState<Slot[] | null>(slotsOverride ?? null);
  const [loading, setLoading] = useState(!slotsOverride);
  const [configured, setConfigured] = useState(true);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (slotsOverride) {
      setSlots(slotsOverride);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    setErrored(false);
    fetch("/api/availability", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setSlots(Array.isArray(d.slots) ? d.slots : []);
        setConfigured(d.configured !== false && d.error !== "fetch_failed");
        if (d.error === "fetch_failed") setErrored(true);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setErrored(true);
        setSlots([]);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [slotsOverride, reloadKey]);

  const groups = useMemo(() => {
    if (!slots) return [];
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const k = dayLabel(s.startUtc, tz);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(s);
    }
    return Array.from(map, ([day, items]) => ({ day, items }));
  }, [slots, tz]);

  if (loading) return <Shimmer />;
  if (!configured)
    return (
      <Notice>
        Live booking isn&apos;t switched on yet. Email{" "}
        <a className="text-flametext hover:underline" href="mailto:info@hashops.io">
          info@hashops.io
        </a>{" "}
        and we&apos;ll lock in a time.
      </Notice>
    );
  if (errored)
    return (
      <Notice>
        We couldn&apos;t load times just now. Please try again in a moment, or email{" "}
        <a className="text-flametext hover:underline" href="mailto:info@hashops.io">
          info@hashops.io
        </a>
        .
      </Notice>
    );
  if (!slots || slots.length === 0)
    return (
      <Notice>
        No open times in the next few weeks. Email{" "}
        <a className="text-flametext hover:underline" href="mailto:info@hashops.io">
          info@hashops.io
        </a>{" "}
        and we&apos;ll find one.
      </Notice>
    );

  let idx = 0;
  return (
    <div>
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
        Times in your timezone · {tz}
        {offset ? ` (${offset})` : ""}
      </p>
      <div className="space-y-5">
        {groups.map((g) => (
          <div key={g.day}>
            <p className="mb-2.5 font-display text-[13.5px] font-semibold text-bodystrong">
              {g.day}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {g.items.map((s) => {
                const isSel = selected === s.startUtc;
                const i = idx++;
                return (
                  <motion.button
                    key={s.startUtc}
                    type="button"
                    onClick={() => onPick(s)}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduce ? 0 : 0.32,
                      ease,
                      delay: reduce ? 0 : Math.min(i * 0.025, 0.4),
                    }}
                    whileHover={reduce ? undefined : { y: -2 }}
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                    className={`rounded-btn border py-2.5 text-center font-display text-[14px] font-medium transition-colors duration-200 ${
                      isSel
                        ? "border-flame bg-[var(--flame-glow)] text-heading shadow-[0_6px_18px_-10px_var(--flame)]"
                        : "border-strong text-bodystrong hover:border-flame hover:bg-surface2/50 hover:text-heading"
                    }`}
                  >
                    {timeLabel(s.startUtc, tz)}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
