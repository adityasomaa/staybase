"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, PlayCircle, RotateCcw } from "lucide-react";

import { recordWalkthroughProgress, resetTour } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { walkStepHref, walkthroughLength } from "@/lib/help/walkthrough";

/**
 * Start or resume guided setup.
 *
 * Replaying starts at step one and clears the recorded progress, because a
 * replay that resumed at the end would not be a replay.
 */
export function ReplayTourButton({ completed = 0 }: { completed?: number }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const inProgress = completed > 0 && completed < walkthroughLength;

  const run = async (fromStart: boolean) => {
    setPending(true);
    if (fromStart) {
      await resetTour();
      await recordWalkthroughProgress(0);
      router.push(walkStepHref(0));
    } else {
      router.push(walkStepHref(completed));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {inProgress ? (
        <Button size="sm" className="gap-1.5" disabled={pending} onClick={() => void run(false)}>
          {pending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <PlayCircle className="size-3.5" />
          )}
          Resume setup · step {completed + 1}
        </Button>
      ) : null}
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        disabled={pending}
        onClick={() => void run(true)}
      >
        {pending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : inProgress ? (
          <RotateCcw className="size-3.5" />
        ) : (
          <PlayCircle className="size-3.5" />
        )}
        {inProgress ? "Start over" : completed >= walkthroughLength ? "Replay setup" : "Start setup"}
      </Button>
    </div>
  );
}
