import { exchangeCodeForRefreshToken } from "@/lib/booking/google";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function page(text: string, status = 200): Response {
  const safe = text.replace(/</g, "&lt;");
  return new Response(
    `<!doctype html><meta charset="utf-8"><body style="background:#0A0A0B;color:#FAFAF7"><pre style="font:14px/1.7 ui-monospace,monospace;padding:28px;white-space:pre-wrap;word-break:break-all">${safe}</pre></body>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code");
  if (!code) return page("Missing ?code in the callback.", 400);
  try {
    const refresh = await exchangeCodeForRefreshToken(code);
    if (!refresh) {
      return page(
        "No refresh token was returned.\n\nGoogle only sends one on first consent. Remove this app at\nhttps://myaccount.google.com/permissions and visit /api/google/auth again.",
      );
    }
    return page(
      `Success. Copy this into GOOGLE_REFRESH_TOKEN in .env.local (and your Vercel env), then redeploy:\n\n${refresh}\n\nAfter that, delete these /api/google/* routes is optional — they require the host's Google login to do anything.`,
    );
  } catch (e) {
    return page("OAuth exchange failed: " + (e instanceof Error ? e.message : "error"), 500);
  }
}
