"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Section, SectionHeader } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { HashMark } from "./ui/HashMark";
import { BookButton } from "./ui/BookButton";
import { Check, AlertTriangle, ArrowRight } from "./ui/icons";
import {
  AUDIT_LAYERS,
  getVerdict,
  estimateCost,
} from "@/lib/audit-data";
import { cn, formatNumber } from "@/lib/utils";

type Stage = "intro" | "question" | "diagnosis";

export function OpsAuditQuiz() {
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const reduce = useReducedMotion();

  const answer = (yes: boolean) => {
    const next = [...answers];
    next[index] = yes;
    setAnswers(next);
    if (index < AUDIT_LAYERS.length - 1) {
      setIndex(index + 1);
    } else {
      setStage("diagnosis");
    }
  };

  const reset = () => {
    setAnswers([]);
    setIndex(0);
    setStage("intro");
  };

  const reds = answers.filter(Boolean).length;
  const flagged = AUDIT_LAYERS.filter((_, i) => answers[i]);
  const { hours, annual } = estimateCost(reds);
  const verdict = getVerdict(reds);
  const progress = stage === "diagnosis" ? 1 : index / AUDIT_LAYERS.length;

  const fade = {
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? undefined : { opacity: 0, y: -12 },
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <Section id="audit">
      <SectionHeader
        eyebrow="The 7-layer ops audit"
        heading="Find your operational leaks in 60 seconds."
        lead="Seven yes/no questions. One honest diagnosis of what's quietly costing you, and what to fix first."
      />

      <Reveal delay={0.1} y={28} className="mx-auto mt-12 max-w-2xl">
        <div className="overflow-hidden rounded-card border border-line-strong bg-surface shadow-lift">
          {/* Console status bar */}
          <div className="flex items-center justify-between border-b border-line bg-surface-2/50 px-5 py-3">
            <div className="flex items-center gap-2">
              <HashMark className="h-4 w-4" />
              <span className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-muted">
                Ops Audit Console
              </span>
            </div>
            <span className="font-mono text-[0.68rem] text-muted">
              {stage === "intro"
                ? "Ready"
                : stage === "question"
                  ? `${index + 1} / 7`
                  : "Complete"}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 w-full bg-surface-2">
            <motion.div
              className="h-full bg-[linear-gradient(90deg,#E55A00,#FFA033)]"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* INTRO */}
              {stage === "intro" && (
                <motion.div key="intro" {...fade} className="flex flex-col items-center py-6 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl border border-flame/20 bg-[linear-gradient(150deg,rgba(255,122,26,0.2),rgba(255,122,26,0.05))]">
                    <HashMark className="h-8 w-8" depth />
                  </span>
                  <h3 className="mt-6 max-w-md text-balance font-display text-[1.5rem] font-semibold leading-snug text-heading">
                    Answer 7 quick questions about how your business runs today.
                  </h3>
                  <p className="mt-2.5 text-[0.95rem] text-body">
                    Under a minute. No email required.
                  </p>
                  <button
                    onClick={() => setStage("question")}
                    className="btn-primary mt-8 h-12 px-7 text-[0.95rem]"
                  >
                    Start the audit
                    <ArrowRight className="btn-arrow h-[1.05em] w-[1.05em]" />
                  </button>
                </motion.div>
              )}

              {/* QUESTION */}
              {stage === "question" && (
                <motion.div key={`q-${index}`} {...fade} className="py-2">
                  <p className="font-mono text-[0.72rem] uppercase tracking-eyebrow text-flame-text">
                    Layer {String(AUDIT_LAYERS[index].id).padStart(2, "0")} / 07 ·{" "}
                    <span className="text-muted">{AUDIT_LAYERS[index].name}</span>
                  </p>
                  <h3 className="mt-4 min-h-[112px] text-balance font-display text-[clamp(1.35rem,3vw,1.7rem)] font-medium leading-snug text-heading">
                    {AUDIT_LAYERS[index].question}
                  </h3>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => answer(true)}
                      className="group/yn rounded-xl border border-line-strong bg-surface-2/40 py-5 font-display text-[1.05rem] font-medium text-heading transition-all duration-200 hover:-translate-y-0.5 hover:border-flame/60 hover:bg-flame/[0.06]"
                    >
                      Yes
                      <span className="mt-1 block font-sans text-[0.72rem] font-normal text-muted">
                        That&apos;s us
                      </span>
                    </button>
                    <button
                      onClick={() => answer(false)}
                      className="group/yn rounded-xl border border-line-strong bg-surface-2/40 py-5 font-display text-[1.05rem] font-medium text-heading transition-all duration-200 hover:-translate-y-0.5 hover:border-success/50 hover:bg-success/[0.06]"
                    >
                      No
                      <span className="mt-1 block font-sans text-[0.72rem] font-normal text-muted">
                        We&apos;ve got this
                      </span>
                    </button>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-1.5">
                    {AUDIT_LAYERS.map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          i === index
                            ? "w-5 bg-flame"
                            : i < index
                              ? "w-1.5 bg-flame/50"
                              : "w-1.5 bg-line-strong",
                        )}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* DIAGNOSIS */}
              {stage === "diagnosis" && (
                <motion.div key="diag" {...fade}>
                  <div className="text-center">
                    <p className="font-mono text-[0.72rem] uppercase tracking-eyebrow text-muted">
                      Diagnosis
                    </p>
                    <p className="mt-2 font-display text-[2.4rem] font-semibold leading-none text-heading">
                      <span className="gradient-text">{reds}</span>
                      <span className="text-muted"> / 7</span>
                    </p>
                    <p className="mt-1 font-mono text-[0.72rem] uppercase tracking-eyebrow text-muted">
                      layers flagged
                    </p>
                    <h3 className="mt-4 font-display text-[1.5rem] font-semibold text-heading">
                      {verdict.title}
                    </h3>
                    <p className="mx-auto mt-1.5 max-w-md text-[0.95rem] text-body">
                      {verdict.sub}
                    </p>
                  </div>

                  {/* Estimated cost */}
                  {reds > 0 ? (
                    <div className="mt-6 rounded-xl border border-error/30 bg-error/[0.07] p-4 text-center">
                      <p className="font-mono text-[0.66rem] uppercase tracking-eyebrow text-error">
                        Estimated leak
                      </p>
                      <p className="mt-1.5 text-[1.02rem] leading-relaxed text-body-strong">
                        Around <span className="font-semibold text-heading">{hours} hrs/week</span> and{" "}
                        <span className="font-semibold text-heading">
                          ~${formatNumber(annual)}/year
                        </span>{" "}
                        leaking out of the business.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-success/30 bg-success/[0.07] p-4 text-center">
                      <Check className="h-4 w-4 text-success" />
                      <p className="text-[0.95rem] text-body-strong">
                        No major leaks flagged. Your operational core is solid.
                      </p>
                    </div>
                  )}

                  {/* Flagged layers */}
                  <div className="mt-4 space-y-2">
                    {reds > 0 ? (
                      flagged.map((layer) => (
                        <div
                          key={layer.id}
                          className="flex items-start gap-3 rounded-lg border border-line bg-surface-2/40 px-4 py-3"
                        >
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                          <div>
                            <p className="text-[0.88rem] font-medium text-heading">
                              {layer.name}
                            </p>
                            <p className="mt-0.5 text-[0.82rem] leading-relaxed text-body">
                              {layer.cost}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-3 rounded-lg border border-success/25 bg-success/[0.06] px-4 py-3">
                        <Check className="h-4 w-4 shrink-0 text-success" />
                        <p className="text-[0.86rem] text-body-strong">
                          All 7 layers clear. Keep your documentation current as you grow.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* How HASH fixes this */}
                  <div className="mt-5 rounded-xl border border-flame/25 bg-flame/[0.06] p-4">
                    <p className="font-mono text-[0.66rem] uppercase tracking-eyebrow text-flame-text">
                      How HASH fixes this
                    </p>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-body-strong">
                      We run the full 7-layer audit, cost each leak, then build the
                      systems that close them, documented and built to last.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <BookButton size="md" />
                    <button
                      onClick={reset}
                      className="btn-secondary h-12 px-6 text-[0.95rem]"
                    >
                      Retake the audit
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
