import type { TourTargetId } from "@/lib/types";

import { tourTargets } from "./targets";

/**
 * What the workspace actually contains, as far as onboarding cares.
 *
 * Counted on the server and handed to the panel, so a step is ticked because
 * the thing exists — not because someone clicked through a tour.
 */
export interface OnboardingSnapshot {
  properties: number;
  roomTypes: number;
  rooms: number;
  ratePlans: number;
  ratedDates: number;
  channels: number;
  reservations: number;
  users: number;
}

export interface OnboardingStep {
  id: string;
  title: string;
  body: string;
  /** Where the work happens. */
  target: TourTargetId;
  /** Article that explains the thinking, when there is one. */
  article?: string;
  done: (snapshot: OnboardingSnapshot) => boolean;
}

/**
 * Setup as a checklist, not a walkthrough.
 *
 * The tour used to spotlight controls on screens with nothing in them, which
 * is how you end up ringing an empty table. A checklist says the same things
 * without pretending: each step names what is missing, links to where it is
 * created, and ticks itself once the workspace contains it.
 *
 * The order is the dependency order — a rate plan needs a room type, a channel
 * needs something to map.
 */
export const onboardingSteps: OnboardingStep[] = [
  {
    id: "property",
    title: "Add your property",
    body: "Everything hangs off a property: room types, then rate plans, then rates. Allotments set here are what the subscription bills on.",
    target: "inventory-room-types",
    done: (s) => s.properties > 0,
  },
  {
    id: "room-types",
    title: "Create your room types",
    body: "A room type is what you sell — Deluxe Garden View, not room 204. Its count is the allotment channels receive as availability.",
    target: "inventory-room-types",
    article: "how-staybase-fits-together",
    done: (s) => s.roomTypes > 0,
  },
  {
    id: "rooms",
    title: "Add the physical rooms",
    body: "The bedrooms behind each room type. Without them the front desk has nothing to assign an arriving guest to, and housekeeping has no board.",
    target: "inventory-rooms",
    done: (s) => s.rooms > 0,
  },
  {
    id: "rate-plans",
    title: "Add at least one rate plan",
    body: "A room type with no rate plan has no price, so it cannot be sold anywhere. Most properties start with a single Best Available Rate.",
    target: "inventory-rate-plans",
    article: "derived-rate-plans",
    done: (s) => s.ratePlans > 0,
  },
  {
    id: "rates",
    title: "Price the next sixty days",
    body: "Room types down the side, dates across the top. Rates and availability exist five years either side of today — click any cell to set one.",
    target: "calendar-grid",
    article: "reading-the-ari-grid",
    done: (s) => s.ratedDates > 0,
  },
  {
    id: "channel",
    title: "Connect a channel",
    body: "STAYBASE never talks to an OTA directly; it pushes to Channex and Channex fans out. Each OTA has its own extranet path and credentials.",
    target: "channels-add",
    article: "connect-an-ota",
    done: (s) => s.channels > 0,
  },
  {
    id: "mapping",
    title: "Map every room type and rate plan",
    body: "This is the step that silently costs money: a channel can read as connected while half its room types point nowhere, and those never receive rates.",
    target: "channels-mapping",
    article: "overbooking-and-availability",
    done: (s) => s.channels > 0 && s.roomTypes > 0,
  },
  {
    id: "team",
    title: "Invite the people who will use it",
    body: "A role decides what someone can do, and the property assignment decides where. Housekeeping never sees rates; an accountant never sees the front desk.",
    target: "users-invite",
    article: "invite-a-user",
    done: (s) => s.users > 0,
  },
];

export function onboardingHref(step: OnboardingStep): string {
  const target = tourTargets[step.target];
  const params = new URLSearchParams();
  if (target.tab) params.set("tab", target.tab);
  return params.size > 0 ? `${target.href}?${params.toString()}` : target.href;
}

export function onboardingProgress(snapshot: OnboardingSnapshot) {
  const done = onboardingSteps.filter((step) => step.done(snapshot)).length;
  return { done, total: onboardingSteps.length, complete: done === onboardingSteps.length };
}
