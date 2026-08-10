import "server-only";

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * The account, in an httpOnly cookie.
 *
 * There is still no database, but "you cannot sign in unless you signed up"
 * has to be true rather than decorative — so the credential is stored and
 * checked properly: scrypt with a per-account salt, compared in constant time,
 * in a cookie the browser's JavaScript cannot read.
 *
 * Two honest limits follow from having no server-side store. The account lives
 * in this browser, so it cannot be used from another one, and clearing cookies
 * deletes it. Both disappear the day this module reads a users table instead.
 */
export const ACCOUNT_COOKIE = "staybase_account";
export const SESSION_COOKIE = "staybase_session";

const YEAR = 60 * 60 * 24 * 365;
const KEY_LENGTH = 32;

export interface Account {
  name: string;
  email: string;
  salt: string;
  hash: string;
  createdAt: string;
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, KEY_LENGTH).toString("hex");
}

export async function getAccount(): Promise<Account | null> {
  const store = await cookies();
  const raw = store.get(ACCOUNT_COOKIE)?.value;
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Account;
    return value?.email && value?.hash && value?.salt ? value : null;
  } catch {
    return null;
  }
}

export async function createAccount(input: {
  name: string;
  email: string;
  password: string;
}): Promise<Account> {
  const salt = randomBytes(16).toString("hex");
  const account: Account = {
    name: input.name.trim() || input.email.split("@")[0],
    email: input.email.trim().toLowerCase(),
    salt,
    hash: hashPassword(input.password, salt),
    createdAt: new Date().toISOString(),
  };

  const store = await cookies();
  store.set(ACCOUNT_COOKIE, JSON.stringify(account), {
    path: "/",
    maxAge: YEAR,
    sameSite: "lax",
    httpOnly: true,
  });
  return account;
}

/** Constant-time check, so a wrong password cannot be found by timing it. */
export function verifyPassword(account: Account, password: string): boolean {
  const candidate = Buffer.from(hashPassword(password, account.salt), "hex");
  const stored = Buffer.from(account.hash, "hex");
  return candidate.length === stored.length && timingSafeEqual(candidate, stored);
}

export async function startSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "1", {
    path: "/",
    maxAge: YEAR,
    sameSite: "lax",
    httpOnly: true,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function isSignedIn(): Promise<boolean> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === "1";
}
