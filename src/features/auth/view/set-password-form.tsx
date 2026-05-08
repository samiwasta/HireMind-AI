"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  setPasswordAction,
  type SetPasswordFormState,
} from "@/features/auth/controller/set-password.controller";

const initialState: SetPasswordFormState = {};

export function SetPasswordForm() {
  const [state, formAction] = useActionState(setPasswordAction, initialState);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();

  const emailFromQuery = searchParams.get("email") ?? "";
  const email = state.email ?? emailFromQuery;

  return (
    <Card className="w-full max-w-md rounded-2xl border border-border shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <Logo className="justify-center" textClassName="text-primary" />
        <CardTitle className="text-2xl font-semibold text-foreground">Change password</CardTitle>
        <CardDescription>Set your password before continuing to login.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5" noValidate>
          <input type="hidden" name="email" value={email} />

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter new password"
                aria-invalid={Boolean(state.errors?.newPassword?.length)}
                className="h-11 bg-background px-3 pr-11"
                required
              />
              <button
                type="button"
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="size-4 shrink-0" /> : <Eye className="size-4 shrink-0" />}
              </button>
            </div>
            {state.errors?.newPassword?.length ? (
              <p className="text-xs text-danger">{state.errors.newPassword[0]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm new password"
                aria-invalid={Boolean(state.errors?.confirmPassword?.length)}
                className="h-11 bg-background px-3 pr-11"
                required
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="size-4 shrink-0" /> : <Eye className="size-4 shrink-0" />}
              </button>
            </div>
            {state.errors?.confirmPassword?.length ? (
              <p className="text-xs text-danger">{state.errors.confirmPassword[0]}</p>
            ) : null}
          </div>

          {state.errors?.form?.length ? (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-center text-xs text-danger">
              {state.errors.form[0]}
            </p>
          ) : null}

          <Button type="submit" className="h-11 w-full text-sm font-semibold">
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
