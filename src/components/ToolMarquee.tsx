"use client";

import { useReducedMotion } from "framer-motion";
import { TOOLS } from "@/lib/constants";
import { TOOL_LOGO_MAP } from "./ToolLogos";
import { Reveal } from "./ui/Reveal";
import { cn } from "@/lib/utils";

function ToolItem({
  name,
  mono,
  ariaHidden,
}: {
  name: string;
  mono?: boolean;
  ariaHidden?: boolean;
}) {
  const Logo = TOOL_LOGO_MAP[name];
  return (
    <div
      aria-hidden={ariaHidden}
      className="group/item flex shrink-0 items-center gap-2.5 px-7 opacity-60 transition-opacity duration-300 hover:opacity-100"
    >
      <span className={cn("h-6 w-6", mono ? "text-heading" : "")}>
        {Logo ? <Logo className="h-6 w-6" /> : null}
      </span>
      <span className="whitespace-nowrap font-display text-[0.98rem] font-medium text-body-strong transition-colors group-hover/item:text-heading">
        {name}
      </span>
    </div>
  );
}

export function ToolMarquee() {
  const reduce = useReducedMotion();

  return (
    <section className="relative border-y border-line/60 py-12">
      <div className="mx-auto mb-8 max-w-content px-6 sm:px-8">
        <Reveal as="p" className="eyebrow flex items-center justify-center gap-2 text-center">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-flame" />
          The stack we build on
        </Reveal>
      </div>

      {reduce ? (
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-2 gap-y-4 px-6">
          {TOOLS.map((t) => (
            <ToolItem key={t.name} name={t.name} mono={t.mono} />
          ))}
        </div>
      ) : (
        <div className="group relative flex overflow-hidden mask-x">
          {/* One track holding two copies, translated -50% for a seamless loop */}
          <div className="marquee-track flex shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]">
            {[0, 1].map((dup) =>
              TOOLS.map((t) => (
                <ToolItem
                  key={`${dup}-${t.name}`}
                  name={t.name}
                  mono={t.mono}
                  ariaHidden={dup === 1}
                />
              )),
            )}
          </div>
        </div>
      )}
    </section>
  );
}
