// Quiz content + routing logic. Pure data + a pure function — client-safe.
import type { QuizAnswers, Qualification } from "./types";

export type QuizOption = { value: string; label: string };
export type QuizStep = {
  id: keyof QuizAnswers;
  heading: string;
  options: QuizOption[];
  multi?: boolean;
  hint?: string;
};

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: "businessType",
    heading: "What kind of business do you run?",
    options: [
      { value: "agency", label: "Marketing / creative agency" },
      { value: "consulting", label: "Consulting / professional services" },
      { value: "other_service", label: "Other service business" },
      {
        value: "something_else",
        label: "Something else (product, e-commerce, etc.)",
      },
    ],
  },
  {
    id: "teamSize",
    heading: "How many people run the day-to-day?",
    options: [
      { value: "just_me", label: "Just me" },
      { value: "2_4", label: "2–4" },
      { value: "5_15", label: "5–15" },
      { value: "16_30", label: "16–30" },
      { value: "30_plus", label: "30+" },
    ],
  },
  {
    id: "leak",
    heading: "Where's the most time or money leaking right now?",
    multi: true,
    hint: "Select all that apply",
    options: [
      { value: "onboarding", label: "Onboarding new clients eats too much time" },
      { value: "dropped", label: "Work slips through the cracks, balls get dropped" },
      { value: "pipeline", label: "No clear view of pipeline or follow-ups" },
      { value: "reporting", label: "Reports and numbers take hours, or land too late" },
      { value: "in_my_head", label: "It's all in my head, nothing's documented" },
      { value: "scattered", label: "Everything feels scattered" },
    ],
  },
  {
    id: "urgency",
    heading: "How soon do you want this fixed?",
    options: [
      { value: "now", label: "Right now, it's costing us" },
      { value: "weeks", label: "In the next few weeks" },
      { value: "months", label: "In the next couple of months" },
      { value: "exploring", label: "Just exploring for now" },
    ],
  },
];

/** Plain-language version of their leak, dropped into the value moment. */
export const LEAK_PHRASES: Record<string, string> = {
  onboarding: "client onboarding eating hours that should be billable",
  dropped: "work slipping through the cracks as volume grows",
  pipeline: "no single, clear view of the pipeline and follow-ups",
  reporting: "reporting that takes hours, or lands too late to act on",
  in_my_head: "the whole operation living in your head, not documented",
  scattered: "work scattered across tools that don't talk to each other",
};

export function leakPhrase(leak: string | string[]): string {
  const arr = (Array.isArray(leak) ? leak : [leak]).filter(Boolean);
  const phrases = arr.map((l) => LEAK_PHRASES[l]).filter(Boolean);
  if (phrases.length === 0) return "where time and money quietly leak out";
  if (phrases.length === 1) return phrases[0];
  if (phrases.length === 2) return `${phrases[0]} and ${phrases[1]}`;
  return `${phrases.slice(0, -1).join(", ")}, and ${phrases[phrases.length - 1]}`;
}

/**
 * Routing: qualified leads see the live calendar; everyone else is routed to
 * the nurture capture, which protects calendar slots from low-intent leads.
 *
 * Qualified = a service business (not "something else") AND a real team
 * (not "just me") AND urgent (now / next few weeks).
 */
export function qualify(a: QuizAnswers): Qualification {
  const isService = a.businessType !== "something_else" && a.businessType !== "";
  const hasTeam = a.teamSize !== "just_me" && a.teamSize !== "";
  const urgent = a.urgency === "now" || a.urgency === "weeks";
  return isService && hasTeam && urgent ? "qualified" : "nurture";
}

export function quizComplete(a: Partial<QuizAnswers>): a is QuizAnswers {
  return Boolean(
    a.businessType &&
      a.teamSize &&
      a.urgency &&
      Array.isArray(a.leak) &&
      a.leak.length > 0,
  );
}

/* ----- Booking-details form options ----- */

export const REVENUE_OPTIONS: QuizOption[] = [
  { value: "under_300k", label: "Under $300K" },
  { value: "300k_750k", label: "$300K – $750K" },
  { value: "750k_1_5m", label: "$750K – $1.5M" },
  { value: "1_5m_5m", label: "$1.5M – $5M" },
  { value: "5m_plus", label: "$5M+" },
];

export const TOOLS_OPTIONS: QuizOption[] = [
  { value: "sheets", label: "Sheets" },
  { value: "excel", label: "Excel" },
  { value: "airtable", label: "Airtable" },
  { value: "notion", label: "Notion" },
  { value: "slack", label: "Slack" },
  { value: "hubspot", label: "HubSpot" },
];

export const HEARD_OPTIONS: QuizOption[] = [
  { value: "google", label: "Google search" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "x", label: "X / Twitter" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "referral", label: "Referral / word of mouth" },
  { value: "other", label: "Other" },
];

const labelMap = (opts: QuizOption[]): Record<string, string> =>
  Object.fromEntries(opts.map((o) => [o.value, o.label]));

export const REVENUE_LABELS = labelMap(REVENUE_OPTIONS);
export const TOOL_LABELS = labelMap(TOOLS_OPTIONS);
export const HEARD_LABELS = labelMap(HEARD_OPTIONS);

export function toolLabels(values: string[]): string {
  return values.map((v) => TOOL_LABELS[v] || v).join(", ");
}
