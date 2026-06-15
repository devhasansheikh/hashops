"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";

interface LenisCtx {
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
}

const Ctx = createContext<LenisCtx>({ scrollTo: () => {} });

export const useSmoothScroll = () => useContext(Ctx);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // honour reduced motion — native scroll only

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo: LenisCtx["scrollTo"] = (target, offset = -72) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset, duration: 1.25 });
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return <Ctx.Provider value={{ scrollTo }}>{children}</Ctx.Provider>;
}
