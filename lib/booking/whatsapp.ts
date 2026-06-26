// WhatsApp reminders — optional module, OFF by default behind a feature flag.
// Email reminders are the required core; this is a clean seam to light up later
// with a real provider (WhatsApp Cloud API or Twilio) without touching the rest.
import { BOOKING } from "./config";

export type WhatsAppResult = { sent: boolean; skipped?: boolean; error?: string };

/**
 * Send a WhatsApp message. While WHATSAPP_ENABLED is "false" this is a no-op
 * that reports `skipped: true`, so callers can treat it uniformly.
 */
export async function sendWhatsApp(
  to: string,
  message: string,
): Promise<WhatsAppResult> {
  if (!BOOKING.whatsappEnabled) {
    return { sent: false, skipped: true };
  }

  const provider = process.env.WHATSAPP_PROVIDER;
  try {
    if (provider === "cloud_api") return await sendViaCloudApi(to, message);
    if (provider === "twilio") return await sendViaTwilio(to, message);
    return { sent: false, skipped: true, error: "no WHATSAPP_PROVIDER set" };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "send failed" };
  }
}

// ---- Provider stubs — implement when you enable WhatsApp ---------------------

async function sendViaCloudApi(to: string, message: string): Promise<WhatsAppResult> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) return { sent: false, error: "missing cloud api creds" };

  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to.replace(/[^\d]/g, ""),
      type: "text",
      text: { body: message },
    }),
  });
  if (!res.ok) return { sent: false, error: `cloud api ${res.status}` };
  return { sent: true };
}

async function sendViaTwilio(to: string, message: string): Promise<WhatsAppResult> {
  const token = process.env.WHATSAPP_TOKEN; // Twilio auth token
  const sid = process.env.WHATSAPP_TWILIO_SID;
  const from = process.env.WHATSAPP_FROM; // "whatsapp:+1..."
  if (!token || !sid || !from) return { sent: false, error: "missing twilio creds" };

  const body = new URLSearchParams({
    To: `whatsapp:${to.startsWith("+") ? to : "+" + to.replace(/[^\d]/g, "")}`,
    From: from,
    Body: message,
  });
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    },
  );
  if (!res.ok) return { sent: false, error: `twilio ${res.status}` };
  return { sent: true };
}
