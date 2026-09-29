"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { Currency } from "@/lib/types";
import { PROPERTIES_COOKIE, addProperty } from "@/lib/workspace/properties";

export async function createProperty(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  await addProperty({
    title,
    city: String(formData.get("city") ?? "").trim(),
    country: String(formData.get("country") ?? "").trim(),
    currency: (String(formData.get("currency") ?? "IDR") as Currency) || "IDR",
    rooms: Number(formData.get("rooms") ?? 0),
    allotments: Number(formData.get("allotments") ?? 0),
  });

  redirect("/demo");
}

/** Empties the workspace back to a fresh install. */
export async function resetWorkspace() {
  const store = await cookies();
  store.delete(PROPERTIES_COOKIE);
  redirect("/demo");
}
