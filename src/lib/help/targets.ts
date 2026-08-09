import type { TourTarget, TourTargetId } from "@/lib/types";

/**
 * Where each tutorial step actually happens.
 *
 * A step like "set the floor and ceiling before enabling any rule" is useless
 * if the reader cannot find the field. Every step that is carried out inside
 * STAYBASE names a target here, and the article renders a button that opens
 * the right route, selects the right tab, and puts a spotlight on the control.
 *
 * `Record<TourTargetId, TourTarget>` is deliberate: adding an id to the union
 * without describing it here is a type error, so a step can never point at a
 * place that does not exist.
 */
export const tourTargets: Record<TourTargetId, TourTarget> = {
  "global-search": {
    href: "/dashboard",
    label: "Show me search",
    hint: "This is search. It reaches the whole reservation ledger on the server, not just what this page has loaded — Ctrl+K (⌘K on a Mac) opens it from anywhere.",
  },

  "inventory-new": {
    href: "/inventory",
    label: "Open Inventory",
    hint: "Everything is created from this menu — a room type, a rate plan under it, or a physical room.",
  },
  "inventory-room-types": {
    href: "/inventory",
    tab: "room-types",
    label: "Open Inventory → Room types",
    hint: "One card per room type. The count is how many rooms you can actually sell, and it is what the subscription is billed on.",
  },
  "inventory-rate-plans": {
    href: "/inventory",
    tab: "rate-plans",
    label: "Open Inventory → Rate plans",
    hint: "Each rate plan belongs to a room type. A derived plan shows its parent and offset instead of a price of its own.",
  },
  "inventory-rooms": {
    href: "/inventory",
    tab: "rooms",
    label: "Open Inventory → Rooms",
    hint: "The physical rooms behind each room type. Without these the front desk has nothing to assign an arriving guest to.",
  },

  "calendar-grid": {
    href: "/calendar",
    label: "Open the ARI grid",
    hint: "Room types down the side, dates across the top. The first row under a room type is availability and is shared by every rate plan beneath it — click any cell to edit rate, minimum stay or stop sell.",
  },
  "calendar-push": {
    href: "/calendar",
    label: "Show me Save & push",
    hint: "Edits stage locally and are counted here. Nothing reaches a channel until you press this — that is what stops a half-finished change from becoming a rate parity incident.",
  },

  "planner-grid": {
    href: "/planner",
    label: "Open the booking calendar",
    hint: "One row per physical room, so a gap here is a genuinely empty room. Click a bar to open the stay, or an empty cell to block the room.",
  },
  "planner-block": {
    href: "/planner",
    label: "Show me Block room",
    hint: "Blocking takes a room off sale for a date range and reduces sellable inventory immediately. Channels only learn about it on the next push.",
  },

  "channels-add": {
    href: "/channels",
    label: "Open Channels",
    hint: "Start a connection here, then follow the guide for that specific OTA — the extranet path and the credentials differ for every one of them.",
  },
  "channels-mapping": {
    href: "/channels",
    label: "Show me channel mapping",
    hint: "Room type mapping, per channel. A channel can read as connected while half its room types point nowhere, and those simply never receive rates.",
  },
  "channels-sync": {
    href: "/channels",
    label: "Show me Sync now",
    hint: "Pushes the current window to Channex. Without an API key it runs as a dry run and reports the batch counts it would have sent.",
  },
  "channels-journal": {
    href: "/channels",
    label: "Show me the sync journal",
    hint: "Every push and every inbound booking, with the outcome. A rejected batch means that channel is running on stale data until the next successful push.",
  },

  "pricing-rules": {
    href: "/pricing",
    tab: "rules",
    label: "Open Pricing → Rules",
    hint: "Rules run in priority order and compound on the running rate, so a percentage rule late in the chain applies to a bigger number. Enable one at a time.",
  },
  "pricing-preview": {
    href: "/pricing",
    tab: "preview",
    label: "Open Pricing → Preview",
    hint: "Current versus suggested, date by date, with the rules that moved each one and the guardrail that clamped it. Applying stages the change like any other edit.",
  },
  "pricing-guardrails": {
    href: "/pricing",
    tab: "guardrails",
    label: "Open Pricing → Guardrails",
    hint: "Floor, ceiling and maximum daily movement per room type. These are applied after the rules and always win — set them before enabling anything.",
  },

  "users-invite": {
    href: "/users",
    label: "Show me Invite user",
    hint: "The role decides what someone can do; the property tick boxes decide where. Owners always reach every property, so that control is disabled for them.",
  },
  "users-directory": {
    href: "/users",
    label: "Open Users",
    hint: "Everyone in the workspace with their role and status. A pending invite can be revoked with no side effects.",
  },

  "billing-invoices": {
    href: "/billing",
    label: "Open Billing → Invoices",
    hint: "The outstanding invoice and its grace deadline. Past due shows a banner; once the grace period expires the workspace locks to this page.",
  },
  "billing-payment-method": {
    href: "/billing",
    label: "Show me the payment method",
    hint: "Update the card here when the failure was a declined charge rather than an unsent payment.",
  },
};

/**
 * URL for a tutorial step.
 *
 * `focus` is what the spotlight looks for, `tab` opens the right panel before
 * it looks, and `from` lets the spotlight offer a way back to the guide the
 * reader came from.
 */
export function tourHref(id: TourTargetId, fromSlug?: string): string {
  const target = tourTargets[id];
  const params = new URLSearchParams();
  if (target.tab) params.set("tab", target.tab);
  params.set("focus", id);
  if (fromSlug) params.set("from", fromSlug);
  return `${target.href}?${params.toString()}`;
}

export function getTourTarget(id: string | null): TourTarget | undefined {
  if (!id) return undefined;
  return tourTargets[id as TourTargetId];
}
