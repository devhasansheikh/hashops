import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Jost, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jbmono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "HASH — Operational Systems for Service Businesses",
  description:
    "HASH builds the dashboards, automations, and Notion workspace architecture that let service businesses scale without scaling headcount. Audit-first, ROI-justified, documented.",
  keywords: [
    "operational systems",
    "business automation",
    "Notion workspace",
    "ops audit",
    "service business operations",
    "dashboards",
  ],
  openGraph: {
    title: "HASH — Operational Systems for Service Businesses",
    description:
      "Audit-first systems that scale your ops, not your headcount. Dashboards, automations, and workspace architecture for service businesses.",
    url: SITE_URL,
    siteName: "HASH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HASH — Operational Systems for Service Businesses",
    description:
      "Audit-first systems that scale your ops, not your headcount.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0B" },
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${hanken.variable} ${jost.variable} ${jbMono.variable} font-body`}
      >
        {/* Preload the official logo assets so they show instantly in the
            intro loader and nav (React 19 hoists these to <head>). */}
        <link rel="preload" as="image" href="/hash-lockup.svg" />
        <link rel="preload" as="image" href="/hash-logo.svg" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
