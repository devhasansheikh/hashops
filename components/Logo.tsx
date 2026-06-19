/**
 * Official HASH brand assets, each cropped to its content via an SVG viewBox so
 * there's no canvas whitespace:
 *  - <Logo>   → the tilted 3-D hashtag mark only (/public/hash-logo.svg)
 *  - <Lockup> → the mark + "HASH" wordmark lockup (/public/hash-lockup.svg)
 * Both glyphs are Flame-orange, so they read on light and dark themes alike.
 */

/** The HASH mark on its own (optionally with a tracked wordmark). */
export function Logo({
  markSize = 32,
  wordmark = true,
  className = "",
}: {
  markSize?: number;
  wordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex select-none items-center gap-2.5 ${className}`}>
      {/* crop the square asset to the measured glyph bounds */}
      <svg
        width={Math.round(markSize * 1.04)}
        height={markSize}
        viewBox="85.25 80 215 215"
        role="img"
        aria-label={wordmark ? undefined : "HASH"}
        aria-hidden={wordmark ? true : undefined}
        focusable="false"
      >
        <image href="/hash-logo.svg" x="0" y="0" width="375" height="375" />
      </svg>
      {wordmark && (
        <span className="font-display text-[15px] font-bold tracking-[0.3em] text-heading">
          HASH
        </span>
      )}
    </span>
  );
}

/** The full HASH lockup (mark + wordmark), cropped to content. */
export function Lockup({
  height = 28,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  return (
    <svg
      width={Math.round(height * (288 / 162))}
      height={height}
      viewBox="17.5 102.5 288 162"
      role="img"
      aria-label="HASH"
      focusable="false"
      className={`select-none ${className}`}
    >
      <image href="/hash-lockup.svg" x="0" y="0" width="375" height="375" />
    </svg>
  );
}
