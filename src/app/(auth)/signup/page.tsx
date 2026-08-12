import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signUp } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/auth-form";
import { BILLING_CURRENCY, PRICE_PER_ALLOTMENT } from "@/lib/billing/pricing";
import { getAccount, isSignedIn } from "@/lib/workspace/account";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = { title: "Create an account" };
export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  if (await isSignedIn()) redirect("/");
  const existing = await getAccount();

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-xl">Create your workspace</CardTitle>
        <CardDescription className="text-pretty">
          {existing
            ? `This browser already has an account for ${existing.email}.`
            : `${BILLING_CURRENCY} ${PRICE_PER_ALLOTMENT} per allotment, per month — you pay for what you can sell, not for how the building is divided up.`}
        </CardDescription>
      </CardHeader>

      <AuthForm
        action={signUp}
        submitLabel="Create account"
        footer={
          <p className="text-muted-foreground text-center text-sm">
            Already have one?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" autoComplete="name" placeholder="Ayu Pratiwi" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@hotel.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </div>
      </AuthForm>
    </Card>
  );
}
