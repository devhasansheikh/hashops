/**
 * Circular ↗ chip whose arrow swaps out/in diagonally on hover (styles in
 * globals.css). Standalone module so both site CTAs and the booking flow can
 * use it without import cycles.
 */

function DiagArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 9.5L9.5 2.5M4 2.5h5.5V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowOrb({ className = "" }: { className?: string }) {
  return (
    <span className={`arrow-orb ${className}`} aria-hidden>
      <DiagArrow />
      <DiagArrow />
    </span>
  );
}
