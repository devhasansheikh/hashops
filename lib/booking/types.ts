// Shared booking types — the single contract every module builds against.
// Safe to import from both client and server (no runtime deps).

export type QuizAnswers = {
  businessType: string;
  teamSize: string;
  leak: string[];
  urgency: string;
};

export type Qualification = "qualified" | "nurture";

/** A busy interval on the host calendar (UTC ISO strings). */
export type BusyInterval = { start: string; end: string };

/** A bookable slot — an absolute instant in time (UTC ISO strings). */
export type Slot = { startUtc: string; endUtc: string };

export type RevenueRange =
  | "under_300k"
  | "300k_1m"
  | "1m_5m"
  | "5m_plus"
  | "prefer_not"
  | "";

/** Payload the booking form POSTs to /api/book. */
export type BookingInput = {
  slotStartUtc: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  revenueRange: string;
  tools: string[];
  howHeard: string;
  oneThing?: string;
  timezone: string; // visitor's IANA timezone
  quiz: QuizAnswers;
};

/** Nurture capture (not-yet-qualified leads). */
export type LeadInput = {
  fullName: string;
  email: string;
  quiz: QuizAnswers;
  timezone: string;
};

export type BookingStatus = "confirmed" | "cancelled";

export type AvailabilityResponse = {
  hostTimezone: string;
  slots: Slot[];
};

/** Result of /api/book — the UI branches on `ok` / `code`. */
export type BookResult =
  | {
      ok: true;
      bookingId: string;
      slotStartUtc: string;
      slotEndUtc: string;
      meetUrl: string | null;
    }
  | {
      ok: false;
      code: "slot_taken" | "slot_invalid" | "validation" | "server_error";
      message: string;
      slots?: Slot[]; // next free slots when slot_taken
    };
