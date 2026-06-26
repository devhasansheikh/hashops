"use client";

// In-built booking flow (replaces the old Calendly iframe). The provider name
// and `useCalendly().openCalendly()` API are kept so every existing CTA on the
// site opens this flow with no call-site changes.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONTACT_EMAIL } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { BookingFlow } from "@/components/booking/BookingFlow";

type BookingContextValue = {
  /** Kept for backwards-compat with existing CTAs. */
  openCalendly: () => void;
  open: () => void;
};

const BookingContext = createContext<BookingContextValue>({
  openCalendly: () => {},
  open: () => {},
});

export const useCalendly = () => useContext(BookingContext);
export const useBooking = () => useContext(BookingContext);

export function CalendlyProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openBooking = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  // Esc to close + scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Freeze Lenis smooth-scroll so the page behind the modal can't scroll.
    window.__lenis?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.__lenis?.start();
    };
  }, [open]);

  // Auto-open from ?book=1 (used by the "book again" link in cancellation emails).
  useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).get("book") === "1") {
        setOpen(true);
      }
    } catch {
      /* no-op */
    }
  }, []);

  return (
    <BookingContext.Provider value={{ openCalendly: openBooking, open: openBooking }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Book your Strategy Call"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={close}
            />
            {/* ambient flame glow behind the dialog */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,122,26,0.28), rgba(229,90,0,0.10) 50%, transparent 72%)",
              }}
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 340, damping: 30, mass: 0.9 }}
              className="relative z-10 flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-window border border-strong bg-surface shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="flex items-center gap-2.5">
                  <Logo wordmark={false} markSize={17} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-flametext">
                    Strategy Call
                  </span>
                </span>
                <button
                  onClick={close}
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

              <div
                data-lenis-prevent
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-7 sm:px-8"
              >
                <BookingFlow onClose={close} />
              </div>

              <div className="border-t border-line px-5 py-2.5 text-center font-body text-xs text-muted">
                Prefer email?{" "}
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
    </BookingContext.Provider>
  );
}
