"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Logo } from "@/components/brand/logo";
import {
  forgotPasswordAction,
  type ForgotPasswordFormState,
} from "@/features/auth/controller/forgot-password.controller";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ForgotPasswordFormState = {
  success: false,
};

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialState);

  return (
    <Card className="w-full max-w-md rounded-2xl border border-border shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <Logo className="justify-center" textClassName="text-primary" />
        <CardTitle className="text-2xl font-semibold text-foreground">Forgot password?</CardTitle>
        <CardDescription>
          Enter your account email and we will send you a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              defaultValue={state.email ?? ""}
              aria-invalid={Boolean(state.errors?.email?.length)}
              aria-describedby={state.errors?.email?.length ? "email-error" : undefined}
              className="h-11 bg-background px-3"
              required
            />
            {state.errors?.email?.length ? (
              <p id="email-error" className="text-xs text-danger">
                {state.errors.email[0]}
              </p>
            ) : null}
          </div>

          <Button type="submit" className="h-11 w-full text-sm font-semibold">
            Send reset link
          </Button>

          {state.errors?.form?.length ? (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-center text-xs text-danger">
              {state.errors.form[0]}
            </p>
          ) : null}

          {state.success ? (
            <p className="rounded-md bg-success/10 px-3 py-2 text-center text-xs text-success">
              If the email exists, a reset link has been sent.
            </p>
          ) : null}

          <p className="text-center text-xs text-muted-foreground">
            Remembered your password?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
              Back to login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
