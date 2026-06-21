"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

/**
 * Drop the real walkthrough in later:
 *  - self-hosted MP4 → set VIDEO_MP4 to "/walkthrough.mp4" (place file in /public)
 *  - YouTube/Loom/Vimeo → set VIDEO_EMBED to the embed URL
 * The placeholder renders only while both are empty.
 */
const VIDEO_MP4 = "";
const VIDEO_EMBED = "";

export function VideoBlock() {
  const hasVideo = Boolean(VIDEO_MP4 || VIDEO_EMBED);

  return (
    <section id="video" className="relative px-5 py-24 sm:px-8">
      <SectionHead
        index="01"
        eyebrow="See it in action"
        title="Watch how HASH works."
        lead="Ninety seconds on what we build, what it replaces, and when it pays for itself."
      />

      <Reveal delay={0.12} scale={0.95} blur className="mx-auto mt-12 max-w-[880px]">
        <div className="surface-card surface-card-lift overflow-hidden rounded-window border-strong">
          <div className="relative aspect-video">
            {VIDEO_MP4 ? (
              <video
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
                src={VIDEO_MP4}
              />
            ) : VIDEO_EMBED ? (
              <iframe
                src={VIDEO_EMBED}
                title="HASH 90-second walkthrough"
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                {/* quiet dot lattice */}
                <div
                  className="absolute inset-0 opacity-[0.5]"
                  style={{
                    backgroundImage:
                      "radial-gradient(var(--border-strong) 1px, transparent 1px)",
                    backgroundSize: "26px 26px",
                  }}
                  aria-hidden
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 70% 80% at 50% 50%, var(--flame-glow), transparent 75%)",
                  }}
                  aria-hidden
                />
                <span className="absolute left-5 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  HASH / Walkthrough
                </span>
                <button
                  aria-label="Walkthrough video coming soon"
                  className="group absolute left-1/2 top-1/2 h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 cursor-default"
                >
                  <span
                    className="play-ring absolute inset-0 rounded-full border-2 border-flame/50"
                    aria-hidden
                  />
                  <span
                    className="relative flex h-full w-full items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, #FF8838, #EE6E16 55%, #D85706)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.2), 0 18px 44px -12px rgba(216,87,6,0.55)",
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      aria-hidden
                      className="ml-1"
                    >
                      <path d="M5 3l13 8-13 8V3z" fill="currentColor" />
                    </svg>
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
        {!hasVideo && (
          <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            90-second walkthrough · video coming soon
          </p>
        )}
      </Reveal>
    </section>
  );
}
