import type { Metadata } from "next";
import Link from "next/link";

import { signUp } from "@/app/(auth)/actions";
import { PRICE_PER_PROPERTY, BILLING_CURRENCY } from "@/lib/data/queries";
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

export const metadata: Metadata = { title: "Create an account" };

export default function SignUpPage() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-xl">Create your workspace</CardTitle>
        <CardDescription className="text-pretty">
          {BILLING_CURRENCY} {PRICE_PER_PROPERTY} per property, per month. Add as many
          properties as you run — each one is billed the same.
        </CardDescription>
      </CardHeader>

      <form action={signUp}>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Your name</Label>
            <Input id="name" name="name" placeholder="Ayu Pratiwi" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" name="email" type="email" placeholder="you@hotel.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" />
          </div>
          <p className="text-muted-foreground text-xs text-pretty">
            Authentication is not wired up yet — these screens are the shell. Creating an
            account opens the workspace on this browser and takes you to your first
            property.
          </p>
        </CardContent>

        <CardFooter className="mt-4 flex-col items-stretch gap-2">
          <Button type="submit" className="w-full">
            Create account
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            Already have one?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
