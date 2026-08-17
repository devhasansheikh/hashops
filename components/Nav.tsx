"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lockup } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BookCallButton } from "@/components/ui/Buttons";
import { scrollToId } from "@/components/SmoothScroll";
import { NAV_LINKS } from "@/lib/site";

type NavLink = { label: string; href: string };

/**
 * Floating glass pill nav — a blurred island under the top edge with an
 * animated active-section pill (scrollspy), aihub-style. Logo sits bare on
 * the left, CTA cluster on the right. Links default to the homepage
 * sections; subpages (e.g. /leakproof) pass their own. Hrefs starting with
 * "/" navigate as routes; "#" hrefs smooth-scroll (falling back to the
 * homepage anchor when the section isn't on the current page).
 */
export function Nav({ links = NAV_LINKS }: { links?: readonly NavLink[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy — the pill follows whichever nav section crosses mid-viewport.
  useEffect(() => {
    const targets = links
      .filter((l) => l.href.startsWith("#"))
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => Boolean(el));
    const hero = document.getElementById("top");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          setActive(e.target.id === "top" ? null : `#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    targets.forEach((el) => obs.observe(el));
    if (hero) obs.observe(hero);
    return () => obs.disconnect();
  }, [links]);

  const go = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith("#")) {
      // Route link — let the browser navigate normally.
      setOpen(false);
      return;
    }
    e.preventDefault();
    setOpen(false);
    if (document.querySelector(href)) {
      scrollToId(href);
    } else {
      // Section lives on the homepage — go there with the anchor.
      window.location.assign(`/${href}`);
    }
  };

  const island = `rounded-pill border backdrop-blur-xl transition-all duration-300 ${
    scrolled || open
      ? "border-strong bg-[var(--surface)]/80 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.55)]"
      : "border-line bg-[var(--surface)]/55 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.4)]"
  }`;

  return (
    <header className="fixed inset-x-0 top-0 z-[60] px-3 pt-3 sm:px-5 sm:pt-4">
      {/* Three equal-weight tracks, so the pill is centred on the VIEWPORT
          rather than on the leftover space between a narrow logo and a wider
          CTA cluster (justify-between pushed it ~78px left). */}
      <div className="mx-auto grid max-w-wide grid-cols-[1fr_auto_1fr] items-center gap-3">
        <a
          href="#top"
          onClick={(e) => go(e, "#top")}
          aria-label="HASH — back to top"
          className="col-start-1 shrink-0 justify-self-start transition-opacity hover:opacity-80"
        >
          <Lockup height={38} />
        </a>

        <nav
          className={`hidden items-center gap-0.5 justify-self-center p-1.5 lg:flex ${island}`}
          aria-label="Primary"
        >
          {links.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => go(e, link.href)}
                aria-current={isActive ? "true" : undefined}
                className={`relative rounded-pill px-4 py-[7px] font-body text-[13.5px] font-medium transition-colors duration-300 ${
                  isActive ? "text-heading" : "text-body hover:text-heading"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-pill border border-strong bg-surface2"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    aria-hidden
                  />
                )}
                <span className="relative z-[1]">{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* pinned to the last track explicitly: below `lg` the centre nav is
            display:none, and grid auto-placement would otherwise pull this
            cluster into the middle column instead of the right edge */}
        <div className="col-start-3 flex shrink-0 items-center gap-2.5 justify-self-end">
          <ThemeToggle />
          <div className="hidden sm:block">
            <BookCallButton size="sm" label="Book a call" />
          </div>
          <button
            className={`flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden ${island}`}
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.3, 1] }}
            className="mx-auto mt-3 max-w-wide overflow-hidden rounded-card border border-strong bg-[var(--bg)]/95 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => go(e, link.href)}
                  className={`rounded-btn px-3 py-3 font-body text-[15px] transition-colors hover:bg-surface hover:text-heading ${
                    active === link.href ? "bg-surface text-heading" : "text-bodystrong"
                  }`}
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
