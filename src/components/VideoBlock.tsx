"use client";

import { useState } from "react";
import { Section, SectionHeader } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { Play } from "./ui/icons";

/** Drop a real walkthrough in via NEXT_PUBLIC_WALKTHROUGH_URL (mp4) — see README. */
const VIDEO_URL = process.env.NEXT_PUBLIC_WALKTHROUGH_URL || "";

export function VideoBlock() {
  const [playing, setPlaying] = useState(false);

  return (
    <Section id="walkthrough">
      <SectionHeader
        eyebrow="See it in action"
        heading="Watch how HASH works."
        lead="A short walkthrough of the audit, the build, and the system you run it all on."
      />

      <Reveal delay={0.1} className="mx-auto mt-12 max-w-4xl">
        <div className="group relative aspect-video w-full overflow-hidden rounded-card border border-line bg-surface-2 shadow-lift">
          {/* Faux player chrome */}
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center gap-1.5 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-error/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          </div>

          {VIDEO_URL && playing ? (
            <video
              className="h-full w-full object-cover"
              src={VIDEO_URL}
              controls
              autoPlay
              playsInline
            />
          ) : (
            <>
              {/* Backdrop grid + glow */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, var(--border-strong) 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, var(--flame-glow), transparent 70%)",
                }}
              />

              {/* Play button + pulsing ring */}
              <button
                onClick={() => VIDEO_URL && setPlaying(true)}
                aria-label="Play walkthrough"
                className="absolute inset-0 z-10 grid place-items-center"
              >
                <span className="relative grid h-20 w-20 place-items-center">
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-flame/30" />
                  <span className="relative grid h-[68px] w-[68px] place-items-center rounded-full bg-[linear-gradient(150deg,#FF8838,#D85706)] text-white shadow-[0_10px_30px_-8px_rgba(216,87,6,0.7)] transition-transform duration-300 group-hover:scale-105">
                    <Play className="ml-1 h-7 w-7" />
                  </span>
                </span>
              </button>

              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center pb-5">
                <span className="rounded-pill border border-line bg-bg/70 px-4 py-1.5 font-mono text-[0.72rem] uppercase tracking-eyebrow text-muted backdrop-blur">
                  90-second walkthrough · video coming soon
                </span>
              </div>
            </>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
