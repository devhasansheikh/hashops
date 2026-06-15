import { cn } from "@/lib/utils";

export function AvailabilityPill({
  spots = 3,
  className,
}: {
  spots?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-pill border border-line bg-surface/70 py-1.5 pl-1.5 pr-4 backdrop-blur-md",
        className,
      )}
    >
      <span className="relative inline-flex items-center gap-1.5 rounded-pill bg-[linear-gradient(120deg,#E55A00,#FF7A1A)] px-3 py-1 text-[0.8rem] font-medium text-white shadow-[0_2px_8px_-2px_rgba(216,87,6,0.6)]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
        </span>
        {spots} spots
      </span>
      <span className="font-sans text-[0.85rem] font-medium text-body-strong">
        Available for new clients
      </span>
    </span>
  );
}
