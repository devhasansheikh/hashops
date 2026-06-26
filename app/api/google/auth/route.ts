import { NextResponse } from "next/server";
import { authUrl } from "@/lib/booking/google";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One-time setup: visit this (signed into the host Google account) to start the
// OAuth consent. After approving you're redirected to /api/google/callback,
// which prints the refresh token to paste into GOOGLE_REFRESH_TOKEN.
export async function GET() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      { ok: false, message: "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET first." },
      { status: 503 },
    );
  }
  return NextResponse.redirect(authUrl());
}
