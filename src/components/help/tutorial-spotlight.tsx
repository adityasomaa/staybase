"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getTourTarget } from "@/lib/help/targets";

/** How long to keep looking for the element, and how often to look. */
const HUNT_MS = 4000;
const HUNT_INTERVAL_MS = 100;

/**
 * The other half of a tutorial step.
 *
 * A step links to `?focus=<target id>`; this component finds the element that
 * carries `data-tour="<target id>"`, scrolls it into view, marks it so the
 * stylesheet can put a ring around it, and explains what the reader is looking
 * at. It renders nothing at all when there is no focus in the URL.
 *
 * There is no state here on purpose: the URL is the state. Dismissing means
 * dropping the query parameters, which unmounts the callout and — through the
 * effect cleanup — removes the ring.
 */
export function TutorialSpotlight() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const focus = params.get("focus");
  const from = params.get("from");
  const target = getTourTarget(focus);

  React.useEffect(() => {
    if (!focus) return;

    // The element may not exist yet: the tab it lives under has to render, and
    // client components below this one mount after their data resolves. Keep
    // looking for a few seconds rather than assuming one pass is enough.
    //
    // A timer rather than requestAnimationFrame — rAF does not fire while the
    // tab is in the background, and a step opened in one tab and read in
    // another would then never get its ring.
    let found: HTMLElement | null = null;
    let scrolled = false;
    let timer = 0;
    let waited = 0;

    const hunt = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${focus}"]`);
      if (el) {
        found = el;
        // Idempotent, and re-applied for the whole window rather than once:
        // a client component that hydrates after this runs rewrites its own
        // attributes, which drops the mark if we only ever set it a single
        // time. Scrolling stays a one-off — repeating it would fight the
        // reader for control of the viewport.
        if (el.dataset.spotlight !== "true") el.dataset.spotlight = "true";
        if (!scrolled) {
          scrolled = true;
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      waited += HUNT_INTERVAL_MS;
      if (waited < HUNT_MS) timer = window.setTimeout(hunt, HUNT_INTERVAL_MS);
    };

    hunt();

    return () => {
      window.clearTimeout(timer);
      if (found) delete found.dataset.spotlight;
    };
  }, [focus]);

  if (!target) return null;

  const dismiss = () => {
    // Keep `tab` — the reader is looking at that panel now, and resetting it
    // out from under them on dismiss would undo the step they just followed.
    const next = new URLSearchParams(params.toString());
    next.delete("focus");
    next.delete("from");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4">
      <div
        role="status"
        className="bg-popover text-popover-foreground pointer-events-auto ring-primary/30 flex w-full max-w-lg flex-col gap-3 rounded-xl border p-4 shadow-lg ring-4"
      >
        <div className="flex items-start gap-2.5">
          <span className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-md">
            <Target className="size-4" />
          </span>
          <div className="min-w-0 space-y-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Tutorial step
            </p>
            <p className="text-sm text-pretty">{target.hint}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {from ? (
            <Button variant="ghost" size="sm" className="gap-1.5 sm:mr-auto" asChild>
              <Link href={`/help/${from}`}>
                <ArrowLeft className="size-3.5" />
                Back to the guide
              </Link>
            </Button>
          ) : null}
          <Button size="sm" className="gap-1.5" onClick={dismiss}>
            <Check className="size-3.5" />
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
