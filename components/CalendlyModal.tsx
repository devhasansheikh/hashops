"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { CALENDLY_URL, CONTACT_EMAIL } from "@/lib/site";

type CalendlyContextValue = {
  openCalendly: () => void;
};

const CalendlyContext = createContext<CalendlyContextValue>({
  openCalendly: () => {},
});

export const useCalendly = () => useContext(CalendlyContext);

export function CalendlyProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [booked, setBooked] = useState(false);
  const { resolvedTheme } = useTheme();

  const openCalendly = useCallback(() => {
    setBooked(false);
    setOpen(true);
  }, []);

  // Confirmation state: Calendly posts events from inside the iframe.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (
        typeof e.origin === "string" &&
        e.origin.includes("calendly.com") &&
        e.data?.event === "calendly.event_scheduled"
      ) {
        setBooked(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Esc to close + scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const dark = resolvedTheme !== "light";
  const embedUrl =
    `${CALENDLY_URL}?hide_gdpr_banner=1&primary_color=FF7A1A` +
    `&background_color=${dark ? "141417" : "ffffff"}` +
    `&text_color=${dark ? "FAFAF7" : "0A0A0B"}`;

  return (
    <CalendlyContext.Provider value={{ openCalendly }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Book your Ops Strategy Call"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.2, 0.7, 0.3, 1] }}
              className="relative z-10 flex h-[min(760px,90dvh)] w-full max-w-[1000px] flex-col overflow-hidden rounded-window border border-strong bg-surface shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-flametext">
                    Ops Strategy Call
                  </span>
                  {booked && (
                    <span className="rounded-pill bg-success/15 px-2.5 py-0.5 font-mono text-[11px] text-success">
                      Booked
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close booking dialog"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-body transition hover:border-flame hover:text-heading"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 2l10 10M12 2L2 12"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {booked ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4.5 12.5l5 5 10-11"
                        stroke="var(--success)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-heading">
                    You&apos;re booked.
                  </h3>
                  <p className="max-w-md text-body">
                    The invite is on its way to your inbox. Before the call,
                    note the three places your week leaks the most time. We
                    take it from there.
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="btn-secondary mt-2 px-5 py-2.5 text-sm"
                  >
                    Back to the site
                  </button>
                </div>
              ) : (
                <iframe
                  src={embedUrl}
                  title="Book your Ops Strategy Call with HASH"
                  className="h-full w-full flex-1 bg-surface"
                  loading="eager"
                />
              )}

              <div className="border-t border-line px-5 py-2.5 text-center font-body text-xs text-muted">
                Calendar not loading? Email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-flametext underline-offset-2 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CalendlyContext.Provider>
  );
}
