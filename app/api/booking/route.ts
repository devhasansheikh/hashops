import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, dbConfigured, schema } from "@/lib/db/client";
import { verifyActionToken } from "@/lib/booking/tokens";
import { formatWhen } from "@/lib/booking/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Look up a booking by its signed manage token (used by /booking/manage).
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const v = verifyActionToken(token);
  if (!v)
    return NextResponse.json(
      { ok: false, message: "This link is invalid or expired." },
      { status: 400 },
    );
  if (!dbConfigured)
    return NextResponse.json({ ok: false, message: "Not configured." }, { status: 503 });

  const [b] = await db
    .select()
    .from(schema.bookings)
    .where(eq(schema.bookings.id, v.bookingId))
    .limit(1);
  if (!b)
    return NextResponse.json({ ok: false, message: "Booking not found." }, { status: 404 });

  return NextResponse.json({
    ok: true,
    booking: {
      id: b.id,
      status: b.status,
      name: b.fullName,
      slotStartUtc: b.slotStartUtc.toISOString(),
      timezone: b.timezone,
      whenText: formatWhen(b.slotStartUtc.toISOString(), b.timezone),
      meetUrl: b.meetUrl,
      action: v.action,
    },
  });
}
