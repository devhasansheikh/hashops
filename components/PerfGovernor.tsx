"use client";

import { useEffect } from "react";

/**
 * Keeps the site smooth without touching anything visible. The design is
 * sacred: no rule here may change how the site looks (user directive).
 *
 * 1. Offscreen idling — infinite CSS loops (marquees, reviews wall, quiz
 *    halo, gradient-text shimmer) are paused while out of the viewport and
 *    resumed just before they re-enter. Zero visual change by definition.
 *
 * 2. Adaptive shader resolution — a passive frame-time monitor runs for
 *    the first ~30s of the session. If it sees *sustained* dropped frames
 *    (not a one-off spike), it sets data-perf="lite" on <html>. The ONLY
 *    consumer is the hero shader, which drops its internal render scale
 *    (imperceptible on a soft glow field — every visual layer stays).
 *    No CSS reads this attribute. The decision is remembered for the
 *    session so later pages start smooth.
 */

const LOOP_SELECTOR = ".marquee-track, .reviews-col, .quiz-halo, .gradient-text";

export function PerfGovernor() {
  // 1 — pause infinite CSS loops while offscreen
  useEffect(() => {
    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          e.target.toggleAttribute("data-anim-off", !e.isIntersecting);
        }
      },
      { rootMargin: "140px 0px 140px 0px" },
    );
    const scan = () => {
      document.querySelectorAll(LOOP_SELECTOR).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();
    // second pass catches anything mounted after the intro loader
    const t = window.setTimeout(scan, 3500);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, []);

  // 2 — adaptive lite tier for machines that can't hold the frame rate
  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.reduceMotion === "true") return;

    let stored: string | null = null;
    try {
      stored = sessionStorage.getItem("hash-perf");
    } catch {
      /* storage unavailable — just monitor */
    }
    if (stored === "lite") {
      html.dataset.perf = "lite";
      return;
    }

    const goLite = () => {
      html.dataset.perf = "lite";
      try {
        sessionStorage.setItem("hash-perf", "lite");
      } catch {
        /* no-op */
      }
    };

    // hard signals: data-saver or very low memory devices go lite up front
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    if (nav.connection?.saveData || (nav.deviceMemory ?? 8) <= 2) {
      goLite();
      return;
    }

    // Passive monitor: from 2.5s (after the loader + entrance burst) to 30s.
    // A frame over 40ms has missed at least two 60Hz vsyncs; 12 of those
    // inside any rolling 3s window is sustained jank, not a spike.
    let raf = 0;
    let cancelled = false;
    let last = 0;
    const longFrames: number[] = [];
    const END = performance.now() + 30000;

    const tick = (now: number) => {
      if (cancelled) return;
      if (last) {
        const d = now - last;
        // ignore tab-hidden / debugger gaps
        if (d > 40 && d < 250) {
          longFrames.push(now);
          while (longFrames.length && now - longFrames[0] > 3000) {
            longFrames.shift();
          }
          if (longFrames.length >= 12) {
            goLite();
            return;
          }
        }
      }
      last = now;
      if (now < END) raf = requestAnimationFrame(tick);
    };

    const t = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 2500);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
