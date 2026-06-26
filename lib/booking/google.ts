// Google Calendar integration (OAuth, free). Acts as the host account:
// real free/busy, event creation with attendee invites + a Google Meet link,
// plus update/delete for reschedule/cancel. Server-side only.
import { google } from "googleapis";
import { BOOKING } from "./config";
import type { BusyInterval } from "./types";

export class GoogleNotConfiguredError extends Error {
  constructor() {
    super("Google Calendar is not configured");
    this.name = "GoogleNotConfiguredError";
  }
}

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
];

export function googleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN,
  );
}

function oauthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new GoogleNotConfiguredError();
  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    process.env.GOOGLE_REDIRECT_URI,
  );
}

// ---- One-time setup helpers (to obtain the refresh token) -------------------

export function authUrl(): string {
  return oauthClient().generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
}

export async function exchangeCodeForRefreshToken(
  code: string,
): Promise<string | null> {
  const { tokens } = await oauthClient().getToken(code);
  return tokens.refresh_token ?? null;
}

// ---- Authorized calendar client ---------------------------------------------

function calendar() {
  const refresh = process.env.GOOGLE_REFRESH_TOKEN;
  if (!refresh) throw new GoogleNotConfiguredError();
  const auth = oauthClient();
  auth.setCredentials({ refresh_token: refresh });
  return google.calendar({ version: "v3", auth });
}

/** Busy intervals on the host calendar between two instants (UTC ISO). */
export async function getBusy(
  timeMinISO: string,
  timeMaxISO: string,
): Promise<BusyInterval[]> {
  const cal = calendar();
  const res = await cal.freebusy.query({
    requestBody: {
      timeMin: timeMinISO,
      timeMax: timeMaxISO,
      items: [{ id: BOOKING.calendarId }],
    },
  });
  const busy = res.data.calendars?.[BOOKING.calendarId]?.busy ?? [];
  return busy
    .filter((b): b is { start: string; end: string } =>
      Boolean(b.start && b.end),
    )
    .map((b) => ({ start: b.start, end: b.end }));
}

export type CreatedEvent = {
  eventId: string;
  meetUrl: string | null;
  htmlLink: string | null;
};

export async function createEvent(args: {
  summary: string;
  description: string;
  startUtcISO: string;
  endUtcISO: string;
  attendeeEmail: string;
  attendeeName?: string;
}): Promise<CreatedEvent> {
  const cal = calendar();
  const res = await cal.events.insert({
    calendarId: BOOKING.calendarId,
    sendUpdates: "all",
    conferenceDataVersion: 1,
    requestBody: {
      summary: args.summary,
      description: args.description,
      start: { dateTime: args.startUtcISO, timeZone: "UTC" },
      end: { dateTime: args.endUtcISO, timeZone: "UTC" },
      attendees: [
        { email: args.attendeeEmail, displayName: args.attendeeName },
      ],
      conferenceData: {
        createRequest: {
          requestId: `hash-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: { useDefault: true },
    },
  });
  const data = res.data;
  const meetUrl =
    data.hangoutLink ||
    data.conferenceData?.entryPoints?.find(
      (e) => e.entryPointType === "video",
    )?.uri ||
    null;
  return {
    eventId: data.id as string,
    meetUrl,
    htmlLink: data.htmlLink ?? null,
  };
}

export async function updateEventTime(
  eventId: string,
  startUtcISO: string,
  endUtcISO: string,
): Promise<void> {
  const cal = calendar();
  await cal.events.patch({
    calendarId: BOOKING.calendarId,
    eventId,
    sendUpdates: "all",
    requestBody: {
      start: { dateTime: startUtcISO, timeZone: "UTC" },
      end: { dateTime: endUtcISO, timeZone: "UTC" },
    },
  });
}

export async function deleteEvent(eventId: string): Promise<void> {
  const cal = calendar();
  await cal.events.delete({
    calendarId: BOOKING.calendarId,
    eventId,
    sendUpdates: "all",
  });
}
