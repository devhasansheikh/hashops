// Small server-side helpers shared by the booking routes.
import { SITE_ORIGIN } from "./config";
import { signActionToken } from "./tokens";
import { leakPhrase, REVENUE_LABELS, HEARD_LABELS, toolLabels } from "./quiz";
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

export function buildEventDescription(input: {
  fullName: string;
  email: string;
  phone: string;
  company?: string | null;
  revenueRange?: string | null;
  tools?: string[] | null;
  howHeard?: string | null;
  oneThing?: string | null;
  quiz: QuizAnswers;
}): string {
  const lines = [
    "Strategy Call, booked via hashops.io",
    "",
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
  ];
  if (input.company)
    lines.push(`Company / Website / LinkedIn: ${input.company}`);
  if (input.revenueRange)
    lines.push(`Revenue: ${REVENUE_LABELS[input.revenueRange] ?? input.revenueRange}`);
  if (input.tools && input.tools.length)
    lines.push(`Tools: ${toolLabels(input.tools)}`);
  if (input.howHeard)
    lines.push(`Heard via: ${HEARD_LABELS[input.howHeard] ?? input.howHeard}`);
  lines.push(
    "",
    `Biggest leaks: ${leakPhrase(input.quiz.leak)}`,
    `Business: ${input.quiz.businessType} · Team: ${input.quiz.teamSize} · Urgency: ${input.quiz.urgency}`,
  );
  if (input.oneThing) lines.push("", `One thing to fix: ${input.oneThing}`);
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
