import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, dbConfigured, schema } from "@/lib/db/client";
import { BOOKING } from "@/lib/booking/config";
import { googleConfigured, getBusy, createEvent } from "@/lib/booking/google";
import {
  slotIsBookable,
  computeSlots,
  busyWindow,
} from "@/lib/booking/availability";
import { formatWhen } from "@/lib/booking/format";
import {
  firstName,
  manageUrls,
  buildEventDescription,
  isUniqueViolation,
  hostNotifyEmail,
  googleCalendarAddUrl,
} from "@/lib/booking/helpers";
import {
  leakPhrase,
  REVENUE_LABELS,
  HEARD_LABELS,
  toolLabels,
} from "@/lib/booking/quiz";
import { sendEmail } from "@/lib/email/resend";
import { confirmationEmail, hostNotificationEmail } from "@/lib/email/templates";
import { sendWhatsApp } from "@/lib/booking/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Input = z.object({
  slotStartUtc: z.string().datetime(),
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(5).max(40),
  company: z.string().trim().min(1).max(200),
  revenueRange: z.string().trim().min(1).max(40),
  tools: z.array(z.string().max(40)).min(1).max(20),
  howHeard: z.string().trim().min(1).max(40),
  oneThing: z.string().trim().max(1000).optional().default(""),
  timezone: z.string().trim().min(1).max(60),
  quiz: z.object({
    businessType: z.string(),
    teamSize: z.string(),
    leak: z.array(z.string()).min(1),
    urgency: z.string(),
  }),
});

export async function POST(req: Request) {
  if (!dbConfigured || !googleConfigured()) {
    return NextResponse.json(
      { ok: false, code: "server_error", message: "Booking isn't fully set up yet." },
      { status: 503 },
    );
  }

  let input: z.infer<typeof Input>;
  try {
    input = Input.parse(await req.json());
  } catch {
    return NextResponse.json(
      { ok: false, code: "validation", message: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const now = new Date();
  const startMs = Date.parse(input.slotStartUtc);
  const startDate = new Date(startMs);
  const endDate = new Date(startMs + BOOKING.slotMinutes * 60_000);
  const slotStartUtc = startDate.toISOString();
  const slotEndUtc = endDate.toISOString();

  // 1) Validate the slot is genuinely still free (working hours + window + busy).
  let busy;
  try {
    const { timeMinISO, timeMaxISO } = busyWindow(now);
    busy = await getBusy(timeMinISO, timeMaxISO);
  } catch (e) {
    console.error("[book] freebusy", e);
    return NextResponse.json(
      { ok: false, code: "server_error", message: "Couldn't reach the calendar. Please try again." },
      { status: 502 },
    );
  }
  if (!slotIsBookable(slotStartUtc, busy, now)) {
    return NextResponse.json(
      {
        ok: false,
        code: "slot_taken",
        message: "That slot was just taken.",
        slots: computeSlots(busy, now).slice(0, 12),
      },
      { status: 409 },
    );
  }

  // 2) Atomically reserve in the DB. The partial unique index on slot_start
  //    (status <> 'cancelled') makes two simultaneous bookings impossible.
  let bookingId: string;
  try {
    const [row] = await db
      .insert(schema.bookings)
      .values({
        fullName: input.fullName,
        email: input.email,
        whatsapp: input.phone,
        company: input.company,
        revenueRange: input.revenueRange,
        quiz: input.quiz,
        timezone: input.timezone,
        notes: input.oneThing || null,
        slotStartUtc: startDate,
        slotEndUtc: endDate,
        status: "confirmed",
      })
      .returning({ id: schema.bookings.id });
    bookingId = row.id;
  } catch (e) {
    if (isUniqueViolation(e)) {
      return NextResponse.json(
        {
          ok: false,
          code: "slot_taken",
          message: "That slot was just taken.",
          slots: computeSlots(busy, now).filter((s) => s.startUtc !== slotStartUtc).slice(0, 12),
        },
        { status: 409 },
      );
    }
    console.error("[book] insert", e);
    return NextResponse.json(
      { ok: false, code: "server_error", message: "Couldn't save your booking. Please try again." },
      { status: 500 },
    );
  }

  // 3) Create the Google Calendar event (attendee invite + Meet link).
  //    On failure, roll back the DB reservation so the slot frees up.
  let meetUrl: string | null = null;
  try {
    const ev = await createEvent({
      summary: `Strategy Call · ${input.fullName} · ${input.company}`,
      description: buildEventDescription(input),
      startUtcISO: slotStartUtc,
      endUtcISO: slotEndUtc,
      attendeeEmail: input.email,
      attendeeName: input.fullName,
    });
    meetUrl = ev.meetUrl;
    await db
      .update(schema.bookings)
      .set({ googleEventId: ev.eventId, meetUrl: ev.meetUrl, updatedAt: new Date() })
      .where(eq(schema.bookings.id, bookingId));
  } catch (e) {
    console.error("[book] calendar", e);
    await db.delete(schema.bookings).where(eq(schema.bookings.id, bookingId)).catch(() => {});
    return NextResponse.json(
      { ok: false, code: "server_error", message: "Couldn't create the calendar event. Your slot wasn't held — please try again." },
      { status: 502 },
    );
  }

  // 4) Emails — AWAITED. Fire-and-forget gets dropped when the serverless
  //    function freezes after responding, so we wait for them. The helpers
  //    catch their own errors, so these never throw / never fail the booking.
  const whenClient = formatWhen(slotStartUtc, input.timezone);
  const whenHost = formatWhen(slotStartUtc, BOOKING.hostTimezone);
  const { rescheduleUrl, cancelUrl } = manageUrls(bookingId);

  const addToCalUrl = googleCalendarAddUrl({
    title: "Strategy Call with HASH",
    startUtcISO: slotStartUtc,
    endUtcISO: slotEndUtc,
    details: meetUrl ? `Join with Google Meet: ${meetUrl}` : "Your HASH Strategy Call.",
    location: meetUrl || undefined,
  });
  const mail = confirmationEmail({
    name: firstName(input.fullName),
    whenText: whenClient,
    meetUrl,
    rescheduleUrl,
    cancelUrl,
    addToCalUrl,
  });
  await sendEmail({ to: input.email, subject: mail.subject, html: mail.html });

  const host = hostNotificationEmail({
    kind: "new",
    clientName: input.fullName,
    clientEmail: input.email,
    phone: input.phone,
    company: input.company,
    revenueLabel: REVENUE_LABELS[input.revenueRange] ?? input.revenueRange,
    tools: toolLabels(input.tools),
    howHeard: HEARD_LABELS[input.howHeard] ?? input.howHeard,
    oneThing: input.oneThing || undefined,
    leak: leakPhrase(input.quiz.leak),
    whenText: whenHost,
    meetUrl,
  });
  await sendEmail({ to: hostNotifyEmail(), subject: host.subject, html: host.html });

  await sendWhatsApp(
    input.phone,
    `You're booked with HASH for ${whenClient}.${meetUrl ? " Join: " + meetUrl : ""}`,
  );

  return NextResponse.json({ ok: true, bookingId, slotStartUtc, slotEndUtc, meetUrl });
}
