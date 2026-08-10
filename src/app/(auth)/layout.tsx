import { StaybaseLockup } from "@/components/brand/staybase-logo";

/** These screens exist before there is a workspace, so they have no shell. */
export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <StaybaseLockup />
      <div className="w-full max-w-sm">{children}</div>
      <p className="text-muted-foreground max-w-sm text-center text-xs text-pretty">
        A property management system for independent hotels and villas, with native
        Channex channel-manager connectivity.
      </p>
    </main>
  );
}
