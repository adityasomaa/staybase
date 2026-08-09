"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Check, Target } from "lucide-react";
import { toast } from "sonner";

import { recordWalkthroughProgress } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { getTourTarget } from "@/lib/help/targets";
import { walkStepHref, walkStepIndex, walkthrough, walkthroughLength } from "@/lib/help/walkthrough";

/** How long to keep looking for the element, and how often to look. */
const HUNT_MS = 4000;
const HUNT_INTERVAL_MS = 100;

/**
 * The half of a tutorial that happens inside the app.
 *
 * A step links to `?focus=<target id>`; this finds the element carrying
 * `data-tour="<target id>"`, scrolls to it, marks it so the stylesheet can
 * ring it, and says what the reader is looking at. With `?walk=<n>` it also
 * drives guided setup: the same ring, plus the step's own instructions and the
 * controls to move through the sequence.
 *
 * There is no state here on purpose — the URL is the state. Leaving means
 * dropping the query parameters, which unmounts the card and, through the
 * effect cleanup, removes the ring.
 */
export function TutorialSpotlight() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const focus = params.get("focus");
  const from = params.get("from");
  const stepIndex = walkStepIndex(params.get("walk"));
  const step = stepIndex === null ? null : walkthrough[stepIndex];
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

  /**
   * Leave, keeping `tab`: the reader is looking at that panel now, and
   * resetting it out from under them would undo the step they just followed.
   */
  const leave = () => {
    const next = new URLSearchParams(params.toString());
    next.delete("focus");
    next.delete("from");
    next.delete("walk");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  if (step && stepIndex !== null) {
    const isLast = stepIndex === walkthroughLength - 1;

    const advance = async () => {
      // Progress only moves forward, so recording on the way out of a step is
      // enough — going back to re-read something must not undo it.
      await recordWalkthroughProgress(stepIndex + 1);
      if (isLast) {
        toast.success("Setup complete", {
          description: "Replay it any time from Help & Tutorials.",
        });
        router.push("/dashboard");
        return;
      }
      router.push(walkStepHref(stepIndex + 1));
    };

    return (
      <Dock>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Setup · step {stepIndex + 1} of {walkthroughLength}
            </p>
            <p className="text-muted-foreground tabular text-xs">
              {walkthrough[stepIndex].label}
            </p>
          </div>
          <div
            className="bg-muted h-1 overflow-hidden rounded-full"
            role="progressbar"
            aria-valuenow={stepIndex + 1}
            aria-valuemin={1}
            aria-valuemax={walkthroughLength}
          >
            <div
              className="bg-primary h-full rounded-full transition-[width]"
              style={{ width: `${((stepIndex + 1) / walkthroughLength) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="font-semibold tracking-tight text-balance">{step.title}</p>
          <p className="text-sm text-pretty">{step.body}</p>
          <p className="text-muted-foreground text-xs text-pretty">{target.hint}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={leave}>
            Exit setup
          </Button>
          {step.article ? (
            <Button variant="ghost" size="sm" className="gap-1.5" asChild>
              <Link href={`/help/${step.article}`}>
                <BookOpen className="size-3.5" />
                Read more
              </Link>
            </Button>
          ) : null}
          <div className="ml-auto flex items-center gap-2">
            {stepIndex > 0 ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => router.push(walkStepHref(stepIndex - 1))}
              >
                <ArrowLeft className="size-3.5" />
                Back
              </Button>
            ) : null}
            <Button size="sm" className="gap-1.5" onClick={() => void advance()}>
              {isLast ? "Finish setup" : "Next"}
              {isLast ? <Check className="size-3.5" /> : <ArrowRight className="size-3.5" />}
            </Button>
          </div>
        </div>
      </Dock>
    );
  }

  return (
    <Dock>
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
        <Button size="sm" className="gap-1.5" onClick={leave}>
          <Check className="size-3.5" />
          Got it
        </Button>
      </div>
    </Dock>
  );
}

/** The floating panel both modes sit in. */
function Dock({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4">
      <div
        role="status"
        className="bg-popover text-popover-foreground pointer-events-auto ring-primary/30 flex w-full max-w-lg flex-col gap-3 rounded-xl border p-4 shadow-lg ring-4"
      >
        {children}
      </div>
    </div>
  );
}
