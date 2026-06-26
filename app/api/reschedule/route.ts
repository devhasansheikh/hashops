import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, dbConfigured, schema } from "@/lib/db/client";
import { BOOKING } from "@/lib/booking/config";
import { verifyActionToken } from "@/lib/booking/tokens";
import {
  googleConfigured,
  getBusy,
  updateEventTime,
} from "@/lib/booking/google";
import {
  slotIsBookable,
  computeSlots,
  busyWindow,
} from "@/lib/booking/availability";
import { formatWhen } from "@/lib/booking/format";
import { firstName, manageUrls, isUniqueViolation } from "@/lib/booking/helpers";
import { sendEmail } from "@/lib/email/resend";
import { rescheduledEmail } from "@/lib/email/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Input = z.object({
  token: z.string().min(1),
  slotStartUtc: z.string().datetime(),
});

export async function POST(req: Request) {
  if (!dbConfigured || !googleConfigured())
    return NextResponse.json(
      { ok: false, code: "server_error", message: "Not configured." },
      { status: 503 },
    );

  let input: z.infer<typeof Input>;
  try {
    input = Input.parse(await req.json());
  } catch {
    return NextResponse.json(
      { ok: false, code: "validation", message: "Bad request." },
      { status: 400 },
    );
  }
  const v = verifyActionToken(input.token);
  if (!v)
    return NextResponse.json(
      { ok: false, code: "validation", message: "This link is invalid or expired." },
      { status: 400 },
    );

  const [b] = await db
    .select()
    .from(schema.bookings)
    .where(eq(schema.bookings.id, v.bookingId))
    .limit(1);
  if (!b)
    return NextResponse.json({ ok: false, code: "server_error", message: "Booking not found." }, { status: 404 });
  if (b.status === "cancelled")
    return NextResponse.json({ ok: false, code: "server_error", message: "This booking was cancelled." }, { status: 409 });

  const now = new Date();
  const startMs = Date.parse(input.slotStartUtc);
  const startDate = new Date(startMs);
  const endDate = new Date(startMs + BOOKING.slotMinutes * 60_000);
  const slotStartUtc = startDate.toISOString();
  const slotEndUtc = endDate.toISOString();

  // Validate the new slot is free — excluding this booking's own busy block.
  let busy;
  try {
    const { timeMinISO, timeMaxISO } = busyWindow(now);
    const all = await getBusy(timeMinISO, timeMaxISO);
    const ownStart = b.slotStartUtc.getTime();
    const ownEnd = b.slotEndUtc.getTime();
    busy = all.filter(
      (bi) => !(Date.parse(bi.start) < ownEnd && Date.parse(bi.end) > ownStart),
    );
  } catch (e) {
    console.error("[reschedule] freebusy", e);
    return NextResponse.json({ ok: false, code: "server_error", message: "Couldn't reach the calendar." }, { status: 502 });
  }
  if (!slotIsBookable(slotStartUtc, busy, now)) {
    return NextResponse.json(
      { ok: false, code: "slot_taken", message: "That slot isn't available.", slots: computeSlots(busy, now).slice(0, 12) },
      { status: 409 },
    );
  }

  // Atomically move the slot (unique index blocks collisions with other bookings).
  try {
    await db
      .update(schema.bookings)
      .set({
        slotStartUtc: startDate,
        slotEndUtc: endDate,
        remindersSent: [],
        updatedAt: new Date(),
      })
      .where(eq(schema.bookings.id, b.id));
  } catch (e) {
    if (isUniqueViolation(e)) {
      return NextResponse.json(
        { ok: false, code: "slot_taken", message: "That slot was just taken.", slots: computeSlots(busy, now).filter((s) => s.startUtc !== slotStartUtc).slice(0, 12) },
        { status: 409 },
      );
    }
    console.error("[reschedule] update", e);
    return NextResponse.json({ ok: false, code: "server_error", message: "Couldn't move your booking." }, { status: 500 });
  }

  if (b.googleEventId) {
    try {
      await updateEventTime(b.googleEventId, slotStartUtc, slotEndUtc);
    } catch (e) {
      console.error("[reschedule] calendar", e);
    }
  }

  const whenText = formatWhen(slotStartUtc, b.timezone);
  const { rescheduleUrl, cancelUrl } = manageUrls(b.id);
  const mail = rescheduledEmail({
    name: firstName(b.fullName),
    whenText,
    meetUrl: b.meetUrl,
    rescheduleUrl,
    cancelUrl,
  });
  void sendEmail({ to: b.email, subject: mail.subject, html: mail.html });

  return NextResponse.json({ ok: true, slotStartUtc, slotEndUtc, whenText, meetUrl: b.meetUrl });
}
