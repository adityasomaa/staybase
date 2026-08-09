import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The supplied artwork — not redrawn.
 *
 * The mark is the squared white-background file, used as delivered. The lockup
 * is a crop of the original render, and it needs a plate of its own: "Stay" is
 * painted near-black navy, rgb(0 10 36), which is 18.6:1 against the light
 * canvas but 1.13:1 against the dark one, where it simply disappears.
 *
 * Both therefore end up on white. That leaves the artwork exactly as drawn
 * rather than filtering or recolouring it to survive dark mode, and on the
 * light canvas the plate is near-invisible anyway.
 */

/**
 * Just the mark, for tight spots — a sidebar rail, a dialog header.
 *
 * This is the squared white-background file, so it brings its own plate; all
 * this has to do is round the corners off it.
 */
export function StaybaseMark({ className }: { className?: string }) {
  return (
    <span className={cn("block size-8 shrink-0 overflow-hidden rounded-md", className)}>
      {/* Unoptimized: the file is already shipped at the only size it renders
          at, so the optimizer would fetch a 1080px variant of a 32px logo. */}
      <Image
        src="/brand/staybase-mark.png"
        alt=""
        width={128}
        height={128}
        unoptimized
        className="size-full object-cover"
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
