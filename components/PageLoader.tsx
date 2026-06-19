"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/Logo";

const ease = [0.2, 0.7, 0.3, 1] as const;

/**
 * Fast branded intro showing the official HASH lockup, then clears quickly so
 * first paint isn't blocked.
 */
export function PageLoader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), reduce ? 300 : 1250);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [reduce]);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease }}
        >
          <motion.div
            className="relative"
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease }}
          >
            {/* glow behind the mark */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[180px] w-[260px] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,122,26,0.22), transparent 70%)",
              }}
              aria-hidden
            />
            {/* official HASH mark */}
            <Logo wordmark={false} markSize={120} className="relative" />
          </motion.div>

          {!reduce && (
            <div className="mt-7 h-px w-[140px] overflow-hidden bg-[var(--border-strong)]">
              <motion.div
                className="h-full w-full origin-left"
                style={{
                  background: "linear-gradient(90deg,#E55A00,#FFA033)",
                  willChange: "transform",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.0, ease }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
