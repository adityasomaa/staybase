import { redirect } from "next/navigation";

import { isSignedIn, listProperties } from "@/lib/workspace/properties";

export const dynamic = "force-dynamic";

/**
 * Where a visitor lands.
 *
 * Signed out goes to sign-in; signed in with no property goes to the property
 * form, because every other screen is about a property; otherwise the app.
 */
export default async function RootPage() {
  if (!(await isSignedIn())) redirect("/login");
  const properties = await listProperties();
  redirect(properties.length === 0 ? "/properties/new" : "/dashboard");
}
