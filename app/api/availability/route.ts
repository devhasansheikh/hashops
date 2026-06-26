import { NextResponse } from "next/server";
import { googleConfigured, getBusy } from "@/lib/booking/google";
import { computeSlots, busyWindow } from "@/lib/booking/availability";
import { BOOKING } from "@/lib/booking/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const base = { hostTimezone: BOOKING.hostTimezone, slotMinutes: BOOKING.slotMinutes };

  if (!googleConfigured()) {
    return NextResponse.json(
      { ...base, slots: [], configured: false },
      { headers: { "cache-control": "no-store" } },
    );
  }

  try {
    const now = new Date();
    const { timeMinISO, timeMaxISO } = busyWindow(now);
    const busy = await getBusy(timeMinISO, timeMaxISO);
    const slots = computeSlots(busy, now);
    return NextResponse.json(
      { ...base, slots, configured: true },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (err) {
    console.error("[availability]", err);
    return NextResponse.json(
      { ...base, slots: [], configured: true, error: "fetch_failed" },
      { headers: { "cache-control": "no-store" } },
    );
  }
}
