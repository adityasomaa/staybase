import type { Metadata } from "next";
import { CircleAlert, CircleCheck, Layers } from "lucide-react";

import { RateCalendar } from "@/components/calendar/rate-calendar";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { isChannexConfigured } from "@/lib/channex/client";
import { addDays } from "@/lib/date";
import { formatMoney, formatPercent } from "@/lib/format";
import { ARI_FROM, ARI_TO, TODAY, getAriGrid, ratePlans, roomTypes } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Rates & Availability" };

/** Load a 60 day window, render 14 columns at a time. */
const WINDOW_DAYS = 60;
const VISIBLE_DAYS = 14;

export default async function CalendarPage(props: {
  searchParams: Promise<{ start?: string }>;
}) {
  const searchParams = await props.searchParams;
  const requested = searchParams.start ?? addDays(TODAY, -1);
  // Clamped so a hand-edited URL cannot ask for a window outside the range.
  const from = requested < ARI_FROM ? ARI_FROM : requested > ARI_TO ? ARI_TO : requested;
  const { dates, rows } = getAriGrid(from, WINDOW_DAYS);

  const allCells = rows.flatMap((row) => row.plans.flatMap((plan) => plan.cells));
  const avgRate = Math.round(
    allCells.reduce((sum, cell) => sum + cell.rate, 0) / Math.max(1, allCells.length),
  );
  const totalAllotment = rows.reduce(
    (sum, row) => sum + row.availability.reduce((s, a) => s + a.allotment, 0),
    0,
  );
  const totalFree = rows.reduce(
    (sum, row) => sum + row.availability.reduce((s, a) => s + a.free, 0),
    0,
  );
  const unmapped =
    roomTypes.filter((rt) => !rt.channexId).length + ratePlans.filter((rp) => !rp.channexId).length;

  return (
    <>
      <PageHeader
        title="Rates & Availability"
        description="One grid for rates, inventory and restrictions. Changes push themselves to every mapped channel through Channex, collected into a single batch a moment after you stop editing."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Average rate"
          value={formatMoney(avgRate)}
          hint={`${WINDOW_DAYS} day window`}
          icon={Layers}
        />
        <StatCard
          label="Rooms open"
          value={String(totalFree)}
          hint={`of ${totalAllotment} room-nights`}
          icon={CircleCheck}
        />
        <StatCard
          label="Window occupancy"
          value={formatPercent(((totalAllotment - totalFree) / Math.max(1, totalAllotment)) * 100)}
          hint="sold across the window"
          icon={Layers}
        />
        <StatCard
          label="Unmapped entities"
          value={String(unmapped)}
          hint={unmapped ? "will be skipped on push" : "everything is mapped"}
          icon={CircleAlert}
        />
      </div>

      <RateCalendar
        initialFrom={from}
        days={VISIBLE_DAYS}
        rangeFrom={ARI_FROM}
        rangeTo={ARI_TO}
        dates={dates}
        rows={rows}
        channexConfigured={isChannexConfigured()}
      />
    </>
  );
}
