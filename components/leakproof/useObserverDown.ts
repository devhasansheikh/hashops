"use client";

import { useSyncExternalStore } from "react";

/**
 * Is IntersectionObserver actually reporting?
 *
 * Every reveal on this page hangs off one, and a share link opens wherever the
 * reader happens to be: an in-app webview, a mail client's link opener, a
 * Safari View Controller, a low-power device. If the observer is missing,
 * throws on construction, or is present but silent, the page does not render
 * "unanimated" — it renders BLANK, because the resting state of a reveal is
 * opacity 0. This is deliberately not scoped to any one host or user agent;
 * the point is that we cannot know which engine gets the page.
 *
 * A real observer always delivers an initial callback for anything it
 * observes, on the next frame. A missing or stubbed one never does. So: watch
 * the root element for a moment and see. If nothing comes back, callers fall
 * back to revealing on mount, and the page is simply a page.
 *
 * One probe per document, shared by every caller.
 */
const GRACE_MS = 300;

type Status = "unknown" | "alive" | "down";

let status: Status = "unknown";
let started = false;
const listeners = new Set<() => void>();

function publish(next: Status) {
  if (status === next) return;
  status = next;
  listeners.forEach((l) => l());
}

function probe() {
  if (started || typeof window === "undefined") return;
  started = true;

  if (typeof IntersectionObserver === "undefined") {
    publish("down");
    return;
  }

  let reported = false;
  let observer: IntersectionObserver;
  try {
    observer = new IntersectionObserver(() => {
      reported = true;
    });
    observer.observe(document.documentElement);
  } catch {
    publish("down");
    return;
  }

  window.setTimeout(() => {
    observer.disconnect();
    publish(reported ? "alive" : "down");
  }, GRACE_MS);
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  probe();
  return () => {
    listeners.delete(onChange);
  };
}

const getSnapshot = () => status === "down";
const getServerSnapshot = () => false;

export function useObserverDown(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
