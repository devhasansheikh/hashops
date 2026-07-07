"use client";

import { useEffect } from "react";

/**
 * Ultra-smooth section transitions: every top-level section (except the
 * hero) rises, sharpens, and fades in as a unit when it enters the
 * viewport. Classes are applied here so a no-JS render stays visible;
 * the PageLoader overlay hides the initial class swap.
 */
export function SectionFX() {
  useEffect(() => {
    if (document.documentElement.dataset.reduceMotion === "true") return;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section:not(#top)"),
    );
    sections.forEach((s) => s.classList.add("sxn"));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("sxn-in");
          obs.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );
    sections.forEach((s) => obs.observe(s));
    return () => {
      obs.disconnect();
      sections.forEach((s) => s.classList.remove("sxn", "sxn-in"));
    };
  }, []);
  return null;
}
