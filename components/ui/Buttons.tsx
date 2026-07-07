"use client";

import { useCalendly } from "@/components/CalendlyModal";
import { ArrowOrb } from "@/components/ui/ArrowOrb";
import { BOOK_CTA } from "@/lib/site";

export { ArrowOrb };

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  // hero CTAs stay deliberately small so the headline dominates
  sm: "pl-4 pr-[5px] py-[5px] text-xs",
  md: "pl-5 pr-[7px] py-[7px] text-sm",
  lg: "pl-7 pr-2.5 py-2.5 text-[15px]",
};

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <path
        d="M1.5 7h11M8 2.5L12.5 7 8 11.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Primary CTA — opens the booking modal. */
export function BookCallButton({
  size = "md",
  label = BOOK_CTA,
  className = "",
}: {
  size?: Size;
  label?: string;
  className?: string;
}) {
  const { openCalendly } = useCalendly();
  return (
    <button
      onClick={openCalendly}
      className={`btn-primary ${SIZES[size]} ${className}`}
    >
      {label}
      <ArrowOrb className={size === "lg" ? "!h-8 !w-8" : size === "md" ? "!h-7 !w-7" : ""} />
    </button>
  );
}

const SIZES_EVEN: Record<Size, string> = {
  sm: "px-4 py-[9px] text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-[15px]",
};

export function SecondaryButton({
  size = "md",
  children,
  onClick,
  className = "",
}: {
  size?: Size;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button onClick={onClick} className={`btn-secondary ${SIZES_EVEN[size]} ${className}`}>
      {children}
    </button>
  );
}
