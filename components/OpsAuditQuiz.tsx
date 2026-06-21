"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useReduceMotion } from "@/lib/useReduceMotion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { BookCallButton, SecondaryButton } from "@/components/ui/Buttons";
import { Logo } from "@/components/Logo";

/* ------------------------------------------------------------------ */
/* The 7 layers — from HASH_7-Layer_Ops_Audit_Framework.pdf            */
/* "Yes" = the red flag is present.                                    */
/* ------------------------------------------------------------------ */

const LAYERS = [
  {
    name: "Lead-to-Cash Visibility",
    question:
      "Does your sales pipeline live across scattered notes, heads, and Slack, with no single source of truth?",
    cost: "Deals slip through cracks you can't see, and cash flow takes surprise dips.",
  },
  {
    name: "Client Delivery Operations",
    question:
      "Is delivery run differently for every client, with you as the bottleneck on every approval?",
    cost: "Delivery quality depends on who's running it, so scaling means cloning you.",
  },
  {
    name: "Communication & Decision Flow",
    question:
      "Are Slack DMs your main decision channel, with the same questions resurfacing every month?",
    cost: "Your attention becomes the rate-limiter, and every new hire makes it worse.",
  },
  {
    name: "Knowledge & Documentation",
    question:
      "Do critical processes live mostly in your head instead of documented anywhere?",
    cost: "The business can't function without you, hiring stays risky, and selling is impossible.",
  },
  {
    name: "Reporting & Dashboards",
    question:
      "Are your key numbers pulled manually each month, with people trusting different versions?",
    cost: "Decisions wait on clarity, and the data is a month old when it lands.",
  },
  {
    name: "Tool Stack",
    question:
      "Are you paying for overlapping tools, some that no one even logs into?",
    cost: "Roughly $500–$3,000/month in invisible SaaS bleed, plus fragmented information.",
  },
  {
    name: "Hiring & Onboarding",
    question:
      "Does a new hire need weeks of shadowing before they're productive, with no documented onboarding?",
    cost: "Every hire delays revenue instead of driving it, so you stop hiring when you shouldn't.",
  },
];

const VERDICTS: { max: number; title: string; sub: string }[] = [
  {
    max: 0,
    title: "Tight ship.",
    sub: "No major leaks flagged. Document what already works and re-audit as you grow; drift is quiet.",
  },
  {
    max: 2,
    title: "A couple of quiet leaks.",
    sub: "Nothing dramatic yet, but leaks compound. They are cheapest to fix right now, not at twice the headcount.",
  },
  {
    max: 4,
    title: "Your ops are straining.",
    sub: "This is where growth stalls: every new client adds friction instead of margin. All of it is fixable.",
  },
  {
    max: 7,
    title: "You are the system.",
    sub: "The business runs on your attention. More hours won't fix that. Structure will.",
  },
];

const ease = [0.2, 0.7, 0.3, 1] as const;

type Stage = "intro" | "quiz" | "result";

export function OpsAuditQuiz() {
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const reduce = useReduceMotion();

  const answer = (yes: boolean) => {
    const next = [...answers, yes];
    setAnswers(next);
    if (index === LAYERS.length - 1) {
      setStage("result");
    } else {
      setIndex(index + 1);
    }
  };

  const reset = () => {
    setStage("intro");
    setIndex(0);
    setAnswers([]);
  };

  const reds = answers.filter(Boolean).length;
  const hours = reds * 3;
  const annual = hours * 35 * 52;
  const verdict =
    VERDICTS.find((v) => reds <= v.max) ?? VERDICTS[VERDICTS.length - 1];
  const flagged = LAYERS.map((layer, i) => ({ ...layer, i })).filter(
    (_, i) => answers[i],
  );

  const progress =
    stage === "intro" ? 0 : stage === "result" ? 1 : index / LAYERS.length;

  const fade = {
    initial: reduce ? undefined : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? undefined : { opacity: 0, y: -10 },
    transition: { duration: 0.32, ease },
  };

  // Per-question: the block slides in from the right while its contents
  // (label → question → answers) stagger up with a soft blur; slides left on exit.
  const qParent: Variants = reduce
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { x: 44 },
        animate: {
          x: 0,
          transition: { duration: 0.4, ease, staggerChildren: 0.08, delayChildren: 0.05 },
        },
        exit: { opacity: 0, x: -44, filter: "blur(6px)", transition: { duration: 0.28, ease } },
      };

  const qItem: Variants = reduce
    ? { initial: {}, animate: {} }
    : {
        initial: { opacity: 0, y: 18, filter: "blur(6px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease } },
      };

  return (
    <section id="audit" className="relative px-5 py-24 sm:px-8">
      {/* quiet radial glow behind the console */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[min(900px,100vw)] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--flame-glow), transparent 70%)",
        }}
        aria-hidden
      />

      <SectionHead
        index="04"
        eyebrow="The 7-Layer Ops Audit"
        title="Find your operational leaks in 60 seconds."
        lead="Seven yes/no questions, one for each layer of the business. Answer honestly. The math at the end is conservative."
      />

      <Reveal delay={0.12} scale={0.97} blur className="relative mx-auto mt-12 max-w-[760px]">
        <div className="surface-card relative overflow-hidden rounded-card border-strong shadow-[var(--window-shadow)]">
          {/* thin Flame progress bar */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-surface2" aria-hidden>
            <motion.div
              className="h-full"
              style={{
                background: "linear-gradient(90deg, #E55A00, #FF7A1A, #FFA033)",
              }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: reduce ? 0 : 0.45, ease }}
            />
          </div>

          <div className="px-6 py-12 sm:px-12 sm:py-14">
            <AnimatePresence mode="wait">
              {stage === "intro" && (
                <motion.div
                  key="intro"
                  {...fade}
                  className="flex flex-col items-center text-center"
                >
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-strong"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--flame-glow), transparent 72%)",
                      boxShadow: "0 14px 34px -16px rgba(216,87,6,0.4)",
                    }}
                    aria-hidden
                  >
                    <Logo wordmark={false} markSize={30} />
                  </span>
                  <h3 className="mt-6 max-w-md font-display text-[clamp(1.3rem,2.6vw,1.65rem)] font-semibold leading-snug text-heading">
                    Answer 7 quick questions about how your business runs
                    today.
                  </h3>
                  <p className="mt-3 text-[14.5px] text-body">
                    Under a minute. No email required.
                  </p>
                  <button
                    onClick={() => setStage("quiz")}
                    className="btn-primary mt-8 px-6 py-3 text-sm"
                  >
                    Start the audit
                    <svg
                      className="btn-arrow"
                      width="13"
                      height="13"
                      viewBox="0 0 14 14"
                      fill="none"
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
                  </button>
                </motion.div>
              )}

              {stage === "quiz" && (
                <motion.div
                  key={`q-${index}`}
                  variants={qParent}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-center"
                >
                  <motion.p
                    variants={qItem}
                    className="font-mono text-[11px] uppercase tracking-[0.16em] text-flametext"
                  >
                    Layer 0{index + 1} / 07 · {LAYERS[index].name}
                  </motion.p>
                  <motion.h3
                    variants={qItem}
                    className="mx-auto mt-5 min-h-[96px] max-w-xl font-display text-[clamp(1.25rem,2.6vw,1.6rem)] font-semibold leading-snug text-heading"
                  >
                    {LAYERS[index].question}
                  </motion.h3>
                  <motion.div
                    variants={qItem}
                    className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-3"
                  >
                    <button
                      onClick={() => answer(true)}
                      className="rounded-btn border border-strong py-4 font-display text-[15px] font-medium text-heading transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:border-flame hover:bg-[var(--flame-glow)] active:scale-[0.985]"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => answer(false)}
                      className="rounded-btn border border-strong py-4 font-display text-[15px] font-medium text-heading transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:border-flame hover:bg-[var(--flame-glow)] active:scale-[0.985]"
                    >
                      No
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {stage === "result" && (
                <motion.div key="result" {...fade}>
                  <div className="text-center">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-flametext">
                      Diagnosis
                    </p>
                    <p className="mt-4 font-display text-[clamp(2.2rem,5vw,3rem)] font-bold leading-none tracking-[-0.02em]">
                      <motion.span
                        className="gradient-text inline-block"
                        initial={reduce ? undefined : { scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.55, ease, delay: 0.08 }}
                      >
                        {reds}
                      </motion.span>
                      <span className="text-muted"> / 7</span>
                    </p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                      layers flagged
                    </p>
                    <h3 className="mt-5 font-display text-[clamp(1.4rem,3vw,1.8rem)] font-semibold text-heading">
                      {verdict.title}
                    </h3>
                    <p className="mx-auto mt-2.5 max-w-md text-[14.5px] leading-relaxed text-body">
                      {verdict.sub}
                    </p>
                  </div>

                  {/* estimated cost */}
                  {reds > 0 ? (
                    <div className="mt-8 rounded-xl border border-danger/30 bg-danger/10 px-5 py-4 text-center">
                      <p className="text-[15px] text-bodystrong">
                        Around{" "}
                        <span className="font-display font-semibold text-danger">
                          {hours} hrs/week
                        </span>{" "}
                        and{" "}
                        <span className="font-display font-semibold text-danger">
                          ~${annual.toLocaleString("en-US")}/year
                        </span>{" "}
                        leaking out of the business.
                      </p>
                      <p className="mt-1.5 font-mono text-[10.5px] text-muted">
                        {reds} flagged layers × 3 hrs/week, at a conservative
                        $35/hour
                      </p>
                    </div>
                  ) : (
                    <div className="mt-8 flex items-center justify-center gap-3 rounded-xl border border-success/30 bg-success/10 px-5 py-4">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M4.5 12.5l5 5 10-11"
                          stroke="var(--success)"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="text-[14.5px] text-bodystrong">
                        No layers flagged. Your operations are ahead of most
                        service businesses at this size.
                      </p>
                    </div>
                  )}

                  {/* flagged layers */}
                  {flagged.length > 0 && (
                    <div className="mt-7">
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
                        Where it&apos;s leaking
                      </p>
                      <motion.div
                        className="mt-3 flex flex-col"
                        initial={reduce ? undefined : "hidden"}
                        animate="show"
                        variants={{
                          hidden: {},
                          show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
                        }}
                      >
                        {flagged.map((layer) => (
                          <motion.div
                            key={layer.name}
                            variants={
                              reduce
                                ? undefined
                                : {
                                    hidden: { opacity: 0, x: -16 },
                                    show: {
                                      opacity: 1,
                                      x: 0,
                                      transition: { duration: 0.4, ease },
                                    },
                                  }
                            }
                            className="flex items-start gap-3.5 border-t border-line py-3.5 first:border-0"
                          >
                            <svg
                              className="mt-0.5 shrink-0 text-danger"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                            >
                              <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01" />
                            </svg>
                            <div>
                              <p className="font-display text-[13.5px] font-semibold text-heading">
                                Layer 0{layer.i + 1} · {layer.name}
                              </p>
                              <p className="mt-0.5 text-[13px] leading-relaxed text-body">
                                {layer.cost}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  )}

                  {/* how HASH fixes this */}
                  <div
                    className="mt-7 rounded-xl border px-5 py-4"
                    style={{
                      borderColor: "rgba(255,122,26,0.35)",
                      background:
                        "linear-gradient(135deg, var(--flame-glow), transparent 80%)",
                    }}
                  >
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-flametext">
                      How HASH fixes this
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-bodystrong">
                      The Ops Strategy Call runs this exact framework on your
                      business, live: a 60-minute diagnostic across all 7
                      layers, a written Bottleneck Report that puts a dollar
                      figure on your top 3 leaks, and a fix-first roadmap. If
                      the ROI math doesn&apos;t justify a build, we tell you
                      that too.
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <BookCallButton size="md" />
                    <SecondaryButton size="md" onClick={reset}>
                      Retake the audit
                    </SecondaryButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 7-layer segmented progress — each segment fills as you advance */}
            {stage === "quiz" && (
              <div
                className="mt-10 flex items-center justify-center gap-1.5"
                aria-hidden
              >
                {LAYERS.map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 rounded-full transition-all duration-500 ease-premium"
                    style={{
                      width: i === index ? 26 : 9,
                      background:
                        i < index
                          ? "var(--flame)"
                          : i === index
                            ? "linear-gradient(90deg, #E55A00, #FFA033)"
                            : "var(--surface-2)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
