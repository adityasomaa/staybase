import type { TourTargetId } from "@/lib/types";

import { tourTargets } from "./targets";

export interface WalkthroughStep {
  /** Short label for the progress list on the help page. */
  label: string;
  title: string;
  body: string;
  /** The control this step is about — supplies the route, tab and spotlight. */
  target: TourTargetId;
  /** Article to read if this step raises more questions than it answers. */
  article?: string;
}

/**
 * Guided setup.
 *
 * Not a slideshow: each step navigates to the page it is talking about and
 * puts a ring around the control, so the operator is standing in front of the
 * thing being described rather than reading about it and then hunting for it.
 *
 * The order is the dependency order — you cannot sell a rate plan whose room
 * type has no rooms, and you cannot map a channel before rate plans exist —
 * which is also why it reads as setup progress rather than a feature tour.
 */
export const walkthrough: WalkthroughStep[] = [
  {
    label: "Room types",
    title: "Start with room types",
    body: "A room type is what you sell — Deluxe Garden View, not room 204. Give it the real number of sellable rooms, because that number is what channels receive and what the subscription is billed on.",
    target: "inventory-room-types",
    article: "how-staybase-fits-together",
  },
  {
    label: "Rooms",
    title: "Add the physical rooms",
    body: "Each room type needs its actual rooms behind it. Without them the front desk has nothing to assign an arriving guest to, and housekeeping has no board.",
    target: "inventory-rooms",
  },
  {
    label: "Rate plans",
    title: "Add at least one rate plan",
    body: "A room type with no rate plan has no price, so it cannot be sold anywhere. Most properties start with a single Best Available Rate and derive the rest from it later.",
    target: "inventory-rate-plans",
    article: "derived-rate-plans",
  },
  {
    label: "Rates",
    title: "Price the next sixty days",
    body: "Room types run down the side, dates across the top. The row directly under a room type is availability and is shared by every rate plan beneath it — click any cell to set rate, minimum stay or stop sell.",
    target: "calendar-grid",
    article: "reading-the-ari-grid",
  },
  {
    label: "Auto-sync",
    title: "Changes push themselves",
    body: "There is no sync to forget. Edits are collected for a moment so a week of changes travels as one batch, then pushed to every mapped channel — Push now only forces that early.",
    target: "calendar-push",
    article: "reading-the-ari-grid",
  },
  {
    label: "Channel",
    title: "Connect your first channel",
    body: "STAYBASE never talks to an OTA directly; it pushes to Channex and Channex fans out. Each OTA has its own extranet path and credentials, so follow the guide for the one you are connecting.",
    target: "channels-add",
    article: "connect-an-ota",
  },
  {
    label: "Mapping",
    title: "Map every room type and rate plan",
    body: "This is the step that silently costs money. A channel can read as connected while half its room types point nowhere, and those never receive rates — they simply never sell.",
    target: "channels-mapping",
    article: "overbooking-and-availability",
  },
  {
    label: "Guardrails",
    title: "Set guardrails before any pricing rule",
    body: "Floor, ceiling and maximum daily movement per room type. Rules compound on top of each other, and these are applied last and always win — which is what stops a demand spike from doubling a rate overnight.",
    target: "pricing-guardrails",
    article: "dynamic-pricing-rules",
  },
  {
    label: "Front of house",
    title: "Run the day on the booking calendar",
    body: "One row per physical room, so a gap is a genuinely empty room. Click a stay to assign a room or take a payment, or an empty cell to block the room for maintenance.",
    target: "planner-grid",
    article: "booking-calendar-and-blocks",
  },
  {
    label: "Your team",
    title: "Invite the people who will use it",
    body: "A role decides what someone can do, and the property assignment decides where. Housekeeping never sees rates; an accountant never sees the front desk.",
    target: "users-invite",
    article: "invite-a-user",
  },
];

export const walkthroughLength = walkthrough.length;

/** URL for a step: the right route, the right tab, and the spotlight armed. */
export function walkStepHref(index: number): string {
  const step = walkthrough[index];
  const target = tourTargets[step.target];
  const params = new URLSearchParams();
  if (target.tab) params.set("tab", target.tab);
  params.set("focus", step.target);
  params.set("walk", String(index + 1));
  return `${target.href}?${params.toString()}`;
}

/** Parses the `walk` query parameter into a step index, or null. */
export function walkStepIndex(value: string | null): number | null {
  if (!value) return null;
  const index = Number(value) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= walkthrough.length) return null;
  return index;
}
