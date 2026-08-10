import type { Metadata } from "next";
import Link from "next/link";

import { signIn } from "@/app/(auth)/actions";
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

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-xl">Sign in</CardTitle>
        <CardDescription className="text-pretty">
          Welcome back. Sign in to reach your properties, rates and reservations.
        </CardDescription>
      </CardHeader>

      <form action={signIn}>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@hotel.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" />
          </div>
          <p className="text-muted-foreground text-xs text-pretty">
            Authentication is not wired up yet — these screens are the shell, and signing
            in opens the workspace on this browser.
          </p>
        </CardContent>

        <CardFooter className="mt-4 flex-col items-stretch gap-2">
          <Button type="submit" className="w-full">
            Sign in
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            No account yet?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
