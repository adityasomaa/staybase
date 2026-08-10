"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, ChevronDown } from "lucide-react";
import type { Matcher } from "react-day-picker";

import { monthLabel } from "@/lib/date";
import { toLocalDate, fromLocalDate } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * The window start, picked on a calendar.
 *
 * Rates and availability exist five years either side of today, but the server
 * only sends the window being looked at. So a pick inside the loaded window
 * just moves the local offset, and a pick outside it reloads the page around
 * that date — the URL carries the window, which also makes it linkable.
 */
export function WindowJump({
  start,
  dates,
  maxIndex,
  rangeFrom,
  rangeTo,
  onLocalJump,
  className,
}: {
  start: string;
  /** Dates the server sent for this window. */
  dates: string[];
  /** Furthest index that still fills the visible columns. */
  maxIndex: number;
  rangeFrom: string;
  rangeTo: string;
  onLocalJump: (index: number) => void;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = React.useState(false);

  const bounds: Matcher[] = [];
  const min = toLocalDate(rangeFrom);
  const max = toLocalDate(rangeTo);
  if (min) bounds.push({ before: min });
  if (max) bounds.push({ after: max });

  const jump = (iso: string) => {
    setOpen(false);
    const index = dates.indexOf(iso);
    if (index >= 0 && index <= maxIndex) {
      onLocalJump(index);
      return;
    }
    const next = new URLSearchParams(params.toString());
    next.set("start", iso);
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`tabular h-8 gap-1.5 rounded-none border-x px-2 text-sm font-medium ${className ?? "w-44"}`}
        >
          <CalendarDays className="size-3.5 shrink-0 opacity-70" />
          <span className="truncate">{monthLabel(start)}</span>
          <ChevronDown className="ml-auto size-3.5 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={6} className="w-auto p-0">
        <Calendar
          mode="single"
          selected={toLocalDate(start)}
          defaultMonth={toLocalDate(start)}
          captionLayout="dropdown"
          autoFocus
          disabled={bounds.length > 0 ? bounds : undefined}
          onSelect={(date) => date && jump(fromLocalDate(date))}
        />
      </PopoverContent>
    </Popover>
  );
}
