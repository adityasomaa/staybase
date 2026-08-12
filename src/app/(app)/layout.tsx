import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { TutorialSpotlight } from "@/components/help/tutorial-spotlight";
import { SuspendedWorkspace } from "@/components/billing/suspended-workspace";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  arrivalsOn,
  channelConnections,
  listReservations,
  ratePlans,
  roomTypes,
  rooms,
  users,
  getBillingOverview,
  getHousekeepingBoard,
  listRoomBlocks,
  syncEvents,
  TODAY,
} from "@/lib/data/queries";
import { getBillingState } from "@/lib/workspace";
import { isSignedIn } from "@/lib/workspace/account";
import { listProperties } from "@/lib/workspace/properties";

/**
 * A PMS is a live operational view — "today" has to be resolved per request,
 * not frozen into the build. Every route under this group renders on demand.
 */
export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const billingState = await getBillingState();
  // The shell is only reachable with a session and at least one property —
  // otherwise there is nothing for any of these screens to be about.
  if (!(await isSignedIn())) redirect("/login");
  const properties = await listProperties();
  const activeProperty = properties[0];
  if (!activeProperty) redirect("/properties/new");

  const billing = getBillingOverview(
    properties.length,
    properties.reduce((sum, property) => sum + property.rooms, 0),
  );

  // Counted here so every step reports from the workspace itself.
  const onboarding = {
    properties: properties.length,
    roomTypes: roomTypes.length,
    rooms: rooms.length,
    ratePlans: ratePlans.length,
    ratedDates: roomTypes.length > 0 && ratePlans.length > 0 ? 1 : 0,
    channels: channelConnections.length,
    reservations: listReservations().length,
    users: users.length,
  };

  const badges = {
    arrivals: arrivalsOn().length,
    syncErrors: syncEvents.filter((e) => e.outcome === "error").length,
    dirtyRooms: getHousekeepingBoard().filter((r) => r.housekeeping === "dirty").length,
    blocks: listRoomBlocks().filter((b) => b.to > TODAY).length,
    unpaidInvoices: billing.outstanding.length,
  };

  if (billingState === "suspended") {
    return (
      <SuspendedWorkspace
        amountDue={billing.amountDue}
        invoiceNumber={billing.outstanding[0]?.number ?? billing.invoices[0]?.number ?? "—"}
        planName={billing.plan.name}
      />
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar
        properties={properties.map((p) => ({
          id: p.id,
          title: p.title,
          code: p.code,
          city: p.city,
          rooms: p.rooms,
          connected: p.channexId !== null,
        }))}
        activePropertyId={activeProperty.id}
        badges={badges}
      />
      {/* SidebarInset already renders a <main>; nesting another would create a
          second landmark, so the page wrapper below is a plain element. */}
      <SidebarInset className="min-w-0 overflow-x-clip">
        <SiteHeader
          propertyName={`${activeProperty.title} · ${activeProperty.city}`}
          pastDue={billing.outstanding.length > 0}
          daysUntilSuspension={billing.daysUntilSuspension}
          onboarding={onboarding}
        />
        <div className="flex flex-1 flex-col gap-5 p-4 lg:p-6">{children}</div>
      </SidebarInset>
      <TutorialSpotlight />
    </SidebarProvider>
  );
}
