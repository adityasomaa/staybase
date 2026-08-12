/**
 * Subscription price.
 *
 * Billed per allotment — a sellable unit, not a bedroom. A three-bedroom villa
 * that can only be booked whole is one allotment; twelve Deluxe rooms sold
 * individually are twelve. It is the same number the channel manager receives
 * as availability, which is the point: you pay for what you can sell, not for
 * how the building is divided up.
 *
 * In its own module rather than in the data layer so client components can
 * read it — `lib/data/queries.ts` is server-only, and the sidebar, sign-up and
 * property screens all quote the price.
 */
export const PRICE_PER_ALLOTMENT = 10;
export const BILLING_CURRENCY = "USD";

export function monthlyTotal(allotments: number): number {
  return Math.max(0, allotments) * PRICE_PER_ALLOTMENT;
}
