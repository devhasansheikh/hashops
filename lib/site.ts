/**
 * Site-wide constants. Set your real Calendly event URL here —
 * every primary CTA on the site opens this booking link.
 */
export const CALENDLY_URL =
  "https://calendly.com/hashdigitalstudios/ops-strategy-call";

export const SITE_URL = "https://hashops.io";
export const SITE_NAME = "HASH";
export const CONTACT_EMAIL = "info@hashops.io";

/** Primary CTA label, used across the site (nav shortens to "Book a call"). */
export const BOOK_CTA = "Book your Strategy Call";

export const NAV_LINKS = [
  { label: "Services", href: "#system" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;
