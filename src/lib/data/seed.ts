import { addDays, toISODate } from "@/lib/date";
import type {
  AriCell,
  ChannelConnection,
  Guest,
  ISODate,
  KpiPoint,
  Property,
  RatePlan,
  Reservation,
  Room,
  RoomType,
  SyncEvent,
} from "@/lib/types";

/**
 * A new workspace.
 *
 * This module used to hold a 900-reservation demo dataset. The operator asked
 * for the product to start empty — a fresh install, not a showroom — so every
 * collection here is empty and stays empty until something creates a record.
 *
 * The shape is kept deliberately: `lib/data/queries.ts` reads these exports,
 * and swapping them for Drizzle queries is a drop-in change because
 * `db/schema.ts` mirrors the same types.
 */

/** Anchor instant for the whole workspace — resolved once, on the server. */
const NOW = new Date();
export const TODAY: ISODate = toISODate(NOW);

/** Minutes before NOW, as an ISO timestamp. */
export function minutesAgo(minutes: number): string {
  return new Date(NOW.getTime() - minutes * 60_000).toISOString();
}

export const properties: Property[] = [];
export const roomTypes: RoomType[] = [];
export const ratePlans: RatePlan[] = [];
export const guests: Guest[] = [];
export const rooms: Room[] = [];
export const reservations: Reservation[] = [];
export const channelConnections: ChannelConnection[] = [];
export const syncEvents: SyncEvent[] = [];
export const kpiSeries: KpiPoint[] = [];

/* -------------------------------------------------------------------------- */
/*  Availability horizon                                                      */
/* -------------------------------------------------------------------------- */

/** How far either side of today rates and availability exist. */
export const ARI_YEARS = 5;
export const ARI_FROM: ISODate = addDays(TODAY, -365 * ARI_YEARS);
export const ARI_TO: ISODate = addDays(TODAY, 365 * ARI_YEARS);

/** Rooms sold per (room type, date), from the reservation ledger. */
export const soldByTypeDate = new Map<string, number>();

/**
 * ARI is generated per date rather than materialised.
 *
 * The grid is open ten years wide and has to move with the calendar every
 * day, which rules out a precomputed array: it would be tens of thousands of
 * rows rebuilt on every cold start, and stale the moment the process outlived
 * midnight.
 *
 * With no room types defined yet this returns nothing, which is what an empty
 * workspace should show. Once inventory exists, every date in the horizon has
 * a cell without anything having to be backfilled.
 */
export function ariCellsOn(date: ISODate): AriCell[] {
  const cells: AriCell[] = [];
  for (const roomType of roomTypes) {
    for (const plan of ratePlans.filter((rp) => rp.roomTypeId === roomType.id)) {
      const offset = plan.mode === "derived" ? 1 + (plan.derivedOffsetPct ?? 0) / 100 : 1;
      cells.push({
        date,
        roomTypeId: roomType.id,
        ratePlanId: plan.id,
        rate: Math.round(roomType.defaultRate * offset),
        allotment: roomType.count,
        // Availability comes from the ledger, never from a second series.
        booked: Math.min(roomType.count, soldByTypeDate.get(`${roomType.id}|${date}`) ?? 0),
        minStay: 1,
        maxStay: 30,
        closed: false,
        closedToArrival: false,
        closedToDeparture: false,
      });
    }
  }
  return cells;
}

export function ariCellsFor(dates: ISODate[]): AriCell[] {
  return dates.flatMap(ariCellsOn);
}

export function ariCellForPlan(ratePlanId: string, date: ISODate): AriCell | undefined {
  return ariCellsOn(date).find((c) => c.ratePlanId === ratePlanId);
}

export function ariCellForRoomType(roomTypeId: string, date: ISODate): AriCell | undefined {
  return ariCellsOn(date).find((c) => c.roomTypeId === roomTypeId);
}
