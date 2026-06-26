// Small server-side helpers shared by the booking routes.
import { SITE_ORIGIN } from "./config";
import { signActionToken } from "./tokens";
import { leakPhrase } from "./quiz";
import type { QuizAnswers } from "./types";

export function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] || full.trim();
}

export function manageUrls(bookingId: string) {
  return {
    rescheduleUrl: `${SITE_ORIGIN}/booking/manage?token=${signActionToken(bookingId, "reschedule")}`,
    cancelUrl: `${SITE_ORIGIN}/booking/manage?token=${signActionToken(bookingId, "cancel")}`,
    rebookUrl: `${SITE_ORIGIN}/?book=1`,
  };
}

export const REVENUE_LABELS: Record<string, string> = {
  under_300k: "Under $300K",
  "300k_1m": "$300K–$1M",
  "1m_5m": "$1M–$5M",
  "5m_plus": "$5M+",
  prefer_not: "Prefer not to say",
};

export function buildEventDescription(input: {
  fullName: string;
  email: string;
  whatsapp: string;
  company?: string | null;
  revenueRange?: string | null;
  notes?: string | null;
  quiz: QuizAnswers;
}): string {
  const lines = [
    "Strategy Call — booked via hashops.io",
    "",
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    `WhatsApp: ${input.whatsapp}`,
  ];
  if (input.company) lines.push(`Company: ${input.company}`);
  if (input.revenueRange)
    lines.push(`Revenue: ${REVENUE_LABELS[input.revenueRange] ?? input.revenueRange}`);
  lines.push(
    "",
    `Biggest leak: ${leakPhrase(input.quiz.leak)}`,
    `Business: ${input.quiz.businessType} · Team: ${input.quiz.teamSize} · Urgency: ${input.quiz.urgency}`,
  );
  if (input.notes) lines.push("", `Notes: ${input.notes}`);
  return lines.join("\n");
}

/** Detect a Postgres unique-violation across neon-http error shapes. */
export function isUniqueViolation(e: unknown): boolean {
  const any = e as { code?: string; cause?: { code?: string }; message?: string };
  const code = any?.code ?? any?.cause?.code;
  return (
    String(code) === "23505" ||
    /unique|uniq_active_slot|duplicate key/i.test(String(any?.message ?? ""))
  );
}
