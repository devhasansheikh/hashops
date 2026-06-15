import type { Metadata, Viewport } from "next";
import "./globals.css";
import { hanken, jost, jetbrainsMono } from "./fonts";
import { Providers } from "./providers";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "HASH — Operational Systems for Service Businesses",
    template: "%s · HASH",
  },
  description: SITE.positioning,
  applicationName: "HASH",
  keywords: [
    "operational systems",
    "business automation",
    "Notion workspace",
    "ops audit",
    "service business systems",
    "AI agents",
    "ROI",
  ],
  authors: [{ name: "HASH", url: SITE.url }],
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: "HASH",
    title: "HASH — Operational Systems for Service Businesses",
    description: SITE.positioning,
  },
  twitter: {
    card: "summary_large_image",
    title: "HASH — Operational Systems for Service Businesses",
    description: SITE.positioning,
  },
  alternates: { canonical: SITE.url },
  robots: { index: true, follow: true },
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${hanken.variable} ${jost.variable} ${jetbrainsMono.variable}`}
    >
      <body className="theme-fade min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
