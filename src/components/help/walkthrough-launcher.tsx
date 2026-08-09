"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleHelp } from "lucide-react";

import { completeTour, recordWalkthroughProgress } from "@/app/actions";
import { StaybaseMark } from "@/components/brand/staybase-logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { walkStepHref, walkthrough, walkthroughLength } from "@/lib/help/walkthrough";

/**
 * First run.
 *
 * Deliberately short: the useful part is the walkthrough itself, which takes
 * the operator to each control in turn, so this only exists to say what is
 * about to happen and to let someone decline it.
 */
export function WalkthroughLauncher({ resumeFrom = 0 }: { resumeFrom?: number }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(true);
  const [pending, setPending] = React.useState(false);

  const resuming = resumeFrom > 0 && resumeFrom < walkthroughLength;
  const startIndex = resuming ? resumeFrom : 0;

  const start = async () => {
    setPending(true);
    setOpen(false);
    // Mark the launcher as seen before navigating, or it reappears on the
    // first step. router.refresh() so the layout stops rendering it.
    await recordWalkthroughProgress(resumeFrom);
    router.push(walkStepHref(startIndex));
    router.refresh();
  };

  const decline = async () => {
    setOpen(false);
    await completeTour();
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : void decline())}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <StaybaseMark className="mb-1 size-10" />
          <DialogTitle className="text-xl text-balance">
            {resuming ? "Pick up where you left off" : `Set STAYBASE up in ${walkthroughLength} steps`}
          </DialogTitle>
          <DialogDescription className="text-pretty">
            Each step takes you to the screen it is about and points at the control, in the
            order the pieces depend on each other. You can leave at any point and resume from
            Help &amp; Tutorials.
          </DialogDescription>
        </DialogHeader>

        <ol className="grid gap-1.5 text-sm sm:grid-cols-2">
          {walkthrough.map((step, index) => (
            <li key={step.target} className="text-muted-foreground flex items-center gap-2">
              <span className="bg-muted tabular flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold">
                {index + 1}
              </span>
              <span className="truncate">{step.label}</span>
            </li>
          ))}
        </ol>

        <DialogFooter className="items-center sm:justify-between">
          <Button variant="ghost" size="sm" onClick={() => void decline()}>
            Not now
          </Button>
          <Button size="sm" className="gap-1.5" disabled={pending} onClick={() => void start()}>
            {resuming ? `Resume at step ${startIndex + 1}` : "Start setup"}
            <ArrowRight className="size-3.5" />
          </Button>
        </DialogFooter>

        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <CircleHelp className="size-3" />
          Everything here is also written up in Help &amp; Tutorials.
        </p>
      </DialogContent>
    </Dialog>
  );
}
