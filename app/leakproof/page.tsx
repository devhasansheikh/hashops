import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FAQ } from "@/components/FAQ";
import { Backdrop } from "@/components/Backdrop";
import { AuroraField } from "@/components/AuroraField";
import { SectionFX } from "@/components/SectionFX";
import { ScrollProgress } from "@/components/ScrollProgress";
import { LeakproofHero } from "@/components/leakproof/LeakproofHero";
import { ThreePlanes } from "@/components/leakproof/ThreePlanes";
import { LeakFindings } from "@/components/leakproof/LeakFindings";
import { AuditOffer } from "@/components/leakproof/AuditOffer";
import { AuditProcess } from "@/components/leakproof/AuditProcess";
import { Guarantee } from "@/components/leakproof/Guarantee";
import { LeakproofCTA } from "@/components/leakproof/LeakproofCTA";
import { LEAKPROOF_NAV_LINKS } from "@/lib/site";

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

const FAQ_ITEMS = [
  {
    q: "What do we actually have to hand over?",
    a: "Exports your team can produce in an afternoon: profit and loss, invoices and aged receivables from your accounting tool, a detailed time export from your tracking tool, your active client contracts, and payroll totals or role bands. No passwords, no bank logins, no write access to anything, and we never contact your clients.",
  },
  {
    q: "Can't our accountant or bookkeeper just do this?",
    a: "They see one of the three records: what was billed. Your project manager sees another: what was done. The audit works because it lines both up against the one nobody owns, what was promised. That means reading every active contract and rebuilding scope client by client, which is exactly the work that never reaches the top of anyone's list.",
  },
  {
    q: "Won't the tools we already pay for show us this?",
    a: "No single tool you run spans contracts, time and invoicing, so no dashboard you already own can surface the gaps between them. And tools only measure forward from the day you set them up. We look backwards, at the last twelve months, where the money already went.",
  },
  {
    q: "How much of the team's time does this take?",
    a: "Almost none, by design. Nobody changes how they work and nobody adopts new software. Your bookkeeper or ops lead runs the exports, we do the rest, and the only person who has to act is you, for ninety minutes, on a ranked list of decisions.",
  },
  {
    q: "What does it cost?",
    a: "A fixed fee, agreed in writing before we start, with the scope fixed too: up to 25 active clients and twelve months of history. No hourly billing, no surprises. We quote it on the call once we've confirmed the audit actually fits your agency, and it's backed by the guarantee: at least A$100,000 of annualised recoverable leak identified, or the fee comes back in full.",
  },
  {
    q: "What if our numbers are actually fine?",
    a: "Then you find that out for certain, we refund the fee, and it has cost you a few exports. That's the guarantee working as intended. In practice, an agency with retainers, a growing team and a few years of history almost always has gaps; the honest unknown is the size, not the existence.",
  },
  {
    q: "Our data is a mess. Is that a dealbreaker?",
    a: "It's expected. Inconsistent client names, missing cost rates, contracts that don't match what's actually being paid: that mess is usually where the money went, so we treat it as evidence, not an obstacle. Anything that genuinely can't be reconciled is named in the report instead of guessed at.",
  },
  {
    q: "Is our financial data safe with you?",
    a: "A confidentiality agreement is signed before any data moves, and we offer it before you ask. Access is read-only, salaries can stay private behind role bands, and every claim in the report traces to your own records, so you can verify each line without taking our word for anything.",
  },
];

export default function LeakproofPage() {
  return (
    <>
      <Backdrop />
      <AuroraField />
      <SectionFX />
      <ScrollProgress />
      <Nav links={LEAKPROOF_NAV_LINKS} />
      <main className="relative z-[1]">
        <LeakproofHero />
        <ThreePlanes />
        <LeakFindings />
        <AuditOffer />
        <AuditProcess />
        <Guarantee />
        <FAQ
          items={FAQ_ITEMS}
          index="06"
          title={
            <>
              Questions agency founders{" "}
              <span className="serif-accent gradient-text">actually ask.</span>
            </>
          }
        />
        <LeakproofCTA />
      </main>
      <Footer />
    </>
  );
}
