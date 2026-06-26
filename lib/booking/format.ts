// Human time formatting in a given IANA timezone. Client-safe.
import { formatInTimeZone } from "date-fns-tz";

/** e.g. "Thursday, 26 Jun 2026 · 3:00 PM (GMT+5)" */
export function formatWhen(startUtcISO: string, tz: string): string {
  return formatInTimeZone(
    new Date(startUtcISO),
    tz,
    "EEEE, d MMM yyyy '·' h:mm a (zzz)",
  );
}

/** Short label, e.g. "3:00 PM" */
export function formatTime(startUtcISO: string, tz: string): string {
  return formatInTimeZone(new Date(startUtcISO), tz, "h:mm a");
}

/** Day grouping label, e.g. "Thursday, 26 Jun" */
export function formatDay(startUtcISO: string, tz: string): string {
  return formatInTimeZone(new Date(startUtcISO), tz, "EEEE, d MMM");
}
