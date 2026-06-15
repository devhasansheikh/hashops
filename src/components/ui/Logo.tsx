"use client";

import { HashMark } from "./HashMark";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Hide the "HASH" wordmark (mark only). */
  markOnly?: boolean;
  wordmarkClassName?: string;
}

export function Logo({ className, markOnly, wordmarkClassName }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <HashMark className="h-7 w-7" />
      {!markOnly && (
        <span
          className={cn(
            "font-display text-[1.05rem] font-medium tracking-wordmark text-heading",
            wordmarkClassName,
          )}
        >
          HASH
        </span>
      )}
    </span>
  );
}
