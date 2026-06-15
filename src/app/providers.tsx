"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { BookingProvider } from "@/components/providers/BookingProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <SmoothScroll>
        <BookingProvider>{children}</BookingProvider>
      </SmoothScroll>
    </ThemeProvider>
  );
}
