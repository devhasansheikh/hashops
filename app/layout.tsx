import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SITE_URL } from "@/lib/site";
import "flag-icons/css/flag-icons.min.css";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
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
  title: "HASH — Take on more clients without the chaos",
  description:
    "Audit-first systems that let service businesses take on more clients without the chaos. Raise prices, onboard faster, and run every client the same way, without adding headcount.",
  keywords: [
    "scale service business",
    "business systems",
    "automation for service businesses",
    "client onboarding systems",
    "business audit",
    "AI agents for operations",
  ],
  openGraph: {
    title: "HASH — Take on more clients without the chaos",
    description:
      "Audit-first systems that let you take on more clients without the chaos. Raise prices, onboard faster, and run every client the same way, without adding headcount.",
    url: SITE_URL,
    siteName: "HASH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HASH — Take on more clients without the chaos",
    description:
      "Audit-first systems that let you take on more clients without the chaos.",
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
        className={`${sans.variable} ${serif.variable} ${jbMono.variable} font-body`}
      >
        {/* Preload the official logo assets so they show instantly in the
            intro loader and nav (React 19 hoists these to <head>). */}
        <link rel="preload" as="image" href="/hash-lockup.svg" />
        <link rel="preload" as="image" href="/hash-logo.svg" />
        <Providers>{children}</Providers>
        {/* cinematic film grain over everything — breaks digital flatness */}
        <div className="film-grain" aria-hidden />

      </body>
      <GoogleAnalytics gaId="G-HM2WJK40R4" />
    </html>
  );
}
