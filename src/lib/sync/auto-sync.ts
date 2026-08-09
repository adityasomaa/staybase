"use client";

import { toast } from "sonner";

/**
 * Outbound sync, triggered by the change itself.
 *
 * A manual push fails silently: the operator makes a change, closes the tab,
 * and the channel keeps selling yesterday's rate until someone notices. So
 * every change an OTA needs to know about — a rate edit, a block, a new room
 * type, an applied pricing suggestion, a direct booking — pushes itself.
 *
 * Changes coalesce rather than pushing one per keystroke. Editing a week of
 * rates is a single push shortly after the last edit: a half-finished batch is
 * how rate parity incidents start, and one call per cell is how you get rate
 * limited. That quiet period is the only thing the operator gives up compared
 * with pressing the button themselves.
 */

/** How long the queue waits for further changes before pushing. */
const QUIET_MS = 1200;

/** One id for every sync toast, so repeated pushes replace rather than stack. */
const TOAST_ID = "channex-sync";

export interface SyncRange {
  from?: string;
  days?: number;
}

export interface SyncOutcome {
  /** True only when Channex actually accepted the batch. */
  sent: boolean;
  mode: "live" | "dry-run" | "failed" | "queued";
}

interface SyncResponse {
  ok: boolean;
  mode?: string;
  reason?: string;
  error?: string;
  plan?: {
    availabilityValues: number;
    restrictionValues: number;
    unmappedRoomTypes?: string[];
    unmappedRatePlans?: string[];
  };
}

let timer: number | null = null;
let reasons = new Set<string>();
let range: SyncRange = {};
let running = false;
let runAgain = false;

/**
 * Record a change and push it once the dust settles. Safe to call on every
 * keystroke — the last call within the quiet period wins.
 */
export function queueChannelSync(reason: string, next: SyncRange = {}): void {
  reasons.add(reason);
  range = { ...range, ...next };
  if (timer !== null) window.clearTimeout(timer);
  timer = window.setTimeout(() => void flush(), QUIET_MS);
}

/** Push immediately, skipping the quiet period. Used by the manual controls. */
export function syncChannelsNow(reason: string, next: SyncRange = {}): Promise<SyncOutcome> {
  reasons.add(reason);
  range = { ...range, ...next };
  if (timer !== null) {
    window.clearTimeout(timer);
    timer = null;
  }
  return flush();
}

async function flush(): Promise<SyncOutcome> {
  timer = null;

  // A push already in flight is not interrupted — the changes that arrived
  // during it go out in a follow-up rather than racing the first batch.
  if (running) {
    runAgain = true;
    return { sent: false, mode: "queued" };
  }

  running = true;
  const batch = [...reasons];
  const batchRange = range;
  reasons = new Set();
  range = {};

  const because = batch.length === 1 ? batch[0] : `${batch.length} changes`;
  const retry = {
    label: "Retry",
    onClick: () => void syncChannelsNow(because, batchRange),
  };

  toast.loading("Pushing to channels…", { id: TOAST_ID, description: because });

  try {
    const response = await fetch("/api/channex/sync", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ scope: "ari", days: 30, ...batchRange }),
    });
    const result = (await response.json()) as SyncResponse;

    if (!result.ok) {
      toast.error("Channels did not accept the push", {
        id: TOAST_ID,
        description: result.error ?? "The sync endpoint returned an error.",
        action: retry,
      });
      return { sent: false, mode: "failed" };
    }

    const counts = `${result.plan?.availabilityValues ?? 0} availability + ${
      result.plan?.restrictionValues ?? 0
    } rate values`;
    const skipped = [
      ...(result.plan?.unmappedRoomTypes ?? []),
      ...(result.plan?.unmappedRatePlans ?? []),
    ];

    if (result.mode === "dry-run") {
      toast.warning("Dry run — nothing left STAYBASE", {
        id: TOAST_ID,
        description: `${result.reason ?? "Channex is not configured"}. Prepared ${counts}.`,
      });
      return { sent: false, mode: "dry-run" };
    }

    toast.success("Channels updated", {
      id: TOAST_ID,
      description: `${because} · ${counts} accepted${
        skipped.length ? ` · skipped ${skipped.join(", ")}` : ""
      }.`,
    });
    return { sent: true, mode: "live" };
  } catch (error) {
    toast.error("Sync failed", {
      id: TOAST_ID,
      description: error instanceof Error ? error.message : "Unknown error",
      action: retry,
    });
    return { sent: false, mode: "failed" };
  } finally {
    running = false;
    if (runAgain) {
      runAgain = false;
      queueChannelSync("changes made during the last push");
    }
  }
}
