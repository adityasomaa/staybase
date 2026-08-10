"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { Currency } from "@/lib/types";
import { PROPERTIES_COOKIE, SESSION_COOKIE, addProperty } from "@/lib/workspace/properties";

const YEAR = 60 * 60 * 24 * 365;

/**
 * Sign-in and sign-up, as a shell.
 *
 * There is no identity provider behind this yet — the operator asked for the
 * screens first — so both actions do the same thing: mark the browser as
 * signed in. Everything downstream reads that flag, which is exactly the seam
 * a real provider will slot into.
 */
async function startSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "1", { path: "/", maxAge: YEAR, sameSite: "lax" });
}

export async function signIn() {
  await startSession();
  redirect("/dashboard");
}

export async function signUp() {
  await startSession();
  redirect("/properties/new");
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}

export async function createProperty(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  await addProperty({
    title,
    city: String(formData.get("city") ?? "").trim(),
    country: String(formData.get("country") ?? "").trim(),
    currency: (String(formData.get("currency") ?? "IDR") as Currency) || "IDR",
    rooms: Number(formData.get("rooms") ?? 0),
  });

  redirect("/dashboard");
}

/** Wipes the workspace back to a fresh install. */
export async function resetWorkspace() {
  const store = await cookies();
  store.delete(PROPERTIES_COOKIE);
  store.delete(SESSION_COOKIE);
  redirect("/login");
}
