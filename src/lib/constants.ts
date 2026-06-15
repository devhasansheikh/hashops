/* ------------------------------------------------------------------ */
/*  Site-wide constants                                                */
/* ------------------------------------------------------------------ */

/**
 * Booking link used by every primary CTA.
 * Set NEXT_PUBLIC_CALENDLY_URL in your environment to override, or edit the
 * fallback below. See README.md.
 */
export const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/hashops/ops-strategy-call";

export const SITE = {
  name: "HASH",
  domain: "hashops.io",
  url: "https://hashops.io",
  tagline: "Operational Systems for Service Businesses",
  positioning:
    "For service-led founders, HASH builds the operational systems that let them scale without scaling headcount: audit-first, ROI-justified, documented, and built to last.",
  email: "hashdigitalstudios@gmail.com",
  location: "Karachi, Pakistan",
  cta: "Book your Ops Strategy Call",
  ctaShort: "Book a call",
};

export const NAV_LINKS = [
  { label: "Services", href: "#system" },
  { label: "Audit", href: "#audit" },
  { label: "Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export interface Tool {
  name: string;
  file: string;
  /** Inherently monochrome marks render in the theme heading colour. */
  mono?: boolean;
}

/** Tool-stack marquee — official marks live in /public/logos. */
export const TOOLS: Tool[] = [
  { name: "Notion", file: "notion.svg", mono: true },
  { name: "Claude", file: "claude.svg" },
  { name: "OpenAI", file: "openai.svg", mono: true },
  { name: "Make", file: "make.svg" },
  { name: "n8n", file: "n8n.svg" },
  { name: "Zapier", file: "zapier.svg" },
  { name: "Slack", file: "slack.svg" },
  { name: "Airtable", file: "airtable.svg" },
  { name: "ClickUp", file: "clickup.svg" },
  { name: "Stripe", file: "stripe.svg" },
  { name: "Calendly", file: "calendly.svg" },
  { name: "Google Workspace", file: "google-workspace.svg" },
];

export const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "X / Twitter", href: "https://x.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
];
