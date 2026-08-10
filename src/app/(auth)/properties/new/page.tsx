import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";

import { createProperty } from "@/app/(auth)/actions";
import { PRICE_PER_PROPERTY, BILLING_CURRENCY } from "@/lib/data/queries";
import { isSignedIn, listProperties } from "@/lib/workspace/properties";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = { title: "Add a property" };
export const dynamic = "force-dynamic";

export default async function NewPropertyPage() {
  if (!(await isSignedIn())) redirect("/login");
  const existing = await listProperties();

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="bg-primary/10 text-primary mb-1 flex size-10 items-center justify-center rounded-lg">
          <Building2 className="size-5" />
        </div>
        <CardTitle className="text-xl">
          {existing.length === 0 ? "Add your first property" : "Add a property"}
        </CardTitle>
        <CardDescription className="text-pretty">
          {existing.length === 0
            ? "A property is the top of the tree: room types hang off it, then rate plans, then rates."
            : `You have ${existing.length} propert${existing.length === 1 ? "y" : "ies"}. Each one is billed separately.`}
        </CardDescription>
      </CardHeader>

      <form action={createProperty}>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="title">Property name</Label>
            <Input id="title" name="title" required placeholder="Staybase Ubud Retreat" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" placeholder="Ubud" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" placeholder="Indonesia" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rooms">Rooms</Label>
              <Input
                id="rooms"
                name="rooms"
                type="number"
                min={0}
                defaultValue={0}
                className="tabular"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" name="currency" defaultValue="IDR" className="tabular" />
            </div>
          </div>

          <div className="bg-muted/50 flex items-baseline justify-between rounded-lg border p-3">
            <span className="text-sm">Added to your bill</span>
            <span className="tabular text-sm font-semibold">
              {BILLING_CURRENCY} {PRICE_PER_PROPERTY}.00 / month
            </span>
          </div>
        </CardContent>

        <CardFooter className="mt-4 flex-col items-stretch gap-2">
          <Button type="submit" className="w-full">
            Add property
          </Button>
          {existing.length > 0 ? (
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/dashboard">Back to the workspace</Link>
            </Button>
          ) : null}
        </CardFooter>
      </form>
    </Card>
  );
}
