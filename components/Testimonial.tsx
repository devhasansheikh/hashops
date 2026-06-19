import { Reveal } from "@/components/ui/Reveal";
import { Logo } from "@/components/Logo";

/**
 * Placeholder quote in HASH's voice — swap the text + attribution for a real
 * client quote (and later, video) once collected. See CHANGES.md.
 */
export function Testimonial() {
  return (
    <section className="relative px-5 py-24 sm:px-8">
      <Reveal blur className="mx-auto max-w-[760px]">
        <figure className="surface-card surface-card-lift relative rounded-card px-7 py-12 text-center sm:px-14">
          <span
            className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-xl border border-strong bg-surface"
            style={{ boxShadow: "0 10px 24px -12px rgba(216,87,6,0.45)" }}
            aria-hidden
          >
            <Logo wordmark={false} markSize={21} />
          </span>
          <blockquote className="font-display text-[clamp(1.2rem,2.6vw,1.5rem)] font-medium leading-relaxed text-heading">
            &ldquo;We went from &lsquo;where does this deal stand?&rsquo; to one
            screen that answers it. HASH found the leaks in week one, and the
            build paid for itself before the support window ended.&rdquo;
          </blockquote>
          <figcaption className="mt-6">
            <p className="font-display text-[14px] font-semibold text-heading">
              Founder, B2B services agency
            </p>
            <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
              US · 14-person team
            </p>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
