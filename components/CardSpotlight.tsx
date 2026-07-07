"use client";

import { useEffect } from "react";

/**
 * One delegated pointer listener that makes every `.surface-card` feel alive:
 *  - sets --mx/--my for the cursor-following Flame spotlight
 *    (consumed by `.surface-card::before` in globals.css)
 *  - sets --rx/--ry on `.surface-card-lift` cards for a cursor-following
 *    3D tilt (the card leans toward the pointer; CSS transition smooths it)
 */
export function CardSpotlight() {
  useEffect(() => {
    const reduce = document.documentElement.dataset.reduceMotion === "true";
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const card = t?.closest?.(".surface-card") as HTMLElement | null;
      if (!card) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
        if (!reduce && card.classList.contains("surface-card-lift")) {
          card.style.setProperty("--rx", `${((0.5 - py) * 4).toFixed(2)}deg`);
          card.style.setProperty("--ry", `${((px - 0.5) * 4).toFixed(2)}deg`);
        }
      });
    };

    const onOut = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const card = t?.closest?.(".surface-card-lift") as HTMLElement | null;
      if (!card) return;
      const to = e.relatedTarget as Node | null;
      if (to && card.contains(to)) return;
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
