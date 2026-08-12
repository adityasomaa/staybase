"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, ListChecks } from "lucide-react";

import {
  onboardingHref,
  onboardingProgress,
  onboardingSteps,
  type OnboardingSnapshot,
} from "@/lib/help/onboarding";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Setup progress, opened from the header.
 *
 * Every step reports itself from the workspace rather than from a stored
 * position, so it is correct on a fresh browser, after a reset, and for
 * someone who did half the setup last week.
 */
export function OnboardingPanel({ snapshot }: { snapshot: OnboardingSnapshot }) {
  const [open, setOpen] = React.useState(false);
  const { done, total, complete } = onboardingProgress(snapshot);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 px-2"
          aria-label="Setup steps"
        >
          <ListChecks className="size-4 shrink-0 opacity-70" />
          <span className="hidden sm:inline">Setup</span>
          <Badge
            variant={complete ? "secondary" : "default"}
            className="tabular h-5 min-w-9 justify-center px-1 text-[11px]"
          >
            {done}/{total}
          </Badge>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Setting up STAYBASE</SheetTitle>
          <SheetDescription className="text-pretty">
            {complete
              ? "Everything is in place. This list stays here in case you add another property."
              : "Each step ticks itself once the workspace contains the thing it describes — nothing here is a checkbox you mark by hand."}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-1 px-4">
          <div className="flex items-center gap-3">
            <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-[width]"
                style={{ width: `${(done / total) * 100}%` }}
              />
            </div>
            <span className="text-muted-foreground tabular shrink-0 text-xs">
              {done} of {total}
            </span>
          </div>
        </div>

        <ol className="space-y-2 p-4">
          {onboardingSteps.map((step, index) => {
            const stepDone = step.done(snapshot);
            return (
              <li
                key={step.id}
                className={cn(
                  "rounded-lg border p-3 transition-colors",
                  stepDone ? "bg-muted/40" : "bg-card",
                )}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={cn(
                      "tabular mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                      stepDone ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    {stepDone ? <Check className="size-3" /> : index + 1}
                  </span>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        stepDone && "text-muted-foreground line-through decoration-1",
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-muted-foreground text-xs text-pretty">{step.body}</p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <Button
                        variant={stepDone ? "ghost" : "outline"}
                        size="sm"
                        className="h-7 gap-1.5 px-2 text-xs"
                        asChild
                        onClick={() => setOpen(false)}
                      >
                        <Link href={onboardingHref(step)}>
                          {stepDone ? "Review" : "Set up"}
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                      {step.article ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1.5 px-2 text-xs"
                          asChild
                          onClick={() => setOpen(false)}
                        >
                          <Link href={`/help/${step.article}`}>
                            <BookOpen className="size-3.5" />
                            Read more
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </SheetContent>
    </Sheet>
  );
}
