"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { CALENDLY_URL, SITE } from "@/lib/constants";
import { HashMark } from "@/components/ui/HashMark";
import { Close, Check } from "@/components/ui/icons";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

interface BookingCtx {
  open: () => void;
  close: () => void;
}
const Ctx = createContext<BookingCtx>({ open: () => {}, close: () => {} });
export const useBooking = () => useContext(Ctx);

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

function loadCalendlyScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    if (window.Calendly) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [ready, setReady] = useState(false);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();

  const open = useCallback(() => {
    setConfirmed(false);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  // Listen for a scheduled booking → confirmation state.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (
        e.data?.event &&
        typeof e.data.event === "string" &&
        e.data.event === "calendly.event_scheduled"
      ) {
        setConfirmed(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Body scroll lock + ESC to close.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  // Initialise the inline widget when the modal opens.
  useEffect(() => {
    if (!isOpen || confirmed) return;
    let cancelled = false;
    setReady(false);

    const isDark = resolvedTheme !== "light";
    const params = new URLSearchParams({
      hide_gdpr_banner: "1",
      primary_color: "ff7a1a",
      background_color: isDark ? "141417" : "ffffff",
      text_color: isDark ? "fafaf7" : "0a0a0b",
    });
    const url = `${CALENDLY_URL}?${params.toString()}`;

    loadCalendlyScript().then(() => {
      if (cancelled) return;
      // small delay so the parent element is laid out
      requestAnimationFrame(() => {
        if (cancelled || !widgetRef.current || !window.Calendly) {
          setReady(true);
          return;
        }
        widgetRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url,
          parentElement: widgetRef.current,
        });
        setReady(true);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen, confirmed, resolvedTheme]);

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Book your Ops Strategy Call"
          >
            <button
              aria-label="Close booking"
              onClick={close}
              className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative z-10 flex max-h-[90vh] w-full max-w-[480px] flex-col overflow-hidden rounded-card border border-line-strong bg-surface shadow-lift"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <HashMark className="h-6 w-6" />
                  <div className="leading-tight">
                    <p className="font-display text-[0.95rem] font-medium text-heading">
                      {SITE.cta}
                    </p>
                    <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-muted">
                      20 min · free audit
                    </p>
                  </div>
                </div>
                <button
                  onClick={close}
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-body transition-colors hover:border-line-strong hover:text-heading"
                >
                  <Close className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              {confirmed ? (
                <div className="flex flex-col items-center px-6 py-12 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 font-display text-[1.4rem] font-semibold text-heading">
                    You&apos;re booked.
                  </h3>
                  <p className="mt-2 max-w-xs text-[0.95rem] text-body">
                    Check your inbox for the calendar invite. We&apos;ll come
                    prepared with questions about your ops.
                  </p>
                  <button onClick={close} className="btn-primary mt-7 h-11 px-6 text-[0.95rem]">
                    Done
                  </button>
                </div>
              ) : (
                <div className="relative min-h-[560px] flex-1 overflow-y-auto bg-surface">
                  {!ready && (
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="flex flex-col items-center gap-3 text-muted">
                        <HashMark className="h-9 w-9 animate-float" />
                        <span className="font-mono text-xs uppercase tracking-eyebrow">
                          Loading calendar…
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={widgetRef} style={{ minWidth: 300, height: 600 }} />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
