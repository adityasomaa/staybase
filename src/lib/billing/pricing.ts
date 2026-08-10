/**
 * Subscription price.
 *
 * In its own module rather than in the data layer so client components can
 * read it — `lib/data/queries.ts` is server-only, and the sidebar and the
 * sign-up screen both need to quote the price.
 */
export const PRICE_PER_PROPERTY = 10;
export const BILLING_CURRENCY = "USD";
