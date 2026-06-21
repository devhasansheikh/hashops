"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
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
      {/* Motion is a SITE-level preference, not the OS one. reducedMotion="never"
          makes framer-motion ignore the device's prefers-reduced-motion flag, so
          every useReducedMotion()-gated animation plays on every device by
          default. A future on-site "reduce motion" toggle can flip this to
          "always" and set data-reduce-motion="true" on <html> (the CSS, Lenis,
          and WebGL backdrop gates all read that attribute). */}
      <MotionConfig reducedMotion="never">
        <CalendlyProvider>
          <SmoothScroll />
          <CardSpotlight />
          <PageLoader />
          {children}
        </CalendlyProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
