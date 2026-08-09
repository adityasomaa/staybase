import { cn } from "@/lib/utils";

/**
 * The STAYBASE mark.
 *
 * Rebuilt as vector rather than shipping the source render: it has to survive
 * a 16px favicon and a collapsed sidebar rail, sit on both a light and a dark
 * canvas, and take the accent colour from the theme instead of baking one in.
 *
 * Three elements, in the order they survive shrinking: the hexagon shell, the
 * ribbon that reads as the S, and the roof and window that make it a building
 * rather than a badge. The shell and the building use `currentColor`; the
 * ribbon takes the accent, so a single-colour context still renders correctly.
 */
export function StaybaseMark({
  className,
  monochrome = false,
}: {
  className?: string;
  /** Draw the ribbon in currentColor too — for favicons and print. */
  monochrome?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("size-8", className)}
    >
      <path
        d="M16 2.9 27 9.3v13.4L16 29.1 5 22.7V9.3z"
        stroke="currentColor"
        strokeWidth={2.1}
        strokeLinejoin="round"
      />
      <path
        d="M11.6 13.6 16 9.9l4.4 3.7"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="14.2" y="12.6" width="1.5" height="1.5" rx="0.35" fill="currentColor" />
      <rect x="16.3" y="12.6" width="1.5" height="1.5" rx="0.35" fill="currentColor" />
      <rect x="14.2" y="14.7" width="1.5" height="1.5" rx="0.35" fill="currentColor" />
      <rect x="16.3" y="14.7" width="1.5" height="1.5" rx="0.35" fill="currentColor" />
      <path
        d="M21.4 18.6c-1.7-1.3-8-1.3-9.3.4-1 1.3.6 2.4 3.9 2.6 3.3.2 5.2 1.3 4.2 2.7-1.3 1.7-7.1 1.8-9 .5"
        stroke={monochrome ? "currentColor" : "var(--color-primary)"}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Mark plus wordmark.
 *
 * The wordmark is live text rather than outlines, so it inherits Manrope and
 * stays legible at any size — and "Base" carries the accent, which is the one
 * thing the source render does that a single-colour logotype cannot.
 */
export function StaybaseLogo({
  className,
  showTagline = false,
  markClassName,
}: {
  className?: string;
  showTagline?: boolean;
  markClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <StaybaseMark className={cn("size-8 shrink-0", markClassName)} />
      <span className="grid leading-none">
        <span className="text-[1.05rem] font-extrabold tracking-tight">
          Stay<span className="text-primary">Base</span>
        </span>
        {showTagline ? (
          <span className="text-muted-foreground mt-1 text-[9px] font-medium tracking-[0.18em] uppercase">
            Property Management System
          </span>
        ) : null}
      </span>
    </span>
  );
}
