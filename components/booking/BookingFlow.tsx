"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useReduceMotion } from "@/lib/useReduceMotion";
import { QUIZ_STEPS, qualify, leakPhrase } from "@/lib/booking/quiz";
import type { QuizAnswers, Slot } from "@/lib/booking/types";
import { SlotPicker, visitorTimezone } from "./SlotPicker";
import {
  OptionCard,
  ProgressBar,
  StepHeading,
  Field,
  inputClass,
  ease,
} from "./parts";

type Stage = "quiz" | "booking" | "form" | "confirmed" | "nurture" | "nurture_done";

const REVENUE_OPTIONS = [
  { value: "", label: "Select (optional)" },
  { value: "under_300k", label: "Under $300K" },
  { value: "300k_1m", label: "$300K–$1M" },
  { value: "1m_5m", label: "$1M–$5M" },
  { value: "5m_plus", label: "$5M+" },
  { value: "prefer_not", label: "Prefer not to say" },
];

const PROGRESS: Record<string, number> = {
  "quiz-0": 0.08,
  "quiz-1": 0.22,
  "quiz-2": 0.36,
  "quiz-3": 0.5,
  booking: 0.66,
  form: 0.84,
  confirmed: 1,
  nurture: 0.7,
  nurture_done: 1,
};

// Six sparks that burst outward on the success screen (deterministic angles).
const SPARKS = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 6;
  return { x: Math.cos(a) * 36, y: Math.sin(a) * 36 };
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function whenLocal(iso: string, tz: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  });
}

function fieldError(
  field: "fullName" | "email" | "whatsapp",
  val: string,
): string {
  const v = val.trim();
  if (field === "fullName") return v ? "" : "Your name, please.";
  if (field === "email")
    return EMAIL_RE.test(v) ? "" : "A valid email, please.";
  return val.replace(/\D/g, "").length >= 7
    ? ""
    : "A reachable WhatsApp number, please.";
}

export function BookingFlow({ onClose }: { onClose: () => void }) {
  const reduce = useReduceMotion();
  const tz = useMemo(() => visitorTimezone(), []);

  const [stage, setStage] = useState<Stage>("quiz");
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [slot, setSlot] = useState<Slot | null>(null);
  const [overrideSlots, setOverrideSlots] = useState<Slot[] | undefined>();
  const [reloadKey] = useState(0);
  const [flash, setFlash] = useState("");
  const [result, setResult] = useState<{ whenText: string; meetUrl: string | null } | null>(null);

  // booking form
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    company: "",
    revenueRange: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);

  // nurture form
  const [lead, setLead] = useState({ fullName: "", email: "" });
  const [leadErrors, setLeadErrors] = useState<Record<string, string>>({});
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const panelKey = stage === "quiz" ? `quiz-${step}` : stage;
  const progress = PROGRESS[panelKey] ?? 0;
  const showProgress = stage !== "confirmed" && stage !== "nurture_done";

  const current = QUIZ_STEPS[step];
  const currentAnswer = answers[current.id];

  function pick(value: string) {
    setAnswers((a) => ({ ...a, [current.id]: value }));
  }

  function next() {
    if (!currentAnswer) return;
    if (step < QUIZ_STEPS.length - 1) {
      setDir(1);
      setStep((s) => s + 1);
      return;
    }
    const full = answers as QuizAnswers;
    setDir(1);
    setStage(qualify(full) === "qualified" ? "booking" : "nurture");
  }

  function back() {
    setDir(-1);
    if (stage === "form") {
      setStage("booking");
    } else if (stage === "booking" || stage === "nurture") {
      setStage("quiz");
      setStep(QUIZ_STEPS.length - 1);
    } else if (stage === "quiz" && step > 0) {
      setStep((s) => s - 1);
    }
  }

  const canGoBack =
    (stage === "quiz" && step > 0) ||
    stage === "booking" ||
    stage === "form" ||
    stage === "nurture";

  function choose(s: Slot) {
    setSlot(s);
    setFlash("");
    setDir(1);
    setStage("form");
  }

  // Update a form field and clear that field's error as the user fixes it.
  function setField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const n = { ...prev };
      delete n[field];
      return n;
    });
  }

  // Validate one required field on blur (not on every keystroke).
  function blurValidate(field: "fullName" | "email" | "whatsapp") {
    const msg = fieldError(field, form[field]);
    setErrors((prev) => {
      const n = { ...prev };
      if (msg) n[field] = msg;
      else delete n[field];
      return n;
    });
  }

  async function submitBooking() {
    if (!slot) return;
    const e: Record<string, string> = {};
    const fn = fieldError("fullName", form.fullName);
    const em = fieldError("email", form.email);
    const wa = fieldError("whatsapp", form.whatsapp);
    if (fn) e.fullName = fn;
    if (em) e.email = em;
    if (wa) e.whatsapp = wa;
    setErrors(e);
    if (Object.keys(e).length) {
      if (e.fullName) nameRef.current?.focus();
      else if (e.email) emailRef.current?.focus();
      else whatsappRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slotStartUtc: slot.startUtc,
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          whatsapp: form.whatsapp.trim(),
          company: form.company.trim(),
          revenueRange: form.revenueRange,
          notes: form.notes.trim(),
          timezone: tz,
          quiz: answers,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult({
          whenText: whenLocal(data.slotStartUtc, tz),
          meetUrl: data.meetUrl ?? null,
        });
        setDir(1);
        setStage("confirmed");
      } else if (data.code === "slot_taken") {
        setOverrideSlots(Array.isArray(data.slots) ? data.slots : undefined);
        setSlot(null);
        setFlash("That slot was just taken. Here are the next open times.");
        setDir(-1);
        setStage("booking");
      } else {
        setFormError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Network hiccup. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitLead() {
    const e: Record<string, string> = {};
    if (!lead.fullName.trim()) e.fullName = "Your name, please.";
    if (!EMAIL_RE.test(lead.email.trim())) e.email = "A valid email, please.";
    setLeadErrors(e);
    if (Object.keys(e).length) return;
    setLeadSubmitting(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: lead.fullName.trim(),
          email: lead.email.trim(),
          timezone: tz,
          quiz: answers,
        }),
      });
    } catch {
      /* best-effort */
    } finally {
      setLeadSubmitting(false);
      setDir(1);
      setStage("nurture_done");
    }
  }

  // Directional slide + blur; exit is quicker than enter (feels responsive).
  const variants = {
    enter: (d: number) => ({
      opacity: 0,
      x: reduce ? 0 : d * 46,
      filter: reduce ? "blur(0px)" : "blur(8px)",
    }),
    center: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: reduce ? 0 : 0.4, ease },
    },
    exit: (d: number) => ({
      opacity: 0,
      x: reduce ? 0 : d * -46,
      filter: reduce ? "blur(0px)" : "blur(8px)",
      transition: { duration: reduce ? 0 : 0.26, ease },
    }),
  };

  const item: Variants = reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.34, ease } },
      };
  const stagger = (delayChildren = 0.05): Variants => ({
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.06,
        delayChildren: reduce ? 0 : delayChildren,
      },
    },
  });

  return (
    <div>
      {showProgress && (
        <div className="mb-6">
          <ProgressBar value={progress} />
        </div>
      )}

      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.div
          key={panelKey}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {/* ----------------------------------------------------- QUIZ */}
          {stage === "quiz" && (
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-flametext">
                Step {step + 1} of {QUIZ_STEPS.length}
              </p>
              <StepHeading>{current.heading}</StepHeading>
              <div className="mt-6 flex flex-col gap-2.5">
                {current.options.map((o, i) => (
                  <OptionCard
                    key={o.value}
                    index={i}
                    label={o.label}
                    selected={currentAnswer === o.value}
                    onSelect={() => pick(o.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* -------------------------------------------------- BOOKING */}
          {stage === "booking" && (
            <div>
              <div className="rounded-card border border-flame/25 bg-[var(--flame-glow)] px-5 py-4">
                <p className="font-body text-[14px] leading-relaxed text-bodystrong">
                  Based on what you&apos;ve told us, here&apos;s where businesses
                  your size usually leak the most:{" "}
                  <span className="font-semibold text-heading">
                    {leakPhrase(answers.leak || "")}
                  </span>
                  . Let&apos;s put a real number on yours. Your 60-minute
                  Strategy Call runs the audit live on your business, and you leave
                  with your top leaks costed, whether or not you ever work with us.
                </p>
              </div>

              {flash && (
                <p className="mt-4 rounded-btn border border-danger/30 bg-danger/10 px-4 py-2.5 font-body text-[13.5px] text-danger">
                  {flash}
                </p>
              )}

              <h3 className="mb-4 mt-6 font-display text-[18px] font-semibold text-heading">
                Pick a time that works
              </h3>
              <SlotPicker
                onPick={choose}
                selected={slot?.startUtc}
                slotsOverride={overrideSlots}
                reloadKey={reloadKey}
              />
            </div>
          )}

          {/* ----------------------------------------------------- FORM */}
          {stage === "form" && slot && (
            <div>
              <button
                type="button"
                onClick={back}
                className="mb-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-flametext transition-colors hover:text-heading"
              >
                ← {whenLocal(slot.startUtc, tz)} · change
              </button>
              <StepHeading>Where do we send the invite?</StepHeading>
              <motion.div
                className="mt-5 flex flex-col gap-4"
                variants={stagger(0.06)}
                initial={reduce ? false : "hidden"}
                animate="show"
              >
                <motion.div variants={item}>
                  <Field label="Full name" required error={errors.fullName}>
                    <input
                      ref={nameRef}
                      className={inputClass}
                      value={form.fullName}
                      autoComplete="name"
                      onChange={(e) => setField("fullName", e.target.value)}
                      onBlur={() => blurValidate("fullName")}
                      placeholder="Jane Doe"
                    />
                  </Field>
                </motion.div>
                <motion.div variants={item}>
                  <Field label="Email" required error={errors.email}>
                    <input
                      ref={emailRef}
                      className={inputClass}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      onBlur={() => blurValidate("email")}
                      placeholder="jane@company.com"
                    />
                  </Field>
                </motion.div>
                <motion.div variants={item}>
                  <Field label="WhatsApp number" required error={errors.whatsapp}>
                    <input
                      ref={whatsappRef}
                      className={inputClass}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.whatsapp}
                      onChange={(e) => setField("whatsapp", e.target.value)}
                      onBlur={() => blurValidate("whatsapp")}
                      placeholder="+1 555 123 4567"
                    />
                  </Field>
                </motion.div>
                <motion.div variants={item}>
                  <Field label="Company / website" hint="(optional)">
                    <input
                      className={inputClass}
                      value={form.company}
                      onChange={(e) => setField("company", e.target.value)}
                      placeholder="company.com"
                    />
                  </Field>
                </motion.div>
                <motion.div variants={item}>
                  <Field label="Annual revenue" hint="(optional)">
                    <select
                      className={inputClass}
                      value={form.revenueRange}
                      onChange={(e) => setField("revenueRange", e.target.value)}
                    >
                      {REVENUE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </motion.div>
                <motion.div variants={item}>
                  <Field label="Anything we should know before the call?" hint="(optional)">
                    <textarea
                      className={`${inputClass} min-h-[80px] resize-none`}
                      value={form.notes}
                      maxLength={1000}
                      onChange={(e) => setField("notes", e.target.value)}
                      placeholder="A line or two on what's been slipping."
                    />
                  </Field>
                </motion.div>
                <motion.div variants={item}>
                  {formError && (
                    <p className="mb-2 font-body text-[13.5px] text-danger">
                      {formError}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={submitBooking}
                    disabled={submitting}
                    className="btn-primary w-full px-6 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Booking your slot…" : "Confirm my call"}
                  </button>
                </motion.div>
              </motion.div>
            </div>
          )}

          {/* ------------------------------------------------ CONFIRMED */}
          {stage === "confirmed" && result && (
            <div className="flex flex-col items-center py-2 text-center">
              <div className="relative mb-1 flex h-20 w-20 items-center justify-center">
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full border-2 border-success/40"
                    initial={{ scale: 0.7, opacity: 0.7 }}
                    animate={{ scale: 1.9, opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.12 }}
                  />
                )}
                {!reduce &&
                  SPARKS.map((s, i) => (
                    <motion.span
                      key={i}
                      aria-hidden
                      className="absolute h-1 w-1 rounded-full bg-success"
                      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                      animate={{ x: s.x, y: s.y, scale: [0, 1, 0.4], opacity: [0, 1, 0] }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                    />
                  ))}
                <motion.span
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15"
                  initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={
                    reduce
                      ? undefined
                      : { type: "spring", stiffness: 320, damping: 17, delay: 0.05 }
                  }
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <motion.path
                      d="M4.5 12.5l5 5 10-11"
                      stroke="var(--success)"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={reduce ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: reduce ? 0 : 0.45, ease, delay: reduce ? 0 : 0.28 }}
                    />
                  </svg>
                </motion.span>
              </div>

              <motion.div
                className="flex flex-col items-center"
                variants={stagger(0.4)}
                initial={reduce ? false : "hidden"}
                animate="show"
              >
                <motion.h3
                  variants={item}
                  className="mt-4 font-display text-2xl font-semibold text-heading"
                >
                  You&apos;re booked.
                </motion.h3>
                <motion.p
                  variants={item}
                  className="mt-3 max-w-sm font-body text-[15px] leading-relaxed text-body"
                >
                  You&apos;re set for{" "}
                  <span className="font-semibold text-heading">{result.whenText}</span>{" "}
                  ({tz}). Your confirmation and calendar invite are on the way to your
                  inbox. Come with a rough sense of your client count and what you
                  charge. We&apos;ll turn that into a real number on the call.
                </motion.p>
                <motion.div
                  variants={item}
                  className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
                >
                  {result.meetUrl && (
                    <a
                      href={result.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary px-6 py-3 text-sm"
                    >
                      Join with Google Meet
                    </a>
                  )}
                  <button onClick={onClose} className="btn-secondary px-6 py-3 text-sm">
                    Back to the site
                  </button>
                </motion.div>
              </motion.div>
            </div>
          )}

          {/* -------------------------------------------------- NURTURE */}
          {stage === "nurture" && (
            <div>
              <StepHeading>Not ready for a call?</StepHeading>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-body">
                Grab the 7-layer Leak Checklist and run it on your own business.
                It&apos;s the same framework we use on the call. We&apos;ll send it
                straight to your inbox.
              </p>
              <motion.div
                className="mt-5 flex flex-col gap-4"
                variants={stagger(0.06)}
                initial={reduce ? false : "hidden"}
                animate="show"
              >
                <motion.div variants={item}>
                  <Field label="Full name" required error={leadErrors.fullName}>
                    <input
                      className={inputClass}
                      value={lead.fullName}
                      autoComplete="name"
                      onChange={(e) => setLead({ ...lead, fullName: e.target.value })}
                      placeholder="Jane Doe"
                    />
                  </Field>
                </motion.div>
                <motion.div variants={item}>
                  <Field label="Email" required error={leadErrors.email}>
                    <input
                      className={inputClass}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={lead.email}
                      onChange={(e) => setLead({ ...lead, email: e.target.value })}
                      placeholder="jane@company.com"
                    />
                  </Field>
                </motion.div>
                <motion.div variants={item}>
                  <button
                    type="button"
                    onClick={submitLead}
                    disabled={leadSubmitting}
                    className="btn-primary w-full px-6 py-3.5 text-sm disabled:opacity-60"
                  >
                    {leadSubmitting ? "Sending…" : "Send me the checklist"}
                  </button>
                </motion.div>
              </motion.div>
            </div>
          )}

          {/* --------------------------------------------- NURTURE DONE */}
          {stage === "nurture_done" && (
            <div className="flex flex-col items-center py-2 text-center">
              <motion.div
                initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={
                  reduce ? undefined : { type: "spring", stiffness: 320, damping: 18, delay: 0.05 }
                }
                className="flex h-16 w-16 items-center justify-center rounded-full bg-flame/15"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M3 6.5l9 6 9-6M4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11A1.5 1.5 0 0 1 4.5 5z"
                    stroke="var(--flame)"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: reduce ? 0 : 0.5, ease, delay: reduce ? 0 : 0.25 }}
                  />
                </svg>
              </motion.div>
              <motion.div
                className="flex flex-col items-center"
                variants={stagger(0.3)}
                initial={reduce ? false : "hidden"}
                animate="show"
              >
                <motion.h3
                  variants={item}
                  className="mt-5 font-display text-2xl font-semibold text-heading"
                >
                  Check your inbox.
                </motion.h3>
                <motion.p
                  variants={item}
                  className="mt-3 max-w-sm font-body text-[15px] leading-relaxed text-body"
                >
                  Your 7-layer Leak Checklist is on its way. Run it honestly. When two
                  or more layers land as a clear &quot;no,&quot; that&apos;s usually
                  worth a real conversation.
                </motion.p>
                <motion.button
                  variants={item}
                  onClick={onClose}
                  className="btn-secondary mt-7 px-6 py-3 text-sm"
                >
                  Back to the site
                </motion.button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* persistent nav for the quiz steps */}
      {stage === "quiz" && (
        <div className="mt-7 flex items-center justify-between gap-3">
          {canGoBack ? (
            <button
              type="button"
              onClick={back}
              className="font-body text-[14px] text-muted transition-colors hover:text-heading"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={next}
            disabled={!currentAnswer}
            className="btn-primary px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step < QUIZ_STEPS.length - 1 ? "Next" : "See my options"}
          </button>
        </div>
      )}
    </div>
  );
}
