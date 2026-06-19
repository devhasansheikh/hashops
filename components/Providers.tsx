"use client";

import { ThemeProvider } from "next-themes";
import { CalendlyProvider } from "@/components/CalendlyModal";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PageLoader } from "@/components/PageLoader";
import { CardSpotlight } from "@/components/CardSpotlight";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CalendlyProvider>
        <SmoothScroll />
        <CardSpotlight />
        <PageLoader />
        {children}
      </CalendlyProvider>
    </ThemeProvider>
  );
}
