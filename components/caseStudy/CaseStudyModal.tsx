"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { CaseStudy } from "@/lib/caseStudies";
import { CountUp } from "@/components/ui/CountUp";
import { SystemFlow } from "@/components/caseStudy/SystemFlow";
import { BookCallButton } from "@/components/ui/Buttons";
import { Logo } from "@/components/Logo";

const TIER_ICONS: Record<string, string> = {
  control:
    "M3 13h4l2.5-6 3 12 2.5-6H21M3.5 4.5h17A1.5 1.5 0 0 1 22 6v12a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18V6a1.5 1.5 0 0 1 1.5-1.5z",
  isolate:
    "M8 11V7.5a4 4 0 1 1 8 0V11M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM12 15v2",
  project:
    "M4.5 3h9L19 8.5V21a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM13 3v6h6M7.5 13.5l2 2 4.5-5",
  // the shared record layer everything else reads from
  spine:
    "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  // parallel business hubs, identical in shape
  hubs: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  // staged flow, e.g. a content pipeline
  pipeline:
    "M3 7h5l2.5 5H21M3 17h5l2.5-5M18 4l3 3-3 3M18 14l3 3-3 3",
  // a private, filtered-to-one-person layer
  personal:
    "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 21a7.5 7.5 0 0 1 15 0",
};

function TierIcon({ kind }: { kind: string }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={TIER_ICONS[kind] ?? TIER_ICONS.project} />
    </svg>
  );
}

function DbIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="relative inline-flex" aria-label={`${rating} out of 5`}>
      <span className="inline-flex text-[var(--border-strong)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} />
        ))}
      </span>
      <span
        className="absolute left-0 top-0 inline-flex overflow-hidden text-flametext"
        style={{ width: `${(rating / 5) * 100}%` }}
        aria-hidden
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} />
        ))}
      </span>
    </span>
  );
}

function Star() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5-5.8-3.05-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z" />
    </svg>
  );
}

/** Section heading inside the modal. */
function Head({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h3 className="flex items-baseline gap-3 font-display text-[19px] font-semibold tracking-[-0.01em] text-heading sm:text-[21px]">
      <span className="font-mono text-[11px] font-normal tracking-[0.16em] text-flametext">
        {n}
      </span>
      {children}
    </h3>
  );
}

export function CaseStudyModal({
  study,
  onClose,
}: {
  study: CaseStudy | null;
  onClose: () => void;
}) {
  // Rendered through a portal to <body>: the section lives inside
  // `main.relative.z-[1]`, whose stacking context would otherwise trap the
  // dialog *below* the fixed nav (z-60) no matter how high its z-index is.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Esc to close + scroll lock while open (mirrors the booking modal).
  useEffect(() => {
    if (!study) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.__lenis?.start();
    };
  }, [study, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {study && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-start justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${study.title} ${study.accent} case study`}
        >
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }}
            className="relative z-10 my-auto flex max-h-[94dvh] w-full max-w-[900px] flex-col overflow-hidden rounded-window border border-[var(--glass-border)] shadow-2xl backdrop-blur-2xl"
            style={{ background: "var(--glass-sheen), var(--glass-bg-solid)" }}
          >
            {/* title bar */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-5 py-3">
              <span className="flex items-center gap-2.5">
                <Logo wordmark={false} markSize={17} />
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-flametext">
                  Case study
                </span>
              </span>
              <button
                onClick={onClose}
                aria-label="Close case study"
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
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
            >
              {/* hero image */}
              <div className="relative aspect-[2000/1202] w-full overflow-hidden bg-surface2">
                <Image
                  src={study.cover}
                  alt={study.coverAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 900px"
                  className="object-cover"
                  priority
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent, var(--glass-bg-solid))",
                  }}
                  aria-hidden
                />
              </div>

              <div className="px-6 pb-10 pt-7 sm:px-10">
                {/* headline */}
                <p className="eyebrow">{study.eyebrow}</p>
                <h2 className="mt-3 font-display text-[clamp(1.7rem,4vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-heading">
                  {study.title}{" "}
                  <span className="serif-accent gradient-text">
                    {study.accent}
                  </span>{" "}
                  {study.headline}
                </h2>
                <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-body">
                  {study.standfirst}
                </p>

                {/* profile strip */}
                <dl className="mt-7 grid grid-cols-2 gap-x-5 gap-y-4 border-y border-line py-5 sm:grid-cols-3">
                  {study.profile.map((p) => (
                    <div key={p.label}>
                      <dt className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                        {p.label}
                      </dt>
                      <dd className="mt-1 text-[13.5px] font-medium leading-snug text-bodystrong">
                        {p.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* stat band */}
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {study.stats.map((s) => (
                    <div
                      key={s.value}
                      className="rounded-card border border-line bg-surface2/50 p-5 text-center"
                    >
                      <p className="font-display text-[clamp(1.9rem,4vw,2.4rem)] font-bold leading-none tracking-[-0.02em]">
                        {s.count ? (
                          <CountUp
                            to={s.count.to}
                            prefix={s.count.prefix}
                            suffix={s.count.suffix}
                            className="gradient-text"
                          />
                        ) : (
                          <span className="gradient-text">{s.value}</span>
                        )}
                      </p>
                      <p className="mx-auto mt-2.5 max-w-[210px] text-[12.5px] leading-snug text-body">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* the situation */}
                <div className="mt-12">
                  <Head n="01">The situation</Head>
                  {study.situation.map((p) => (
                    <p
                      key={p.slice(0, 30)}
                      className="mt-4 text-[14.5px] leading-relaxed text-body"
                    >
                      {p}
                    </p>
                  ))}
                  <figure className="mt-6 border-l-2 border-flame/60 pl-5">
                    <blockquote className="font-serif text-[17px] italic leading-snug text-heading">
                      “{study.briefQuote.text}”
                    </blockquote>
                    <figcaption className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      {study.briefQuote.source}
                    </figcaption>
                  </figure>
                  <p className="mt-5 text-[14.5px] leading-relaxed text-body">
                    They knew exactly what they needed. They didn&apos;t have it.
                  </p>
                </div>

                {/* what it was costing */}
                <div className="mt-12">
                  <Head n="02">What it was costing</Head>
                  <p className="mt-4 text-[14.5px] leading-relaxed text-body">
                    Three specific leaks, and none of them showed up on a P&amp;L
                    line.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {study.costs.map((c, i) => (
                      <div
                        key={c.title}
                        className="rounded-card border border-line bg-surface2/40 p-5"
                      >
                        <span className="font-mono text-[10px] tracking-[0.16em] text-flametext">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="mt-2 font-display text-[14.5px] font-semibold leading-snug text-heading">
                          {c.title}
                        </p>
                        <p className="mt-2 text-[12.5px] leading-relaxed text-body">
                          {c.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* what HASH built */}
                <div className="mt-12">
                  <Head n="03">What HASH built</Head>
                  <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-body">
                    {study.buildIntro}
                  </p>

                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    {study.tiers.map((t) => (
                      <div
                        key={t.n}
                        className="group rounded-card border border-line bg-surface2/40 p-5"
                      >
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-flametext transition-all duration-300 ease-premium group-hover:scale-110 group-hover:border-flame/50"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--flame-glow), transparent 70%)",
                          }}
                          aria-hidden
                        >
                          <TierIcon kind={t.icon} />
                        </span>
                        <p className="mt-3.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-flametext">
                          {t.n}
                        </p>
                        <p className="mt-1.5 font-display text-[15px] font-semibold leading-snug text-heading">
                          {t.title}
                        </p>
                        <p className="mt-2 text-[12.5px] leading-relaxed text-body">
                          {t.body}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* the schematic — only where the study's rule is about how
                      one record renders into isolated views */}
                  {study.slug === "uplabs-ai-notion-delivery-system" && (
                    <div className="mt-5">
                      <SystemFlow />
                    </div>
                  )}

                  {/* databases */}
                  <p className="mt-9 font-display text-[15px] font-semibold text-heading">
                    {study.databasesTitle ?? "The databases underneath"}
                  </p>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {study.databases.map((d) => (
                      <div
                        key={d.name}
                        className="flex items-start gap-3 rounded-xl border border-line bg-surface2/40 px-4 py-3"
                      >
                        <span className="mt-[1px] text-flametext" aria-hidden>
                          <DbIcon />
                        </span>
                        <div className="min-w-0">
                          <p className="font-display text-[13.5px] font-semibold text-heading">
                            {d.name}
                          </p>
                          <p className="mt-0.5 text-[12px] leading-snug text-body">
                            {d.does}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* day-to-day mechanics */}
                  <p className="mt-9 font-display text-[15px] font-semibold text-heading">
                    The pieces that made it work day to day
                  </p>
                  <ul className="mt-4 flex flex-col gap-3.5">
                    {study.mechanics.map((m) => (
                      <li key={m.title} className="flex items-start gap-3">
                        <span
                          className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-flame"
                          aria-hidden
                        />
                        <p className="text-[13.5px] leading-relaxed text-body">
                          <span className="font-semibold text-heading">
                            {m.title}.
                          </span>{" "}
                          {m.body}
                        </p>
                      </li>
                    ))}
                  </ul>

                  {/* handover */}
                  <p className="mt-9 font-display text-[15px] font-semibold text-heading">
                    {study.handoverTitle ?? "Migration and handover"}
                  </p>
                  {study.handover.map((p) => (
                    <p
                      key={p.slice(0, 30)}
                      className="mt-3 text-[14px] leading-relaxed text-body"
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {/* the shift */}
                <div className="mt-12">
                  <Head n="04">The shift</Head>
                  <div className="mt-6 overflow-hidden rounded-card border border-line">
                    <div className="grid grid-cols-2 gap-px bg-[var(--border)]">
                      <p className="bg-surface2/70 px-4 py-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                        Before
                      </p>
                      <p className="bg-surface2/70 px-4 py-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-flametext">
                        After
                      </p>
                      {study.shift.map((row) => (
                        <div key={row.before} className="contents">
                          <p className="bg-[var(--bg)]/40 px-4 py-3 text-[12.5px] leading-snug text-muted">
                            {row.before}
                          </p>
                          <p className="bg-[var(--bg)]/40 px-4 py-3 text-[12.5px] font-medium leading-snug text-bodystrong">
                            {row.after}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="mt-5 font-display text-[15.5px] leading-snug text-heading">
                    {study.shiftClose}
                  </p>
                </div>

                {/* the math */}
                <div className="mt-12">
                  <Head n="05">The math</Head>
                  {study.math.map((p) => (
                    <p
                      key={p.slice(0, 30)}
                      className="mt-4 text-[14.5px] leading-relaxed text-body"
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {/* proof — the openable build. For the studies with no
                    testimonial on file, this is the proof. */}
                {study.template && (
                  <div className="mt-12">
                    <Head n="06">Proof</Head>
                    <div className="surface-card mt-5 overflow-hidden rounded-card p-6 sm:p-7">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-flametext">
                            See the actual system
                          </p>
                          <p className="mt-2.5 max-w-lg text-[13.5px] leading-relaxed text-body">
                            {study.template.note}
                          </p>
                        </div>
                        <a
                          href={study.template.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary shrink-0 px-5 py-2.5 text-sm"
                        >
                          {study.template.label}
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 14 14"
                            fill="none"
                            className="ml-1.5"
                            aria-hidden
                          >
                            <path
                              d="M5 2h7v7M12 2L3.5 10.5M11 8.5V12H2V3h3.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* proof — client testimonial */}
                {study.quote && (
                  <div className={study.template ? "mt-6" : "mt-12"}>
                    {!study.template && <Head n="06">Proof</Head>}
                    <figure className="mt-5 rounded-card border border-line bg-surface2/40 p-6">
                      <Stars rating={study.quote.rating} />
                      <blockquote className="mt-3 font-serif text-[19px] italic leading-snug text-heading">
                        “{study.quote.text}”
                      </blockquote>
                      <figcaption className="mt-3 text-[12.5px] text-body">
                        <span className="font-medium text-bodystrong">
                          {study.quote.author}
                        </span>
                        , {study.quote.role}
                      </figcaption>
                    </figure>
                  </div>
                )}

                {/* close */}
                <div className="mt-12 border-t border-line pt-8">
                  {study.close.map((p) => (
                    <p
                      key={p.slice(0, 30)}
                      className="mt-3 text-[14.5px] leading-relaxed text-body first:mt-0"
                    >
                      {p}
                    </p>
                  ))}
                  <p className="mt-6 font-display text-[clamp(1.15rem,2.6vw,1.5rem)] font-semibold leading-snug tracking-[-0.015em] text-heading">
                    The expensive part isn&apos;t the fix.{" "}
                    <span className="serif-accent gradient-text">
                      It&apos;s the year you spent not running the math.
                    </span>
                  </p>
                  <div className="mt-7">
                    <BookCallButton size="md" label="Book your Strategy Call" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
