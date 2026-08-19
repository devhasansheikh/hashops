"use client";

import { useSyncExternalStore } from "react";

/**
 * Reduced-motion gate for the Leakproof page only.
 *
 * The site as a whole deliberately IGNORES the OS `prefers-reduced-motion`
 * flag (see lib/useReduceMotion.ts) because an OS-level setting was silently
 * disabling animations that content depends on — the tool marquee never
 * scrolled, section reveals never fired, and phones with Reduce Motion on saw
 * a half-empty page.
 *
 * Nothing on this page works that way. Every animation here is decorative and
 * the still version IS the complete page: copy fully visible, bars drawn at
 * their final width, the counter at its final value. So this page can safely
 * honour the OS request as well as the site attribute, and does.
 */
const ATTR = "data-reduce-motion";
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [ATTR],
  });
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    mq.removeEventListener("change", onChange);
  };
}

function getSnapshot() {
  return (
    document.documentElement.getAttribute(ATTR) === "true" ||
    window.matchMedia(QUERY).matches
  );
}

function getServerSnapshot() {
  return false;
}

export function useCalm(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
