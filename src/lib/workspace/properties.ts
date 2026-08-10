import "server-only";

import { cookies } from "next/headers";

import type { Currency, Property } from "@/lib/types";

/**
 * The property list, in a cookie.
 *
 * There is no database yet, and the operator asked for the shell first: a new
 * workspace that starts empty and can have properties added to it. A cookie is
 * the honest version of that — it survives a reload and a new tab, it is
 * per-browser rather than per-account, and it makes the eventual swap to a
 * table a change in one module.
 */
export const PROPERTIES_COOKIE = "staybase_properties";

const YEAR = 60 * 60 * 24 * 365;

export interface NewProperty {
  title: string;
  city: string;
  country: string;
  currency: Currency;
  rooms: number;
}

function parse(raw: string | undefined): Property[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? (value as Property[]) : [];
  } catch {
    // A malformed cookie is treated as no properties rather than an error —
    // the alternative is a workspace nobody can get back into.
    return [];
  }
}

export async function listProperties(): Promise<Property[]> {
  const store = await cookies();
  return parse(store.get(PROPERTIES_COOKIE)?.value);
}

export async function getActiveProperty(): Promise<Property | null> {
  const all = await listProperties();
  return all[0] ?? null;
}

export async function saveProperties(next: Property[]) {
  const store = await cookies();
  store.set(PROPERTIES_COOKIE, JSON.stringify(next), {
    path: "/",
    maxAge: YEAR,
    sameSite: "lax",
  });
}

/** A code like UBUD-1, derived from the title so it reads as a property. */
function codeFor(title: string, taken: string[]): string {
  const base =
    title
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, " ")
      .trim()
      .split(" ")[0]
      ?.slice(0, 6) || "PROP";
  let code = base;
  let n = 1;
  while (taken.includes(code)) code = `${base}-${++n}`;
  return code;
}

export async function addProperty(input: NewProperty): Promise<Property> {
  const existing = await listProperties();
  const property: Property = {
    id: `prop_${Math.random().toString(36).slice(2, 10)}`,
    title: input.title.trim(),
    code: codeFor(input.title, existing.map((p) => p.code)),
    city: input.city.trim(),
    country: input.country.trim(),
    timezone: "Asia/Makassar",
    currency: input.currency,
    logoHue: (existing.length * 47) % 360,
    rooms: Math.max(0, Math.round(input.rooms)),
    channexId: null,
  };
  await saveProperties([...existing, property]);
  return property;
}

