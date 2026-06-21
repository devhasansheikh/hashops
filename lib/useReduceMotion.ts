"use client";

import { useSyncExternalStore } from "react";

/**
 * Site-level reduced-motion preference.
 *
 * Defaults to FALSE (motion ON) and is intentionally NOT tied to the OS
 * `prefers-reduced-motion` setting — so the site's animations play on every
 * device, which is the behaviour the brand wants. A future on-site "reduce
 * motion" toggle can set `data-reduce-motion="true"` on <html> to calm things;
 * this hook reflects that attribute reactively (and the CSS, Lenis smooth
 * scroll, and WebGL backdrop read the same attribute).
 *
 * Use this in place of framer-motion's `useReducedMotion()`, whose public hook
 * reads the OS media query directly and ignores <MotionConfig> — which is what
 * was silently disabling the marquee + reveals on phones with OS Reduce Motion.
 */
const ATTR = "data-reduce-motion";

function subscribe(onChange: () => void) {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [ATTR],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.getAttribute(ATTR) === "true";
}

function getServerSnapshot() {
  return false;
}

export function useReduceMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
