"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import type { Matcher } from "react-day-picker";

import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * The domain is UTC-anchored ISO dates; the picker works in local `Date`s.
 *
 * Converting through UTC midnight would land on the previous day for anyone
 * west of Greenwich, so the bridge is deliberately naive: read and write the
 * calendar fields, never the instant.
 */
export const toLocalDate = (iso: string): Date | undefined => {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  return Number.isFinite(y) ? new Date(y, m - 1, d) : undefined;
};

export const fromLocalDate = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/**
 * A date field that opens a styled calendar instead of the browser's own.
 *
 * `<input type="date">` renders a different control in every browser, ignores
 * the app's type and colour, and on desktop Firefox and Safari is close to
 * unusable. This is the same Popover and Calendar the rest of the app uses.
 */
export function DatePicker({
  value,
  onChange,
  id,
  min,
  max,
  placeholder = "Pick a date",
  className,
  align = "start",
}: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  /** Inclusive ISO bounds. */
  min?: string;
  max?: string;
  placeholder?: string;
  className?: string;
  align?: "start" | "center" | "end";
}) {
  const [open, setOpen] = React.useState(false);
  const selected = toLocalDate(value);

  // Built as a list because a matcher with an undefined bound is not a valid
  // matcher — `{ before: undefined }` disables nothing and fails the types.
  const bounds: Matcher[] = [];
  const before = min ? toLocalDate(min) : undefined;
  const after = max ? toLocalDate(max) : undefined;
  if (before) bounds.push({ before });
  if (after) bounds.push({ after });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn(
            "h-9 w-full justify-start gap-2 px-3 font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarDays className="size-4 shrink-0 opacity-70" />
          <span className="truncate">{value ? formatDate(value) : placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} sideOffset={6} className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          autoFocus
          disabled={bounds.length > 0 ? bounds : undefined}
          onSelect={(date) => {
            if (!date) return;
            onChange(fromLocalDate(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
