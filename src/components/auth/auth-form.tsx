"use client";

import * as React from "react";
import { CircleAlert, Loader2 } from "lucide-react";

import type { AuthState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";

/**
 * The shared shell for sign-in and sign-up.
 *
 * Both forms need the same three things: the pending state while the action
 * runs, the error the action returned, and a submit button that cannot be
 * pressed twice. `useActionState` gives all three, so neither page has to
 * hold state of its own.
 */
export function AuthForm({
  action,
  submitLabel,
  children,
  footer,
}: {
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  submitLabel: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const [state, formAction, pending] = React.useActionState(action, {});

  return (
    <form action={formAction}>
      <CardContent className="space-y-3">
        {children}

        {state.error ? (
          <p
            role="alert"
            className="border-destructive/30 bg-destructive/5 text-destructive flex items-start gap-2 rounded-lg border p-2.5 text-sm text-pretty"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            {state.error}
          </p>
        ) : null}
      </CardContent>

      <CardFooter className="mt-4 flex-col items-stretch gap-2">
        <Button type="submit" className="w-full gap-1.5" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitLabel}
        </Button>
        {footer}
      </CardFooter>
    </form>
  );
}
