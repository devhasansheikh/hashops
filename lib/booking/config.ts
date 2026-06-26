// Single source of truth for booking availability + behaviour.
// Every rule is overridable via environment variables so it can be tuned
// without touching code. Server-side only (reads process.env).

export type DayRanges = [string, string][]; // [["10:00","17:00"], ...]
export type WeekHours = Record<number, DayRanges>; // 0 = Sun … 6 = Sat

const DEFAULT_HOURS: WeekHours = {
  0: [],
  1: [["10:00", "17:00"]],
  2: [["10:00", "17:00"]],
  3: [["10:00", "17:00"]],
  4: [["10:00", "17:00"]],
  5: [["10:00", "17:00"]],
  6: [],
};

function parseHours(json: string | undefined): WeekHours {
  if (!json) return DEFAULT_HOURS;
  try {
    const parsed = JSON.parse(json) as Partial<WeekHours>;
    // Merge over defaults so a partial override (e.g. only weekdays) is valid.
    return { ...DEFAULT_HOURS, ...parsed } as WeekHours;
  } catch {
    return DEFAULT_HOURS;
  }
}

const num = (v: string | undefined, fallback: number) =>
  v === undefined || v === "" || Number.isNaN(Number(v)) ? fallback : Number(v);

export const BOOKING = {
  /** IANA timezone the host's working hours are expressed in. */
  hostTimezone: process.env.BOOKING_TIMEZONE || "Asia/Karachi",
  /** Meeting length, minutes. */
  slotMinutes: num(process.env.BOOKING_SLOT_MINUTES, 60),
  /** Granularity of slot starts, minutes (60 → on the hour). */
  slotStepMinutes: num(process.env.BOOKING_SLOT_STEP_MINUTES, 60),
  /** Buffer kept clear around existing meetings, minutes. */
  bufferMinutes: num(process.env.BOOKING_BUFFER_MINUTES, 15),
  /** Minimum notice before the earliest bookable slot, hours. */
  minNoticeHours: num(process.env.BOOKING_MIN_NOTICE_HOURS, 12),
  /** Rolling availability window, days ahead. */
  windowDays: num(process.env.BOOKING_WINDOW_DAYS, 21),
  /** Skip Saturday/Sunday regardless of workingHours. */
  excludeWeekends: (process.env.BOOKING_EXCLUDE_WEEKENDS || "true") !== "false",
  /** Working hours per weekday, in hostTimezone. */
  workingHours: parseHours(process.env.BOOKING_HOURS_JSON),
  /** Cap on slots returned to the client per request. */
  maxSlots: num(process.env.BOOKING_MAX_SLOTS, 60),
  /** Host display name shown in copy + calendar event. */
  hostName: process.env.BOOKING_HOST_NAME || "the HASH team",
  /** Calendar that owns availability ("primary" = the host account's main). */
  calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
  /** WhatsApp reminders feature flag (off by default). */
  whatsappEnabled: process.env.WHATSAPP_ENABLED === "true",
} as const;

/** Public site origin, used to build absolute links in emails. */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.hashops.io";
