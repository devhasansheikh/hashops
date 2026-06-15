"use client";

import { Logo } from "./ui/Logo";
import { BookButton } from "./ui/BookButton";
import { NAV_LINKS, SITE, SOCIALS } from "@/lib/constants";
import { useSmoothScroll } from "./providers/SmoothScroll";

export function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-content px-6 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-body">
              Operational systems for service businesses.
            </p>
            <div className="mt-6">
              <BookButton size="sm" />
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-muted">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                    className="text-[0.95rem] text-body transition-colors hover:text-heading"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-muted">
              Connect
            </p>
            <ul className="mt-4 space-y-2.5">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.95rem] text-body transition-colors hover:text-heading"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-[0.95rem] text-flame-text transition-colors hover:text-flame"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[0.72rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} HASH · {SITE.domain}
          </p>
          <p>{SITE.location} · Building for US, UK & Australia</p>
        </div>
      </div>
    </footer>
  );
}
