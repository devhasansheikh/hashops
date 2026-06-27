import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, dbConfigured, schema } from "@/lib/db/client";
import { BOOKING } from "@/lib/booking/config";
import { verifyActionToken } from "@/lib/booking/tokens";
import { deleteEvent, googleConfigured } from "@/lib/booking/google";
import { formatWhen } from "@/lib/booking/format";
import { leakPhrase, REVENUE_LABELS } from "@/lib/booking/quiz";
import {
  firstName,
  manageUrls,
  hostNotifyEmail,
} from "@/lib/booking/helpers";
import { sendEmail } from "@/lib/email/resend";
import { cancelledEmail, hostNotificationEmail } from "@/lib/email/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Input = z.object({ token: z.string().min(1) });

export async function POST(req: Request) {
  if (!dbConfigured)
    return NextResponse.json({ ok: false, message: "Not configured." }, { status: 503 });

  let token: string;
  try {
    token = Input.parse(await req.json()).token;
  } catch {
    return NextResponse.json({ ok: false, message: "Bad request." }, { status: 400 });
  }
  const v = verifyActionToken(token);
  if (!v)
    return NextResponse.json(
      { ok: false, message: "This link is invalid or expired." },
      { status: 400 },
    );

  const [b] = await db
    .select()
    .from(schema.bookings)
    .where(eq(schema.bookings.id, v.bookingId))
    .limit(1);
  if (!b)
    return NextResponse.json({ ok: false, message: "Booking not found." }, { status: 404 });

  if (b.status === "cancelled") return NextResponse.json({ ok: true, already: true });

  // Free the calendar slot, then mark cancelled (frees the DB slot too via the
  // partial unique index, which only covers non-cancelled rows).
  if (b.googleEventId && googleConfigured()) {
    try {
      await deleteEvent(b.googleEventId);
    } catch (e) {
      console.error("[cancel] calendar", e);
    }
  }
  await db
    .update(schema.bookings)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(schema.bookings.id, b.id));

  const { rebookUrl } = manageUrls(b.id);
  const mail = cancelledEmail({ name: firstName(b.fullName), rebookUrl });
  await sendEmail({ to: b.email, subject: mail.subject, html: mail.html });

  const host = hostNotificationEmail({
    kind: "cancelled",
    clientName: b.fullName,
    clientEmail: b.email,
    phone: b.whatsapp,
    company: b.company || undefined,
    revenueLabel: b.revenueRange ? REVENUE_LABELS[b.revenueRange] ?? b.revenueRange : undefined,
    leak: leakPhrase(b.quiz.leak),
    whenText: formatWhen(b.slotStartUtc.toISOString(), BOOKING.hostTimezone),
    meetUrl: null,
  });
  await sendEmail({ to: hostNotifyEmail(), subject: host.subject, html: host.html });

  return NextResponse.json({ ok: true });
}
