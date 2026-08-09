import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The supplied artwork, cropped — not redrawn.
 *
 * Two things about the source file drive everything here. Its background is
 * transparent, so the crops composite onto any surface. And "Stay" is painted
 * in near-black navy, rgb(0 10 36): 18.6:1 against the light canvas but 1.13:1
 * against the dark one, where it simply disappears. The same is true of the
 * mark's shadow facets.
 *
 * So the artwork always sits on a white plate. That keeps it exactly as drawn
 * instead of filtering or recolouring it to survive dark mode, and on the light
 * canvas the plate is near-invisible anyway.
 */

/** Just the mark, for tight spots — a sidebar rail, a dialog header. */
export function StaybaseMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md bg-white p-0.5",
        className,
      )}
    >
      {/* Unoptimized: the file is already shipped at the only size it renders
          at, so the optimizer would fetch a 1080px variant of a 32px logo. */}
      <Image
        src="/brand/staybase-mark.png"
        alt=""
        width={128}
        height={128}
        unoptimized
        className="size-full object-contain"
      />
    </span>
  );
}

/**
 * Mark, wordmark and tagline, as one image.
 *
 * For the full-screen moments — the 404 and the billing lock screen — where
 * the logo is the only thing identifying the product.
 */
export function StaybaseLockup({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex rounded-xl bg-white px-4 py-3", className)}>
      <Image
        src="/brand/staybase-lockup.png"
        alt="STAYBASE — Property Management System"
        width={560}
        height={192}
        unoptimized
        priority
        className="h-12 w-auto"
      />
    </span>
  );
}
