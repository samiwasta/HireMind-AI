"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";

import {
  companySetPasswordAction,
  type CompanySetPasswordFormState,
} from "@/features/companies/controller/company-set-password.controller";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: CompanySetPasswordFormState = {};

type CompanySetPasswordFormProps = {
  token: string;
};

export function CompanySetPasswordForm({ token }: CompanySetPasswordFormProps) {
  const [state, formAction] = useActionState(companySetPasswordAction, initialState);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!token) {
    return (
      <Card className="w-full max-w-md rounded-2xl border border-border shadow-sm">
        <CardHeader className="text-center">
          <Logo className="justify-center" textClassName="text-primary" />
          <CardTitle className="text-xl">Invalid link</CardTitle>
          <CardDescription>Open the link from your invitation email, or ask your recruiter to resend it.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md rounded-2xl border border-border shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <Logo className="justify-center" textClassName="text-primary" />
        <CardTitle className="text-2xl font-semibold text-foreground">Set your password</CardTitle>
        <CardDescription>Create a new password for your company account before continuing.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5" noValidate>
          <input type="hidden" name="token" value={token} />

          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNew ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                className="h-11 bg-background px-3 pr-10"
                aria-invalid={Boolean(state.errors?.newPassword?.length)}
              />
              <button
                type="button"
                aria-label={showNew ? "Hide password" : "Show password"}
                onClick={() => setShowNew((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {state.errors?.newPassword?.[0] ? (
              <p className="text-xs text-destructive">{state.errors.newPassword[0]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                className="h-11 bg-background px-3 pr-10"
                aria-invalid={Boolean(state.errors?.confirmPassword?.length)}
              />
              <button
                type="button"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {state.errors?.confirmPassword?.[0] ? (
              <p className="text-xs text-destructive">{state.errors.confirmPassword[0]}</p>
            ) : null}
          </div>

          {state.errors?.form?.[0] ? (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-center text-xs text-destructive">{state.errors.form[0]}</p>
          ) : null}

          <Button type="submit" className="h-11 w-full text-sm font-semibold">
            Save password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
