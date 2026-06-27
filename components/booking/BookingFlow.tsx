"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useReduceMotion } from "@/lib/useReduceMotion";
import {
  QUIZ_STEPS,
  qualify,
  leakPhrase,
  REVENUE_OPTIONS,
  TOOLS_OPTIONS,
  HEARD_OPTIONS,
} from "@/lib/booking/quiz";
import type { Slot } from "@/lib/booking/types";
import { COUNTRIES, type Country } from "@/lib/booking/countries";
import { SlotPicker, visitorTimezone } from "./SlotPicker";
import {
  OptionCard,
  ProgressBar,
  StepHeading,
  Field,
  BackButton,
  inputClass,
  ease,
} from "./parts";
import { Select } from "./Select";
import { Chips } from "./Chips";
import { PhoneField } from "./PhoneField";

type Stage = "quiz" | "booking" | "form" | "confirmed" | "nurture" | "nurture_done";
type Answers = { businessType: string; teamSize: string; leak: string[]; urgency: string };

const PROGRESS: Record<string, number> = {
  "quiz-0": 0.08,
  "quiz-1": 0.2,
  "quiz-2": 0.32,
  "quiz-3": 0.44,
  booking: 0.6,
  form: 0.82,
  confirmed: 1,
  nurture: 0.7,
  nurture_done: 1,
};

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

export function BookingFlow({ onClose }: { onClose: () => void }) {
  const reduce = useReduceMotion();
  const tz = useMemo(() => visitorTimezone(), []);

  const [stage, setStage] = useState<Stage>("quiz");
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Answers>({
    businessType: "",
    teamSize: "",
    leak: [],
    urgency: "",
  });
  const [slot, setSlot] = useState<Slot | null>(null);
  const [overrideSlots, setOverrideSlots] = useState<Slot[] | undefined>();
  const [flash, setFlash] = useState("");
  const [result, setResult] = useState<{ whenText: string; meetUrl: string | null } | null>(null);

  // details form
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    number: "",
    tools: [] as string[],
    revenue: "",
    howHeard: "",
    oneThing: "",
  });
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  // nurture
  const [lead, setLead] = useState({ fullName: "", email: "" });
  const [leadErrors, setLeadErrors] = useState<Record<string, string>>({});
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const panelKey = stage === "quiz" ? `quiz-${step}` : stage;
  const progress = PROGRESS[panelKey] ?? 0;
  const showProgress = stage !== "confirmed" && stage !== "nurture_done";

  const current = QUIZ_STEPS[step];
  const isMulti = current.id === "leak";
  const selectedFor = (val: string) =>
    isMulti ? answers.leak.includes(val) : answers[current.id] === val;
  const hasAnswer = isMulti
    ? answers.leak.length > 0
    : Boolean(answers[current.id]);

  function pick(value: string) {
    if (current.id === "leak") {
      setAnswers((a) => ({
        ...a,
        leak: a.leak.includes(value)
          ? a.leak.filter((v) => v !== value)
          : [...a.leak, value],
      }));
    } else {
      setAnswers((a) => ({ ...a, [current.id]: value }));
    }
  }

  function next() {
    if (!hasAnswer) return;
    if (step < QUIZ_STEPS.length - 1) {
      setDir(1);
      setStep((s) => s + 1);
      return;
    }
    setDir(1);
    setStage(qualify(answers) === "qualified" ? "booking" : "nurture");
  }

  function back() {
    setDir(-1);
    if (stage === "form") setStage("booking");
    else if (stage === "booking" || stage === "nurture") {
      setStage("quiz");
      setStep(QUIZ_STEPS.length - 1);
    } else if (stage === "quiz" && step > 0) setStep((s) => s - 1);
  }

  function choose(s: Slot) {
    setSlot(s);
    setFlash("");
    setDir(1);
    setStage("form");
  }

  function setField(field: keyof typeof form, value: string | string[]) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const n = { ...prev };
      delete n[field];
      return n;
    });
  }

  function toggleTool(v: string) {
    setForm((f) => ({
      ...f,
      tools: f.tools.includes(v) ? f.tools.filter((t) => t !== v) : [...f.tools, v],
    }));
    setErrors((prev) => {
      if (!prev.tools) return prev;
      const n = { ...prev };
      delete n.tools;
      return n;
    });
  }

  function validateForm() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Your name, please.";
    if (!EMAIL_RE.test(form.email.trim())) e.email = "A valid email, please.";
    if (!form.company.trim()) e.company = "Required.";
    if (form.number.replace(/\D/g, "").length < 6)
      e.number = "A valid phone number, please.";
    if (form.tools.length === 0) e.tools = "Pick at least one.";
    if (!form.revenue) e.revenue = "Please choose one.";
    if (!form.howHeard) e.howHeard = "Please choose one.";
    return e;
  }

  async function submitBooking() {
    if (!slot) return;
    const e = validateForm();
    setErrors(e);
    if (Object.keys(e).length) {
      if (e.fullName) nameRef.current?.focus();
      else if (e.email) emailRef.current?.focus();
      else if (e.company) companyRef.current?.focus();
      else if (e.number) phoneRef.current?.focus();
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
          phone: `${country.dial} ${form.number.trim()}`,
          company: form.company.trim(),
          revenueRange: form.revenue,
          tools: form.tools,
          howHeard: form.howHeard,
          oneThing: form.oneThing.trim(),
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
        staggerChildren: reduce ? 0 : 0.05,
        delayChildren: reduce ? 0 : delayChildren,
      },
    },
  });

  const cta = "btn-primary px-5 py-2.5 text-[13.5px] disabled:cursor-not-allowed";

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
              {current.hint && (
                <p className="mt-1.5 font-body text-[13px] text-muted">{current.hint}</p>
              )}
              <div className="mt-5 flex flex-col gap-2.5">
                {current.options.map((o, i) => (
                  <OptionCard
                    key={o.value}
                    index={i}
                    label={o.label}
                    selected={selectedFor(o.value)}
                    onSelect={() => pick(o.value)}
                  />
                ))}
              </div>
              <div className="mt-7 flex items-center justify-between gap-3">
                {step > 0 ? <BackButton onClick={back} /> : <span />}
                <button type="button" onClick={next} disabled={!hasAnswer} className={`${cta} disabled:opacity-40`}>
                  {step < QUIZ_STEPS.length - 1 ? "Next" : "See my options"}
                </button>
              </div>
            </div>
          )}

          {/* -------------------------------------------------- BOOKING */}
          {stage === "booking" && (
            <div>
              <BackButton onClick={back} />
              <div className="mt-4 rounded-card border border-flame/25 bg-[var(--flame-glow)] px-5 py-4">
                <p className="font-body text-[14px] leading-relaxed text-bodystrong">
                  Based on what you&apos;ve told us, here&apos;s where businesses
                  your size usually leak the most:{" "}
                  <span className="font-semibold text-heading">
                    {leakPhrase(answers.leak)}
                  </span>
                  . Let&apos;s put a real number on yours. Your 60-minute Strategy
                  Call runs the audit live on your business, and you leave with your
                  top leaks costed, whether or not you ever work with us.
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
              <SlotPicker onPick={choose} selected={slot?.startUtc} slotsOverride={overrideSlots} />
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
              <StepHeading>A few details and you&apos;re set</StepHeading>
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
                      placeholder="jane@company.com"
                    />
                  </Field>
                </motion.div>
                <motion.div variants={item}>
                  <Field label="Company / Website / LinkedIn" required error={errors.company}>
                    <input
                      ref={companyRef}
                      className={inputClass}
                      value={form.company}
                      onChange={(e) => setField("company", e.target.value)}
                      placeholder="company.com or linkedin.com/in/you"
                    />
                  </Field>
                </motion.div>
                <motion.div variants={item}>
                  <Field label="Phone number" required error={errors.number}>
                    <PhoneField
                      country={country}
                      number={form.number}
                      onCountry={setCountry}
                      onNumber={(v) => setField("number", v)}
                      invalid={Boolean(errors.number)}
                      inputRef={phoneRef}
                    />
                  </Field>
                </motion.div>
                <motion.div variants={item}>
                  <Field label="What tools do you use now?" required error={errors.tools}>
                    <Chips options={TOOLS_OPTIONS} value={form.tools} onToggle={toggleTool} />
                  </Field>
                </motion.div>
                <motion.div variants={item}>
                  <Field label="Annual revenue" required error={errors.revenue}>
                    <Select
                      options={REVENUE_OPTIONS}
                      value={form.revenue}
                      onChange={(v) => setField("revenue", v)}
                      placeholder="Select a range"
                      invalid={Boolean(errors.revenue)}
                    />
                  </Field>
                </motion.div>
                <motion.div variants={item}>
                  <Field label="How'd you hear about us?" required error={errors.howHeard}>
                    <Select
                      options={HEARD_OPTIONS}
                      value={form.howHeard}
                      onChange={(v) => setField("howHeard", v)}
                      placeholder="Select one"
                      invalid={Boolean(errors.howHeard)}
                    />
                  </Field>
                </motion.div>
                <motion.div variants={item}>
                  <Field
                    label="What's the one thing that, if it just worked, would make running this business feel easier?"
                    hint="(optional)"
                  >
                    <textarea
                      className={`${inputClass} min-h-[80px] resize-none`}
                      value={form.oneThing}
                      maxLength={1000}
                      onChange={(e) => setField("oneThing", e.target.value)}
                      placeholder="A sentence or two."
                    />
                  </Field>
                </motion.div>
                <motion.div variants={item} className="flex items-center justify-between gap-3 pt-1">
                  <BackButton onClick={back} />
                  <button type="button" onClick={submitBooking} disabled={submitting} className={`${cta} disabled:opacity-60`}>
                    {submitting ? "Booking…" : "Confirm my call"}
                  </button>
                </motion.div>
                {formError && (
                  <motion.p variants={item} className="font-body text-[13.5px] text-danger">
                    {formError}
                  </motion.p>
                )}
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
                  transition={reduce ? undefined : { type: "spring", stiffness: 320, damping: 17, delay: 0.05 }}
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
                <motion.h3 variants={item} className="mt-4 font-display text-2xl font-semibold text-heading">
                  You&apos;re booked.
                </motion.h3>
                <motion.p variants={item} className="mt-3 max-w-sm font-body text-[15px] leading-relaxed text-body">
                  You&apos;re set for{" "}
                  <span className="font-semibold text-heading">{result.whenText}</span>{" "}
                  ({tz}). Your confirmation and Meet link are on the way to your inbox.
                  Come with a rough sense of your client count and what you charge.
                </motion.p>
                <motion.div variants={item} className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                  {result.meetUrl && (
                    <a href={result.meetUrl} target="_blank" rel="noopener noreferrer" className="btn-primary px-5 py-2.5 text-[13.5px]">
                      Join with Google Meet
                    </a>
                  )}
                  <button onClick={onClose} className="btn-secondary px-5 py-2.5 text-[13.5px]">
                    Back to the site
                  </button>
                </motion.div>
              </motion.div>
            </div>
          )}

          {/* -------------------------------------------------- NURTURE */}
          {stage === "nurture" && (
            <div>
              <BackButton onClick={back} />
              <div className="mt-4">
                <StepHeading>Not ready for a call?</StepHeading>
              </div>
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
                  <button type="button" onClick={submitLead} disabled={leadSubmitting} className={`${cta} w-full disabled:opacity-60`}>
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
                transition={reduce ? undefined : { type: "spring", stiffness: 320, damping: 18, delay: 0.05 }}
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
              <motion.div className="flex flex-col items-center" variants={stagger(0.3)} initial={reduce ? false : "hidden"} animate="show">
                <motion.h3 variants={item} className="mt-5 font-display text-2xl font-semibold text-heading">
                  Check your inbox.
                </motion.h3>
                <motion.p variants={item} className="mt-3 max-w-sm font-body text-[15px] leading-relaxed text-body">
                  Your 7-layer Leak Checklist is on its way. Run it honestly. When two
                  or more layers land as a clear &quot;no,&quot; that&apos;s usually
                  worth a real conversation.
                </motion.p>
                <motion.button variants={item} onClick={onClose} className="btn-secondary mt-7 px-5 py-2.5 text-[13.5px]">
                  Back to the site
                </motion.button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
