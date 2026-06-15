import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  /** Reduce horizontal padding (used by the wide workspace section). */
  wide?: boolean;
}

export function Section({ id, className, children, wide }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-[clamp(56px,8vw,104px)]",
        wide ? "px-4 sm:px-6" : "px-6 sm:px-8",
        className,
      )}
    >
      <div className={cn("mx-auto w-full", wide ? "max-w-window" : "max-w-content")}>
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow: string;
  heading?: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  heading,
  lead,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <Reveal as="p" className="eyebrow flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-flame" />
        {eyebrow}
      </Reveal>
      {heading && (
        <Reveal
          as="h2"
          delay={0.05}
          className="text-balance font-display text-[clamp(1.9rem,4.2vw,3.05rem)] font-semibold leading-[1.06] tracking-tightest text-heading"
        >
          {heading}
        </Reveal>
      )}
      {lead && (
        <Reveal
          as="p"
          delay={0.1}
          className={cn(
            "text-pretty text-[1.05rem] leading-relaxed text-body",
            align === "center" ? "max-w-xl" : "max-w-2xl",
          )}
        >
          {lead}
        </Reveal>
      )}
    </div>
  );
}
