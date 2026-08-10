import type {
  Invoice,
  Plan,
  PricingGuardrail,
  PricingRule,
  RoomBlock,
  User,
} from "@/lib/types";

/**
 * Operational records for a new workspace — all empty.
 *
 * What is not empty is the price list, because that is the product's own
 * configuration rather than a customer's data.
 */

export const roomBlocks: RoomBlock[] = [];
export const users: User[] = [];
export const invoices: Invoice[] = [];
export const pricingRules: PricingRule[] = [];
export const pricingGuardrails: PricingGuardrail[] = [];

export { PRICE_PER_PROPERTY, BILLING_CURRENCY } from "@/lib/billing/pricing";
import { PRICE_PER_PROPERTY, BILLING_CURRENCY } from "@/lib/billing/pricing";

/**
 * One plan, priced per property.
 *
 * The old three-tier, per-room price list is gone: the operator set a single
 * price of $10 per property per month, and a tier table that nobody can move
 * between is just furniture.
 */
export const plans: Plan[] = [
  {
    id: "starter",
    name: "Standard",
    pricePerRoom: 0,
    minimumMonthly: 0,
    includedProperties: 1,
    features: [
      `${BILLING_CURRENCY} ${PRICE_PER_PROPERTY} per property, per month`,
      "Unlimited rooms, rate plans and reservations",
      "Channex connectivity to every supported OTA",
      "Dynamic pricing, user roles and property scoping",
    ],
  },
];
