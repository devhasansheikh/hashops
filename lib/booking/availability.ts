// Timezone-aware availability engine. Turns the host's working-hours config +
// live busy intervals into a list of genuinely-open 60-min slots (UTC instants).
// Pure + deterministic given (busy, now) — easy to reason about and test.
import { addDays } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { BOOKING } from "./config";
import type { BusyInterval, Slot } from "./types";

const MIN = 60_000;
const pad = (n: number) => String(n).padStart(2, "0");

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function computeSlots(
  busy: BusyInterval[],
  now: Date = new Date(),
): Slot[] {
  const tz = BOOKING.hostTimezone;
  const slotMs = BOOKING.slotMinutes * MIN;
  const bufferMs = BOOKING.bufferMinutes * MIN;
  const earliest = now.getTime() + BOOKING.minNoticeHours * 60 * MIN;
  const windowEnd = now.getTime() + BOOKING.windowDays * 24 * 60 * MIN;

  // Expand busy blocks by the buffer so meetings aren't booked back-to-back.
  const blocks = busy
    .map((b) => ({
      start: Date.parse(b.start) - bufferMs,
      end: Date.parse(b.end) + bufferMs,
    }))
    .filter((b) => Number.isFinite(b.start) && Number.isFinite(b.end));

  const overlapsBusy = (s: number, e: number) =>
    blocks.some((b) => s < b.end && e > b.start);

  const slots: Slot[] = [];
  const seenDates = new Set<string>();
  const seenStarts = new Set<string>();

  for (let offset = 0; offset <= BOOKING.windowDays; offset++) {
    const dayInstant = addDays(now, offset);
    const dateStr = formatInTimeZone(dayInstant, tz, "yyyy-MM-dd"); // host-local date
    if (seenDates.has(dateStr)) continue; // DST-safe date dedupe
    seenDates.add(dateStr);

    const isoDow = Number(formatInTimeZone(dayInstant, tz, "i")); // 1=Mon..7=Sun
    const jsDow = isoDow === 7 ? 0 : isoDow; // 0=Sun..6=Sat
    if (BOOKING.excludeWeekends && (jsDow === 0 || jsDow === 6)) continue;

    const ranges = BOOKING.workingHours[jsDow] ?? [];
    for (const [from, to] of ranges) {
      const startMin = toMinutes(from);
      const endMin = toMinutes(to);
      for (
        let m = startMin;
        m + BOOKING.slotMinutes <= endMin;
        m += BOOKING.slotStepMinutes
      ) {
        const local = `${dateStr} ${pad(Math.floor(m / 60))}:${pad(m % 60)}:00`;
        const startMs = fromZonedTime(local, tz).getTime();
        const endMs = startMs + slotMs;
        if (startMs < earliest) continue;
        if (endMs > windowEnd) continue;
        if (overlapsBusy(startMs, endMs)) continue;

        const startUtc = new Date(startMs).toISOString();
        if (seenStarts.has(startUtc)) continue;
        seenStarts.add(startUtc);
        slots.push({ startUtc, endUtc: new Date(endMs).toISOString() });
      }
    }
  }

  slots.sort((a, b) => a.startUtc.localeCompare(b.startUtc));
  return slots.slice(0, BOOKING.maxSlots);
}

/** Re-validate a chosen slot server-side before booking it. */
export function slotIsBookable(
  startUtcISO: string,
  busy: BusyInterval[],
  now: Date = new Date(),
): boolean {
  return computeSlots(busy, now).some((s) => s.startUtc === startUtcISO);
}

/** The window we query free/busy over: now → end of the rolling window. */
export function busyWindow(now: Date = new Date()): {
  timeMinISO: string;
  timeMaxISO: string;
} {
  return {
    timeMinISO: now.toISOString(),
    timeMaxISO: new Date(
      now.getTime() + BOOKING.windowDays * 24 * 60 * MIN,
    ).toISOString(),
  };
}
