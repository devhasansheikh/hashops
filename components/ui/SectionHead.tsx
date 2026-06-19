import { Reveal } from "@/components/ui/Reveal";

type SectionHeadProps = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  className?: string;
};

/** Centered eyebrow + heading + lead, shared by every section. */
export function SectionHead({
  index,
  eyebrow,
  title,
  lead,
  className = "",
}: SectionHeadProps) {
  return (
    <div className={`mx-auto max-w-2xl text-center ${className}`}>
      <Reveal blur>
        <p className="eyebrow flex items-center justify-center gap-2.5">
          <span className="gradient-text font-medium">{index}</span>
          <span className="h-px w-5 bg-[var(--border-strong)]" aria-hidden />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal blur delay={0.08} className="mt-4">
        <h2 className="font-display text-[clamp(1.85rem,4vw,2.7rem)] font-semibold leading-[1.12] tracking-[-0.015em] text-heading">
          {title}
        </h2>
      </Reveal>
      {lead ? (
        <Reveal blur delay={0.16} className="mx-auto mt-4 max-w-xl">
          <p className="text-[15.5px] leading-relaxed text-body">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
