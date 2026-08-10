import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signIn } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/auth-form";
import { getAccount, isSignedIn } from "@/lib/workspace/account";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isSignedIn()) redirect("/");
  const account = await getAccount();

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-xl">Sign in</CardTitle>
        <CardDescription className="text-pretty">
          {account
            ? `Welcome back${account.name ? `, ${account.name}` : ""}.`
            : "No account has been created on this browser yet — sign up first."}
        </CardDescription>
      </CardHeader>

      <AuthForm
        action={signIn}
        submitLabel="Sign in"
        footer={
          <p className="text-muted-foreground text-center text-sm">
            No account yet?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={account?.email ?? ""}
            placeholder="you@hotel.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>
      </AuthForm>
    </Card>
  );
}
