"use client";

import * as React from "react";

import { BILLING_CURRENCY, PRICE_PER_ALLOTMENT, monthlyTotal } from "@/lib/billing/pricing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * The allotment field and what it will cost, together.
 *
 * They share one piece of state on purpose: a price quoted from a second copy
 * of the number is a price that can disagree with the one being submitted.
 */
export function AllotmentPricing() {
  const [allotments, setAllotments] = React.useState(1);

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="allotments">Allotments</Label>
        <Input
          id="allotments"
          name="allotments"
          type="number"
          min={0}
          value={allotments}
          onChange={(event) =>
            setAllotments(Math.max(0, Math.round(Number(event.target.value) || 0)))
          }
          className="tabular"
        />
        <p className="text-muted-foreground text-xs text-pretty">
          A sellable unit, not a bedroom. A three-bedroom villa that can only be booked
          whole is <span className="font-medium">1</span>; twelve Deluxe rooms sold
          individually are <span className="font-medium">12</span>. It is the same number a
          channel receives as availability.
        </p>
      </div>

      <div className="bg-muted/50 flex items-baseline justify-between rounded-lg border p-3">
        <span className="text-sm">
          Added to your bill
          <span className="text-muted-foreground tabular ml-1.5 text-xs">
            {allotments} × {BILLING_CURRENCY} {PRICE_PER_ALLOTMENT}
          </span>
        </span>
        <span className="tabular text-sm font-semibold">
          {BILLING_CURRENCY} {monthlyTotal(allotments)}.00 / month
        </span>
      </div>
    </div>
  );
}
