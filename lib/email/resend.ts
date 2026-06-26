// Thin Resend wrapper. No key configured → logs + no-ops (build/dev safe).
import { Resend } from "resend";

export type SendResult = { sent: boolean; id?: string; error?: string };

export async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "HASH <onboarding@resend.dev>";
  if (!key) {
    console.warn(
      "[hash-booking] RESEND_API_KEY missing — email not sent:",
      args.subject,
    );
    return { sent: false, error: "no_api_key" };
  }
  try {
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send({
      from,
      to: args.to,
      subject: args.subject,
      html: args.html,
      replyTo: args.replyTo || process.env.EMAIL_REPLY_TO || undefined,
    });
    if (error) return { sent: false, error: error.message };
    return { sent: true, id: data?.id };
  } catch (err) {
    return {
      sent: false,
      error: err instanceof Error ? err.message : "send_failed",
    };
  }
}
