import { redirect } from "next/navigation";

/** The dashboard moved to /demo; links already in the wild still work. */
export default function DashboardRedirect() {
  redirect("/demo");
}
