/* ------------------------------------------------------------------ */
/*  Tool-stack marks. Colored marks use official brand colours; the    */
/*  inherently monochrome marks (Notion, OpenAI) use currentColor so   */
/*  they read in both themes. Stylized recreations — swap with the     */
/*  brands' official SVGs in /public/logos when available.             */
/* ------------------------------------------------------------------ */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const vb = "0 0 24 24";

export const NotionLogo = (p: P) => (
  <svg viewBox={vb} fill="none" {...p}>
    <rect x="3" y="2.5" width="18" height="19" rx="3" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 16.5V8l8 8V8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ClaudeLogo = (p: P) => (
  <svg viewBox={vb} {...p}>
    <g stroke="#D97757" strokeWidth="2.1" strokeLinecap="round">
      <path d="M12 4.2v6.1" />
      <path d="M12 13.7v6.1" />
      <path d="M4.6 7.8 9.9 11" />
      <path d="M14.1 13 19.4 16.2" />
      <path d="M19.4 7.8 14.1 11" />
      <path d="M9.9 13 4.6 16.2" />
    </g>
    <circle cx="12" cy="12" r="1.7" fill="#D97757" />
  </svg>
);

export const OpenAILogo = (p: P) => (
  <svg viewBox={vb} {...p}>
    <path
      d="M12 3.2a4.1 4.1 0 0 0-3.9 2.85 4.1 4.1 0 0 0-2.74 1.98 4.1 4.1 0 0 0 .5 4.82 4.1 4.1 0 0 0 .43 4.83 4.1 4.1 0 0 0 2.46 1.71A4.1 4.1 0 0 0 12 20.8a4.1 4.1 0 0 0 3.9-2.85 4.1 4.1 0 0 0 2.74-1.98 4.1 4.1 0 0 0-.5-4.82 4.1 4.1 0 0 0-.43-4.83 4.1 4.1 0 0 0-2.46-1.71A4.1 4.1 0 0 0 12 3.2Zm0 1.6c.83 0 1.6.34 2.16.9-.03.02-.08.05-.13.07l-3.2 1.85a.55.55 0 0 0-.28.48v3.96l-1.4-.82V7.7c0-1.6 1.27-2.9 2.85-2.9Z"
      fill="currentColor"
    />
    <path
      d="M16.8 7.06c.7.4 1.22 1.06 1.45 1.84-.03-.02-.08-.04-.13-.07l-3.2-1.85a.55.55 0 0 0-.56 0l-3.42 1.98v-1.63l3.18-1.83a2.86 2.86 0 0 1 2.68-.42Z"
      fill="currentColor"
      opacity="0.78"
    />
  </svg>
);

export const MakeLogo = (p: P) => (
  <svg viewBox={vb} {...p}>
    <rect width="24" height="24" rx="6" fill="#6D00CC" />
    <g fill="#fff">
      <path d="M6.2 7h1.7l.05 10H6.2z" />
      <path d="M10.3 7h1.7l1.5 10h-1.7z" transform="skewX(-9)" />
      <path d="M15.9 7h1.9l-.05 10h-1.7z" />
    </g>
  </svg>
);

export const N8nLogo = (p: P) => (
  <svg viewBox={vb} {...p}>
    <g fill="#EA4B71">
      <circle cx="4.4" cy="12" r="2.2" />
      <circle cx="12" cy="6.6" r="2.2" />
      <circle cx="12" cy="17.4" r="2.2" />
      <circle cx="19.6" cy="12" r="2.2" />
    </g>
    <g stroke="#EA4B71" strokeWidth="1.5">
      <path d="M6.4 11 10 7.6M6.4 13 10 16.4M14 7.6 17.6 11M14 16.4 17.6 13" />
    </g>
  </svg>
);

export const ZapierLogo = (p: P) => (
  <svg viewBox={vb} {...p}>
    <g stroke="#FF4F00" strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 3.5v17" />
      <path d="M3.5 12h17" />
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </g>
    <circle cx="12" cy="12" r="2.5" fill="#FF4F00" />
  </svg>
);

export const SlackLogo = (p: P) => (
  <svg viewBox={vb} {...p}>
    <g>
      <path d="M6 14.2a2 2 0 1 1-2-2h2v2Zm1 0a2 2 0 0 1 4 0v5a2 2 0 1 1-4 0v-5Z" fill="#E01E5A" />
      <path d="M9.8 6a2 2 0 1 1 2-2v2h-2Zm0 1a2 2 0 0 1 0 4h-5a2 2 0 1 1 0-4h5Z" fill="#36C5F0" />
      <path d="M18 9.8a2 2 0 1 1 2 2h-2v-2Zm-1 0a2 2 0 0 1-4 0v-5a2 2 0 1 1 4 0v5Z" fill="#2EB67D" />
      <path d="M14.2 18a2 2 0 1 1-2 2v-2h2Zm0-1a2 2 0 0 1 0-4h5a2 2 0 1 1 0 4h-5Z" fill="#ECB22E" />
    </g>
  </svg>
);

export const AirtableLogo = (p: P) => (
  <svg viewBox={vb} {...p}>
    <path d="M11.3 3.5 3.6 6.6c-.5.2-.5.9 0 1.1l7.8 3.1c.4.2.8.2 1.2 0l7.8-3.1c.5-.2.5-.9 0-1.1l-7.7-3.1a1.6 1.6 0 0 0-1.2 0Z" fill="#FFBF00" />
    <path d="M12.8 12.5v7.3c0 .4.4.7.8.5l6.7-2.6c.3-.1.5-.4.5-.7V9.7c0-.4-.4-.7-.8-.5l-6.7 2.6c-.3.1-.5.4-.5.7Z" fill="#26B5F8" />
    <path d="M3.6 9.4 7 10.8v3.5l-3 1.2c-.4.2-.9-.1-.9-.5V9.7c0-.3.3-.5.6-.4Z" fill="#ED3049" />
    <path d="m11.1 12.6-3.6 1.4v3.4l3.6-1.4z" fill="#ED3049" opacity=".85" />
  </svg>
);

export const ClickUpLogo = (p: P) => (
  <svg viewBox={vb} {...p}>
    <path d="m3.5 16.2 3.1-2.4c1.6 2.1 3.4 3.1 5.4 3.1s3.8-1 5.4-3.1l3.1 2.4c-2.3 3-5.2 4.6-8.5 4.6s-6.2-1.6-8.5-4.6Z" fill="#FF02F0" />
    <path d="M12 6.9 6.5 11.6 4 8.7 12 1.8l8 6.9-2.6 2.9z" fill="#7B68EE" />
  </svg>
);

export const StripeLogo = (p: P) => (
  <svg viewBox={vb} {...p}>
    <rect width="24" height="24" rx="6" fill="#635BFF" />
    <path d="M11.7 9.5c0-.6.5-.8 1.2-.8 1 0 2.3.3 3.3.9V6.4a8 8 0 0 0-3.3-.7c-2.7 0-4.5 1.4-4.5 3.8 0 3.7 5 3.1 5 4.7 0 .7-.6.9-1.4.9-1.1 0-2.6-.5-3.7-1.1v3.2c1.2.5 2.5.8 3.7.8 2.8 0 4.7-1.4 4.7-3.8 0-4-5-3.3-5-4.7Z" fill="#fff" />
  </svg>
);

export const CalendlyLogo = (p: P) => (
  <svg viewBox={vb} {...p}>
    <circle cx="12" cy="12" r="9" fill="#006BFF" />
    <path
      d="M15.8 13.7c-.3.7-1 1.9-2.9 1.9-1.4 0-2.5-1.1-2.5-3 0-1.9 1-3.1 2.5-3.1 1.8 0 2.5 1.2 2.8 1.9l1.7-.9C16.6 9 15.3 7.6 12.9 7.6c-2.7 0-4.6 2-4.6 4.9s1.9 4.9 4.6 4.9c2.5 0 3.8-1.5 4.5-3l-1.6-.7Z"
      fill="#fff"
    />
  </svg>
);

export const GoogleLogo = (p: P) => (
  <svg viewBox={vb} {...p}>
    <path d="M21.6 12.2c0-.7-.06-1.2-.18-1.78H12v3.4h5.5a4.7 4.7 0 0 1-2.04 3.08v2.55h3.3c1.93-1.78 3.04-4.4 3.04-7.25Z" fill="#4285F4" />
    <path d="M12 22c2.75 0 5.06-.9 6.74-2.46l-3.3-2.55c-.9.6-2.06.96-3.44.96-2.65 0-4.9-1.79-5.7-4.2H2.9v2.63A10 10 0 0 0 12 22Z" fill="#34A853" />
    <path d="M6.3 13.75a6 6 0 0 1 0-3.5V7.62H2.9a10 10 0 0 0 0 8.76l3.4-2.63Z" fill="#FBBC05" />
    <path d="M12 5.95c1.5 0 2.84.51 3.9 1.52l2.92-2.92C17.06 2.92 14.75 2 12 2A10 10 0 0 0 2.9 7.62l3.4 2.63C7.1 7.74 9.35 5.95 12 5.95Z" fill="#EA4335" />
  </svg>
);

export const TOOL_LOGO_MAP: Record<string, (p: P) => JSX.Element> = {
  Notion: NotionLogo,
  Claude: ClaudeLogo,
  OpenAI: OpenAILogo,
  Make: MakeLogo,
  n8n: N8nLogo,
  Zapier: ZapierLogo,
  Slack: SlackLogo,
  Airtable: AirtableLogo,
  ClickUp: ClickUpLogo,
  Stripe: StripeLogo,
  Calendly: CalendlyLogo,
  "Google Workspace": GoogleLogo,
};
