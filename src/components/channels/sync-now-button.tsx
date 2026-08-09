"use client";

import * as React from "react";
import { Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { syncChannelsNow } from "@/lib/sync/auto-sync";

/**
 * A full 30-day reconciliation push.
 *
 * Changes already push themselves, so this is for the cases automation cannot
 * see: a channel that rejected an earlier batch, or an edit made in an OTA
 * extranet that left the two sides disagreeing.
 */
export function SyncNowButton() {
  const [pending, setPending] = React.useState(false);

  const run = async () => {
    setPending(true);
    try {
      await syncChannelsNow("manual reconciliation", { days: 30 });
    } finally {
      setPending(false);
    }
  };

  return (
    <Button size="sm" onClick={run} disabled={pending} className="gap-1.5">
      {pending ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
      Sync 30 days
    </Button>
  );
}
