/**
 * Fixed field of huge, slow-drifting ember light blobs behind the page.
 * Gives the glass cards something real to refract and makes scrolling feel
 * atmospheric. Pure CSS animation (transform-only), styles in globals.css.
 */
export function AuroraField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <span className="aurora-blob aurora-a" />
      <span className="aurora-blob aurora-b" />
      <span className="aurora-blob aurora-c" />
    </div>
  );
}
