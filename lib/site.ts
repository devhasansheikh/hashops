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
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Leakproof", href: "/leakproof" },
] as const;

/** Section links for the Leakproof service page (route links start with "/"). */
export const LEAKPROOF_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "The leak", href: "#planes" },
  { label: "The audit", href: "#offer" },
  { label: "Process", href: "#process" },
  { label: "Guarantee", href: "#guarantee" },
  { label: "FAQ", href: "#faq" },
] as const;
