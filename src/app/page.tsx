import { BackgroundMount } from "@/components/three/BackgroundMount";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ToolMarquee } from "@/components/ToolMarquee";
import { VideoBlock } from "@/components/VideoBlock";
import { LeakList } from "@/components/LeakList";
import { OpsWorkspace } from "@/components/OpsWorkspace";
import { OpsAuditQuiz } from "@/components/OpsAuditQuiz";
import { Timeline } from "@/components/Timeline";
import { ProofStats } from "@/components/ProofStats";
import { CostBlock } from "@/components/CostBlock";
import { Pricing } from "@/components/Pricing";
import { Testimonial } from "@/components/Testimonial";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { MobileCTABar } from "@/components/MobileCTABar";
import { SITE } from "@/lib/constants";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HASH",
  url: SITE.url,
  email: SITE.email,
  slogan: SITE.tagline,
  description: SITE.positioning,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Karachi",
    addressCountry: "PK",
  },
  areaServed: ["US", "GB", "AU"],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BackgroundMount />
      <Nav />
      <main id="main">
        <Hero />
        <ToolMarquee />
        <VideoBlock />
        <LeakList />
        <OpsWorkspace />
        <OpsAuditQuiz />
        <Timeline />
        <ProofStats />
        <CostBlock />
        <Pricing />
        <Testimonial />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCTABar />
    </>
  );
}
