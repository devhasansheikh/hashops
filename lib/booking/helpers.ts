// Small server-side helpers shared by the booking routes.
import { SITE_ORIGIN } from "./config";
import { signActionToken } from "./tokens";
import { leakPhrase } from "./quiz";
import type { QuizAnswers } from "./types";

export function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] || full.trim();
}

/** Where new-booking / lead notifications go (the host's inbox). */
export const hostNotifyEmail = () =>
  process.env.BOOKING_NOTIFY_EMAIL || process.env.EMAIL_REPLY_TO || "info@hashops.io";

/** A one-click "Add to Google Calendar" link for the confirmation email. */
export function googleCalendarAddUrl(args: {
  title: string;
  startUtcISO: string;
  endUtcISO: string;
  details?: string;
  location?: string;
}): string {
  const fmt = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d+/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: args.title,
    dates: `${fmt(args.startUtcISO)}/${fmt(args.endUtcISO)}`,
  });
  if (args.details) params.set("details", args.details);
  if (args.location) params.set("location", args.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
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
