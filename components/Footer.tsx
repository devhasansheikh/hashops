"use client";

import { Lockup } from "@/components/Logo";
import { ArrowIcon } from "@/components/ui/Buttons";
import { useCalendly } from "@/components/CalendlyModal";
import { scrollToId } from "@/components/SmoothScroll";
import { Reveal } from "@/components/ui/Reveal";
import { BOOK_CTA, CONTACT_EMAIL, NAV_LINKS } from "@/lib/site";

export function Footer() {
  const { openCalendly } = useCalendly();

  return (
    <footer className="relative z-[1] border-t border-line bg-surface/60">
      <div className="mx-auto max-w-content px-6 pb-10 pt-16 sm:px-8">
        <Reveal className="grid gap-12 md:grid-cols-[1.5fr_1fr_1.2fr]">
          <div>
            <Lockup height={34} />
            <p className="mt-4 max-w-xs text-[14.5px] leading-relaxed text-body">
              Systems that let businesses scale without the chaos.
              Audit-first, ROI-justified, documented.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              Site
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(link.href);
                    }}
                    className="text-[14.5px] text-body transition-colors hover:text-heading"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              Contact
            </p>
            <ul className="mt-4 space-y-2.5 text-[14.5px]">
              <li>
                <button
                  onClick={openCalendly}
                  className="group inline-flex items-center gap-2 text-flametext transition-colors hover:text-heading"
                >
                  {BOOK_CTA}
                  <ArrowIcon className="transition-transform group-hover:translate-x-[3px]" />
                </button>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-body transition-colors hover:text-heading"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href="https://hashops.io"
                  className="text-body transition-colors hover:text-heading"
                >
                  hashops.io
                </a>
              </li>
            </ul>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 font-mono text-[11px] tracking-[0.08em] text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} HASH · hashops.io</span>
          <span>Working worldwide.</span>
        </div>
      </div>
    </footer>
  );
}
