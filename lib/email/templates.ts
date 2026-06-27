// On-brand HTML email templates — premium dark layout, flame accents, the HASH
// logo, all inline-styled + table-based for email-client robustness.
// Pure functions → { subject, html }. Logo is served from the deployed site.
import { SITE_ORIGIN } from "@/lib/booking/config";

const C = {
  bg: "#0A0A0B",
  card: "#141417",
  panel: "#0E0E10",
  border: "#26262B",
  flame: "#FF7A1A",
  flame2: "#E55A00",
  heading: "#FAFAF7",
  body: "#B6B6BE",
  muted: "#83838B",
};
const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const LOGO = `${SITE_ORIGIN}/email-logo.png`;

const h1 = (t: string) =>
  `<h1 style="margin:0 0 14px;color:${C.heading};font-size:24px;line-height:1.25;font-weight:700;letter-spacing:-0.01em">${t}</h1>`;
const p = (t: string) =>
  `<p style="margin:0 0 16px;color:${C.body};font-size:15px;line-height:1.65">${t}</p>`;
const link = (href: string, label: string) =>
  `<a href="${href}" style="color:${C.flame};text-decoration:none">${label}</a>`;

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 2px"><tr>
    <td align="center" bgcolor="${C.flame2}" style="border-radius:11px;background-color:${C.flame2};background-image:linear-gradient(120deg,#FF8A2B,${C.flame2})">
      <a href="${href}" style="display:inline-block;padding:13px 30px;font-family:${FONT};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:11px">${label}</a>
    </td></tr></table>`;
}

function detailPanel(whenText: string, meetUrl: string | null): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 24px">
    <tr><td style="background:${C.panel};border:1px solid ${C.border};border-radius:12px;padding:18px 20px">
      <div style="color:${C.flame};font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-bottom:7px">Your call</div>
      <div style="color:${C.heading};font-size:17px;font-weight:600;line-height:1.4">${whenText}</div>
      ${meetUrl ? `<div style="margin-top:11px;font-size:14px;font-weight:600">${link(meetUrl, "Join with Google Meet &rarr;")}</div>` : ""}
    </td></tr></table>`;
}

function manageLine(rescheduleUrl: string, cancelUrl: string): string {
  return `<p style="margin:24px 0 0;color:${C.muted};font-size:13px;line-height:1.6">Need to change it? ${link(rescheduleUrl, "Reschedule")} &nbsp;&middot;&nbsp; ${link(cancelUrl, "Cancel")}</p>`;
}

function layout(preview: string, inner: string): string {
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark">
</head><body style="margin:0;padding:0;background:${C.bg};-webkit-font-smoothing:antialiased">
<span style="display:none!important;opacity:0;color:transparent;visibility:hidden;height:0;width:0;overflow:hidden">${preview}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg}"><tr><td align="center" style="padding:34px 14px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%">
    <tr><td style="height:4px;line-height:4px;font-size:0;background-color:${C.flame};background-image:linear-gradient(90deg,#FFA033,${C.flame} 50%,${C.flame2});border-radius:16px 16px 0 0">&nbsp;</td></tr>
    <tr><td style="background:${C.card};border:1px solid ${C.border};border-top:0;border-radius:0 0 16px 16px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td align="center" style="padding:30px 32px 20px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="vertical-align:middle"><img src="${LOGO}" alt="" width="40" height="40" style="display:block;border:0;outline:none;width:40px;height:40px" /></td>
            <td style="vertical-align:middle;padding-left:12px;font-family:${FONT};font-size:21px;font-weight:700;letter-spacing:0.26em;color:${C.flame};line-height:1">HASH</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:0 32px"><div style="height:1px;line-height:1px;font-size:0;background:${C.border}">&nbsp;</div></td></tr>
        <tr><td style="padding:26px 36px 34px;font-family:${FONT}">${inner}</td></tr>
      </table>
    </td></tr>
    <tr><td align="center" style="padding:20px 24px 6px;font-family:${FONT}">
      <div style="color:${C.muted};font-size:12px;line-height:1.7">HASH &middot; Audit-first systems for service businesses<br>${link(SITE_ORIGIN, "hashops.io")}</div>
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

type Base = {
  name: string;
  whenText: string;
  meetUrl: string | null;
  rescheduleUrl: string;
  cancelUrl: string;
};

export function confirmationEmail(b: Base): { subject: string; html: string } {
  const inner =
    h1("You're booked.") +
    p(`Hi ${b.name}, your Strategy Call is confirmed. We'll run the 7-layer audit live on your business and leave you with your top leaks costed, whether or not you ever work with us.`) +
    detailPanel(b.whenText, b.meetUrl) +
    (b.meetUrl ? button(b.meetUrl, "Join with Google Meet") : "") +
    p(`Come with a rough sense of your client count and what you charge. We'll turn that into a real number on the call.`) +
    manageLine(b.rescheduleUrl, b.cancelUrl);
  return {
    subject: `You're booked for ${b.whenText}`,
    html: layout("Your Strategy Call is confirmed.", inner),
  };
}

export function reminderEmail(
  b: Base & { lead: "24 hours" | "1 hour" },
): { subject: string; html: string } {
  const inner =
    h1(`Your call is in ${b.lead}.`) +
    p(`Hi ${b.name}, a quick reminder about your Strategy Call.`) +
    detailPanel(b.whenText, b.meetUrl) +
    (b.meetUrl ? button(b.meetUrl, "Join with Google Meet") : "") +
    p(`Bring a rough client count and your pricing. That's all we need to put a real number on what your operation is leaking.`) +
    manageLine(b.rescheduleUrl, b.cancelUrl);
  return {
    subject: `Reminder: your call is in ${b.lead}`,
    html: layout(`Your Strategy Call is in ${b.lead}.`, inner),
  };
}

export function rescheduledEmail(b: Base): { subject: string; html: string } {
  const inner =
    h1("Your call's been moved.") +
    p(`Hi ${b.name}, your Strategy Call is now set for the new time below.`) +
    detailPanel(b.whenText, b.meetUrl) +
    (b.meetUrl ? button(b.meetUrl, "Join with Google Meet") : "") +
    manageLine(b.rescheduleUrl, b.cancelUrl);
  return {
    subject: `Updated: your call is now ${b.whenText}`,
    html: layout("Your call has been rescheduled.", inner),
  };
}

export function cancelledEmail(b: {
  name: string;
  rebookUrl: string;
}): { subject: string; html: string } {
  const inner =
    h1("Your call's cancelled.") +
    p(`Hi ${b.name}, your Strategy Call has been cancelled and the slot is freed up.`) +
    p(`Changed your mind, or want a different time? You can book again whenever you're ready.`) +
    button(b.rebookUrl, "Book a new time");
  return {
    subject: "Your call is cancelled",
    html: layout("Your Strategy Call was cancelled.", inner),
  };
}

export function nurtureEmail(b: { name: string }): { subject: string; html: string } {
  const layers = [
    "Lead-to-cash visibility — can you see every deal and where it's stuck?",
    "Client delivery — does work run the same way for every client?",
    "Communication & decisions — do the same questions resurface monthly?",
    "Knowledge & documentation — would the business survive a week without you?",
    "Reporting — are your numbers current, or a month old when they land?",
    "Tool stack — are you paying for tools nobody opens?",
    "Hiring & onboarding — how long until a new hire is actually productive?",
  ];
  const rows = layers
    .map(
      (l, i) =>
        `<tr><td style="padding:11px 0;${i === 0 ? "" : `border-top:1px solid ${C.border};`}color:${C.body};font-size:14px;line-height:1.5"><span style="color:${C.flame};font-weight:700;margin-right:6px">${i + 1}.</span>${l}</td></tr>`,
    )
    .join("");
  const inner =
    h1("Your 7-layer Leak Checklist.") +
    p(`Hi ${b.name}, here's the same framework we run on the call. Score each layer honestly. Every "no" is usually where time and money quietly leak out.`) +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 18px">${rows}</table>` +
    p(`When two or more land as a clear "no," that's usually worth a real conversation. Reply to this email any time and we'll take a look.`);
  return {
    subject: "Your 7-layer Leak Checklist",
    html: layout("Run the 7-layer audit on your own business.", inner),
  };
}

function kvRows(pairs: [string, string][]): string {
  return pairs
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:5px 0;color:${C.muted};font-size:13px;width:120px;vertical-align:top">${k}</td><td style="padding:5px 0;color:${C.body};font-size:14px">${v}</td></tr>`,
    )
    .join("");
}

/** Internal notification to the host when a booking is made/changed/cancelled. */
export function hostNotificationEmail(b: {
  kind: "new" | "rescheduled" | "cancelled";
  clientName: string;
  clientEmail: string;
  whatsapp: string;
  company?: string;
  revenueLabel?: string;
  leak: string;
  whenText: string;
  meetUrl: string | null;
}): { subject: string; html: string } {
  const head =
    b.kind === "new"
      ? "New booking"
      : b.kind === "rescheduled"
        ? "Booking rescheduled"
        : "Booking cancelled";
  const rows = kvRows([
    ["Name", b.clientName],
    ["Email", b.clientEmail],
    ["WhatsApp", b.whatsapp],
    ["Company", b.company || ""],
    ["Revenue", b.revenueLabel || ""],
    ["Biggest leak", b.leak],
  ]);
  const inner =
    h1(`${head}.`) +
    detailPanel(b.whenText, b.kind === "cancelled" ? null : b.meetUrl) +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:2px 0 6px">${rows}</table>` +
    (b.kind === "cancelled" ? p("This slot is now free again.") : "");
  return {
    subject: `${head}: ${b.clientName} (${b.whenText})`,
    html: layout(`${head}: ${b.clientName}`, inner),
  };
}

/** Internal notification to the host when a nurture (checklist) lead comes in. */
export function hostLeadEmail(b: {
  name: string;
  email: string;
  leak: string;
  business: string;
  team: string;
  urgency: string;
}): { subject: string; html: string } {
  const rows = kvRows([
    ["Name", b.name],
    ["Email", b.email],
    ["Biggest leak", b.leak],
    ["Business", b.business],
    ["Team", b.team],
    ["Urgency", b.urgency],
  ]);
  const inner =
    h1("New checklist lead.") +
    p("Someone not ready to book grabbed the 7-layer Leak Checklist:") +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:2px 0 6px">${rows}</table>`;
  return { subject: `New lead: ${b.name}`, html: layout(`New lead: ${b.name}`, inner) };
}
