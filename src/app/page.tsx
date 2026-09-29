import { redirect } from "next/navigation";

/** The demo is the product here — no sign-in stands between them and it. */
export default function RootPage() {
  redirect("/demo");
}
