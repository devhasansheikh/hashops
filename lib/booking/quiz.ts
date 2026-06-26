// Quiz content + routing logic. Pure data + a pure function — client-safe.
import type { QuizAnswers, Qualification } from "./types";

export type QuizOption = { value: string; label: string };
export type QuizStep = {
  id: keyof QuizAnswers;
  heading: string;
  options: QuizOption[];
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

export function leakPhrase(leak: string): string {
  return LEAK_PHRASES[leak] || "where time and money quietly leak out";
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
  return Boolean(a.businessType && a.teamSize && a.leak && a.urgency);
}
