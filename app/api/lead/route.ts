import { NextResponse } from "next/server";
import { z } from "zod";
import { db, dbConfigured, schema } from "@/lib/db/client";
import { firstName, hostNotifyEmail } from "@/lib/booking/helpers";
import { leakPhrase } from "@/lib/booking/quiz";
import { sendEmail } from "@/lib/email/resend";
import { nurtureEmail, hostLeadEmail } from "@/lib/email/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Input = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  timezone: z.string().trim().max(60).optional().default(""),
  quiz: z.object({
    businessType: z.string(),
    teamSize: z.string(),
    leak: z.string(),
    urgency: z.string(),
  }),
});

export async function POST(req: Request) {
  let input: z.infer<typeof Input>;
  try {
    input = Input.parse(await req.json());
  } catch {
    return NextResponse.json(
      { ok: false, message: "Please enter your name and a valid email." },
      { status: 400 },
    );
  }

  if (dbConfigured) {
    try {
      await db.insert(schema.leads).values({
        fullName: input.fullName,
        email: input.email,
        quiz: input.quiz,
        timezone: input.timezone || null,
        kind: "nurture",
      });
    } catch (e) {
      console.error("[lead] insert", e);
      // Don't fail the UX over a storage hiccup — still send the checklist.
    }
  }

  const mail = nurtureEmail({ name: firstName(input.fullName) });
  await sendEmail({ to: input.email, subject: mail.subject, html: mail.html });

  const host = hostLeadEmail({
    name: input.fullName,
    email: input.email,
    leak: leakPhrase(input.quiz.leak),
    business: input.quiz.businessType,
    team: input.quiz.teamSize,
    urgency: input.quiz.urgency,
  });
  await sendEmail({ to: hostNotifyEmail(), subject: host.subject, html: host.html });

  return NextResponse.json({ ok: true });
}
