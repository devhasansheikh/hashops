"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface HashMarkProps {
  className?: string;
  /** Render solid in a single colour instead of the Flame gradient. */
  solid?: string;
  /** Add a soft depth shadow (use for large/hero placements). */
  depth?: boolean;
  title?: string;
}

/**
 * The HASH mark: a hashtag built from four rounded bars, tilted ~16°
 * ("set in motion"), filled with a Flame gradient (bright top-left to deep
 * bottom-right). Reused everywhere a `#` is needed — never a typed glyph.
 */
export function HashMark({ className, solid, depth, title }: HashMarkProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `hash-grad-${uid}`;
  const shadowId = `hash-shadow-${uid}`;

  return (
    <svg
      viewBox="0 0 100 100"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn("block", className)}
      style={{ overflow: "visible" }}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={gradId} x1="12" y1="8" x2="90" y2="94" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFB36B" />
          <stop offset="0.42" stopColor="#FF7A1A" />
          <stop offset="1" stopColor="#D85706" />
        </linearGradient>
        {depth ? (
          <filter id={shadowId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        ) : null}
      </defs>
      <g
        transform="rotate(-16 50 50)"
        fill={solid || `url(#${gradId})`}
        filter={depth ? `url(#${shadowId})` : undefined}
      >
        <rect x="33" y="8" width="12.5" height="84" rx="6.25" />
        <rect x="54.5" y="8" width="12.5" height="84" rx="6.25" />
        <rect x="10" y="33" width="80" height="12.5" rx="6.25" />
        <rect x="10" y="54.5" width="80" height="12.5" rx="6.25" />
      </g>
    </svg>
  );
}
