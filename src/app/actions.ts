"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { BILLING_COOKIE, TOUR_COOKIE, WALKTHROUGH_COOKIE } from "@/lib/workspace";

const YEAR = 60 * 60 * 24 * 365;

/**
 * Billing enforcement.
 *
 * Suspension deliberately locks only the UI and outbound pushes. The Channex
 * webhook keeps accepting reservations, because dropping a guest's booking
 * over an unpaid invoice punishes the wrong person.
 */
export async function suspendWorkspace() {
  const store = await cookies();
  store.set(BILLING_COOKIE, "suspended", { path: "/", maxAge: YEAR, sameSite: "lax" });
  revalidatePath("/", "layout");
}

export async function restoreWorkspace() {
  const store = await cookies();
  store.set(BILLING_COOKIE, "active", { path: "/", maxAge: YEAR, sameSite: "lax" });
  revalidatePath("/", "layout");
}

export async function completeTour() {
  const store = await cookies();
  store.set(TOUR_COOKIE, "done", { path: "/", maxAge: YEAR, sameSite: "lax" });
}

export async function resetTour() {
  const store = await cookies();
  store.delete(TOUR_COOKIE);
  store.delete(WALKTHROUGH_COOKIE);
  revalidatePath("/", "layout");
}

/**
 * Guided setup progress, as a count of finished steps.
 *
 * Only ever moves forward: stepping back to re-read something should not undo
 * progress the operator has already made.
 */
export async function recordWalkthroughProgress(completed: number) {
  const store = await cookies();
  const current = Number(store.get(WALKTHROUGH_COOKIE)?.value);
  const highest = Math.max(Number.isInteger(current) ? current : 0, completed);
  store.set(WALKTHROUGH_COOKIE, String(highest), {
    path: "/",
    maxAge: YEAR,
    sameSite: "lax",
  });
  // The tour launcher must not reappear once setup has started.
  store.set(TOUR_COOKIE, "done", { path: "/", maxAge: YEAR, sameSite: "lax" });
}
