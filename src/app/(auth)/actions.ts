"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { Currency } from "@/lib/types";
import {
  ACCOUNT_COOKIE,
  createAccount,
  endSession,
  getAccount,
  startSession,
  verifyPassword,
} from "@/lib/workspace/account";
import { PROPERTIES_COOKIE, addProperty, listProperties } from "@/lib/workspace/properties";

export interface AuthState {
  error?: string;
}

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Sign in.
 *
 * Deliberately vague about which half was wrong when an account exists —
 * naming the field tells someone whether an email is registered. The one
 * exception is when no account exists at all, because "create one first" is
 * the only useful thing to say to a first-time visitor.
 */
export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Enter your email and password." };

  const account = await getAccount();
  if (!account) {
    return { error: "No account has been created on this browser yet. Sign up first." };
  }
  if (account.email !== email || !verifyPassword(account, password)) {
    return { error: "That email and password do not match an account." };
  }

  await startSession();
  redirect((await listProperties()).length === 0 ? "/properties/new" : "/dashboard");
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!EMAIL.test(email)) return { error: "Enter a valid email address." };
  if (password.length < 8) return { error: "Use at least 8 characters for the password." };

  const existing = await getAccount();
  if (existing) {
    return existing.email === email
      ? { error: "That account already exists. Sign in instead." }
      : { error: `This browser already has an account (${existing.email}). Sign in, or sign out of it first.` };
  }

  await createAccount({ name, email, password });
  await startSession();
  redirect("/properties/new");
}

export async function signOut() {
  await endSession();
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

/** Wipes the browser back to a fresh install — account included. */
export async function resetWorkspace() {
  const store = await cookies();
  store.delete(PROPERTIES_COOKIE);
  store.delete(ACCOUNT_COOKIE);
  await endSession();
  redirect("/signup");
}
