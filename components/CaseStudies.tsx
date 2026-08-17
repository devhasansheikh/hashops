"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { CountUp } from "@/components/ui/CountUp";
import { CASE_STUDIES, type CaseStudy } from "@/lib/caseStudies";
import { CaseStudyModal } from "@/components/caseStudy/CaseStudyModal";

/**
 * Case studies. One card per study, cover image left, summary right; the whole
 * card opens the full write-up in a modal. Built to take more studies without
 * changing anything here — add to CASE_STUDIES and the grid absorbs it.
 */
export function CaseStudies() {
  const [open, setOpen] = useState<CaseStudy | null>(null);

  return (
    <section id="work" className="relative px-5 py-24 sm:px-8">
      <SectionHead
        index="06"
        eyebrow="Proof"
        title={
          <>
            Built, shipped,{" "}
            <span className="serif-accent gradient-text">measured.</span>
          </>
        }
        lead="Real builds, with the numbers the client verified afterwards. Open one to read how it was made."
      />

      <div className="mx-auto mt-14 flex max-w-content flex-col gap-6">
        {CASE_STUDIES.map((study, i) => (
          <Reveal key={study.slug} delay={i * 0.1}>
            <article
              onClick={() => setOpen(study)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen(study);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Open the ${study.title} ${study.accent} case study`}
              className={`surface-card surface-card-lift group grid cursor-pointer gap-8 rounded-card p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-flame sm:p-8 lg:items-center lg:gap-10 ${
                // alternate the image side so a stack of studies reads as a rhythm
                i % 2 === 1
                  ? "lg:grid-cols-[1fr_1.05fr] lg:[&>*:first-child]:order-2"
                  : "lg:grid-cols-[1.05fr_1fr]"
              }`}
            >
              {/* cover */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] border border-line bg-surface2">
                <Image
                  src={study.cover}
                  alt={study.coverAlt}
                  fill
                  sizes="(max-width: 1024px) 92vw, 540px"
                  className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
                />
                {/* warm wash so the cover sits in the brand world */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-60 mix-blend-soft-light"
                  style={{
                    background:
                      "linear-gradient(140deg, rgba(255,122,26,0.5), transparent 60%)",
                  }}
                  aria-hidden
                />
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-pill border border-[rgba(255,255,255,0.18)] bg-black/55 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[var(--success)]"
                    aria-hidden
                  />
                  {study.coverBadge}
                </span>
              </div>

              {/* summary */}
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-flametext">
                  {study.eyebrow}
                </p>
                <h3 className="mt-3 font-display text-[clamp(1.4rem,3vw,1.9rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-heading">
                  {study.title}{" "}
                  <span className="serif-accent gradient-text">
                    {study.accent}
                  </span>
                </h3>
                <p className="mt-3.5 max-w-xl text-[14.5px] leading-relaxed text-body">
                  {study.cardSummary}
                </p>

                {/* headline stats */}
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                  {study.stats.slice(0, 2).map((s) => (
                    <div key={s.value}>
                      <p className="font-display text-[26px] font-bold leading-none tracking-[-0.02em]">
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
                      <p className="mt-1.5 max-w-[190px] text-[12px] leading-snug text-muted">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {study.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-pill border border-line bg-surface2 px-3 py-1 font-mono text-[10.5px] text-bodystrong"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <span className="mt-7 inline-flex items-center gap-2 font-body text-[13.5px] font-medium text-flametext">
                  Read the case study
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="transition-transform duration-300 group-hover:translate-x-[3px]"
                    aria-hidden
                  >
                    <path
                      d="M1.5 7h11M8 2.5L12.5 7 8 11.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <CaseStudyModal study={open} onClose={() => setOpen(null)} />
    </section>
  );
}
