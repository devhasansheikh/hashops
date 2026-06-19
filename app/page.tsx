import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ToolMarquee } from "@/components/ToolMarquee";
import { VideoBlock } from "@/components/VideoBlock";
import { LeakList } from "@/components/LeakList";
import { OpsWorkspace } from "@/components/OpsWorkspace";
import { OpsAuditQuiz } from "@/components/OpsAuditQuiz";
import { ProcessSteps } from "@/components/ProcessSteps";
import { ProofStats } from "@/components/ProofStats";
import { CostBlock } from "@/components/CostBlock";
import { Pricing } from "@/components/Pricing";
import { Testimonial } from "@/components/Testimonial";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Backdrop } from "@/components/Backdrop";
import { ScrollProgress } from "@/components/ScrollProgress";

export default function Home() {
  return (
    <>
      <Backdrop />
      <ScrollProgress />
      <Nav />
      <main className="relative z-[1]">
        <Hero />
        <ToolMarquee />
        <VideoBlock />
        <LeakList />
        <OpsWorkspace />
        <OpsAuditQuiz />
        <ProcessSteps />
        <ProofStats />
        <CostBlock />
        <Pricing />
        <Testimonial />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
