"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lockup } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BookCallButton } from "@/components/ui/Buttons";
import { scrollToId } from "@/components/SmoothScroll";
import { NAV_LINKS } from "@/lib/site";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      <div
        className={`transition-all duration-300 ${
          scrolled || open
            ? "border-b border-line bg-[var(--bg)]/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto grid h-[66px] max-w-wide grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8">
          <a
            href="#top"
            onClick={(e) => go(e, "#top")}
            aria-label="HASH — back to top"
            className="justify-self-start transition-opacity hover:opacity-80"
          >
            <Lockup height={26} />
          </a>

          <nav className="hidden items-center gap-7 justify-self-center lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => go(e, link.href)}
                className="group relative font-body text-[13.5px] font-medium text-body transition-colors hover:text-heading"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-flame transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 justify-self-end">
            <ThemeToggle />
            <div className="hidden sm:block">
              <BookCallButton size="sm" label="Book a call" />
            </div>
            <button
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-lg border border-line lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className="h-px w-4 bg-heading transition-transform duration-300"
                style={{
                  transform: open ? "translateY(3px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="h-px w-4 bg-heading transition-transform duration-300"
                style={{
                  transform: open ? "translateY(-3px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.3, 1] }}
            className="border-b border-line bg-[var(--bg)]/95 backdrop-blur-xl lg:hidden"
          >
            <nav
              className="mx-auto flex max-w-wide flex-col gap-1 px-5 py-4 sm:px-8"
              aria-label="Mobile"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => go(e, link.href)}
                  className="rounded-lg px-3 py-3 font-body text-[15px] text-bodystrong transition-colors hover:bg-surface hover:text-heading"
                >
                  {link.label}
                </a>
              ))}
              <div className="px-3 pb-2 pt-3">
                <BookCallButton size="md" className="w-full" />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
