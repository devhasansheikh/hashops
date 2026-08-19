import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Backdrop } from "@/components/Backdrop";
import { ScrollProgress } from "@/components/ScrollProgress";
import { LeakproofHero } from "@/components/leakproof/LeakproofHero";
import { Reconciliation } from "@/components/leakproof/Reconciliation";
import { LeakTypes } from "@/components/leakproof/LeakTypes";
import { HowItWorks } from "@/components/leakproof/HowItWorks";
import { LeakproofCTA } from "@/components/leakproof/LeakproofCTA";

export const metadata: Metadata = {
  title: "Leakproof by HASH — Money you've already earned. Never billed.",
  description:
    "A forensic profit audit for Australian creative agencies. We reconcile what you promised, what you delivered, and what you billed, then show you exactly where money is falling through: unbilled work, underpriced clients, missed invoices, late payments.",
  keywords: [
    "agency profitability audit",
    "unbilled work recovery",
    "agency margin audit Australia",
    "creative agency profitability",
    "scope creep recovery",
    "agency retainer billing audit",
  ],
  alternates: { canonical: "/leakproof" },
  openGraph: {
    title: "Leakproof by HASH — Money you've already earned. Never billed.",
    description:
      "A forensic profit audit for Australian creative agencies. Find at least A$100,000 a year of recoverable leak, or you don't pay.",
    url: "/leakproof",
    siteName: "HASH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leakproof by HASH — Money you've already earned. Never billed.",
    description:
      "A forensic profit audit for Australian creative agencies. Find at least A$100,000 a year of recoverable leak, or you don't pay.",
  },
};

/**
 * A HASH service page, not a second website.
 *
 * Three things are deliberately absent compared with the homepage, because
 * each one is a homepage gesture that made this route feel like a separate
 * product site:
 *
 *  - <AuroraField>  the drifting ember blobs are the homepage's ambience
 *  - <SectionFX>    the 46px + blur band transition on every section
 *  - a page-local nav; the global header renders here with Leakproof active
 *
 * The brand backdrop stays, damped: at full strength its horizon arc is a
 * hero graphic, and a left-aligned band sits right on the bright flank of it.
 * Held back it reads as atmosphere, which is what ties this page to the rest
 * of the site. Reveals come from components/leakproof/Rise.
 */
export default function LeakproofPage() {
  return (
    <>
      <Backdrop opacity={0.28} />
      <ScrollProgress />
      <Nav />
      <main className="relative z-[1]">
        <LeakproofHero />
        <Reconciliation />
        <LeakTypes />
        <HowItWorks />
        <LeakproofCTA />
      </main>
      <Footer />
    </>
  );
}
