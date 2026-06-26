import { NextResponse } from "next/server";
import { and, gt, lte, eq } from "drizzle-orm";
import { db, dbConfigured, schema } from "@/lib/db/client";
import { formatWhen } from "@/lib/booking/format";
import { firstName, manageUrls } from "@/lib/booking/helpers";
import { sendEmail } from "@/lib/email/resend";
import { reminderEmail } from "@/lib/email/templates";
import { sendWhatsApp } from "@/lib/booking/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") || "";
  const qs = new URL(req.url).searchParams.get("secret");
  return header === `Bearer ${secret}` || qs === secret;
}

async function run(req: Request) {
  if (!process.env.CRON_SECRET)
    return NextResponse.json({ ok: false, message: "CRON_SECRET not set" }, { status: 503 });
  if (!authorized(req))
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  if (!dbConfigured)
    return NextResponse.json({ ok: false, message: "db not configured" }, { status: 503 });

  const now = new Date();
  const horizon = new Date(now.getTime() + 25 * 60 * 60 * 1000);

  const rows = await db
    .select()
    .from(schema.bookings)
    .where(
      and(
        eq(schema.bookings.status, "confirmed"),
        gt(schema.bookings.slotStartUtc, now),
        lte(schema.bookings.slotStartUtc, horizon),
      ),
    );

  let sent = 0;
  for (const b of rows) {
    const hrs = (b.slotStartUtc.getTime() - now.getTime()) / 3_600_000;
    const already = new Set(b.remindersSent ?? []);
    const toSend: ("24h" | "1h")[] = [];
    if (hrs <= 24 && hrs > 1 && !already.has("24h")) toSend.push("24h");
    if (hrs <= 1 && hrs > 0 && !already.has("1h")) toSend.push("1h");
    if (toSend.length === 0) continue;

    const whenText = formatWhen(b.slotStartUtc.toISOString(), b.timezone);
    const { rescheduleUrl, cancelUrl } = manageUrls(b.id);
    let changed = false;

    for (const kind of toSend) {
      const lead = kind === "24h" ? "24 hours" : "1 hour";
      const mail = reminderEmail({
        name: firstName(b.fullName),
        whenText,
        meetUrl: b.meetUrl,
        rescheduleUrl,
        cancelUrl,
        lead,
      });
      const r = await sendEmail({ to: b.email, subject: mail.subject, html: mail.html });
      void sendWhatsApp(
        b.whatsapp,
        `Reminder: your HASH call is in ${lead} — ${whenText}.${b.meetUrl ? " Join: " + b.meetUrl : ""}`,
      );
      if (r.sent) {
        already.add(kind);
        changed = true;
        sent++;
      }
    }

    if (changed) {
      await db
        .update(schema.bookings)
        .set({ remindersSent: Array.from(already), updatedAt: new Date() })
        .where(eq(schema.bookings.id, b.id));
    }
  }

  return NextResponse.json({ ok: true, scanned: rows.length, sent });
}

export async function GET(req: Request) {
  return run(req);
}
export async function POST(req: Request) {
  return run(req);
}
