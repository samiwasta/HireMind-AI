"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

import {
  createCompanyAction,
  type CreateCompanyFormState,
} from "@/features/companies/controller/create-company.controller";
import { generateTemporaryPassword } from "@/lib/temporary-password";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const initialState: CreateCompanyFormState = {};

export type CreateCompanyFormProps = {
  variant?: "card" | "plain";
  /** Plain/dialog flow: closes dialog after user acknowledges success. */
  onDismissSuccess?: () => void;
};

export function CreateCompanyForm({ variant = "card", onDismissSuccess }: CreateCompanyFormProps = {}) {
  const router = useRouter();
  const [state, formAction] = useActionState(createCompanyAction, initialState);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (state.success) {
      setPassword("");
      setFormKey((k) => k + 1);
      router.refresh();
    }
  }, [state.success, router]);

  function generatePassword() {
    setPassword(generateTemporaryPassword(14));
  }

  const successBlock = state.success ? (
    <div className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-foreground">
      <p className="font-medium">Company created.</p>
      <p className="mt-1 text-muted-foreground">
        {state.emailSent
          ? "We sent the account email with the temporary password and set-password link."
          : "Account was saved but email could not be sent. Check RESEND_FROM_EMAIL and RESEND_API_KEY, or share credentials manually."}
      </p>
      {variant === "plain" && onDismissSuccess ? (
        <Button type="button" variant="secondary" className="mt-4 w-full sm:w-auto" onClick={onDismissSuccess}>
          Done
        </Button>
      ) : null}
    </div>
  ) : null;

  const showForm = !(state.success && variant === "plain");

  const formInner = (
    <form key={formKey} action={formAction} className={cn("space-y-4", variant === "card" ? "pt-2" : "")}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="companyName">Company name</Label>
          <Input
            id="companyName"
            name="companyName"
            required
            defaultValue={state.fields?.companyName}
            placeholder="Acme Inc."
            className="h-10 rounded-lg"
            aria-invalid={Boolean(state.errors?.companyName?.length)}
          />
          {state.errors?.companyName?.[0] ? (
            <p className="text-xs text-destructive">{state.errors.companyName[0]}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            required
            defaultValue={state.fields?.city}
            placeholder="Austin"
            className="h-10 rounded-lg"
            aria-invalid={Boolean(state.errors?.city?.length)}
          />
          {state.errors?.city?.[0] ? <p className="text-xs text-destructive">{state.errors.city[0]}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            required
            defaultValue={state.fields?.state}
            placeholder="TX"
            className="h-10 rounded-lg"
            aria-invalid={Boolean(state.errors?.state?.length)}
          />
          {state.errors?.state?.[0] ? <p className="text-xs text-destructive">{state.errors.state[0]}</p> : null}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="email">Company email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="off"
            defaultValue={state.fields?.email}
            placeholder="hr@company.com"
            className="h-10 rounded-lg"
            aria-invalid={Boolean(state.errors?.email?.length)}
          />
          {state.errors?.email?.[0] ? <p className="text-xs text-destructive">{state.errors.email[0]}</p> : null}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="password">Temporary password</Label>
            <Button type="button" variant="outline" size="sm" className="h-8 gap-1 rounded-lg text-xs" onClick={generatePassword}>
              <RefreshCw className="size-3.5" />
              Generate
            </Button>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty to auto-generate on submit"
              autoComplete="new-password"
              className="h-10 rounded-lg pr-10"
              aria-invalid={Boolean(state.errors?.password?.length)}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {state.errors?.password?.[0] ? (
            <p className="text-xs text-destructive">{state.errors.password[0]}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Minimum 8 characters if you type one; otherwise a password is generated.</p>
          )}
        </div>
      </div>

      {state.errors?.form?.[0] ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.errors.form[0]}</p>
      ) : null}

      <Button type="submit" className="rounded-lg">
        Create company & send email
      </Button>
    </form>
  );

  if (variant === "plain") {
    return (
      <div className="space-y-4">
        {successBlock}
        {showForm ? formInner : null}
      </div>
    );
  }

  return (
    <Card className="rounded-2xl border border-border/80 shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]">
      <CardHeader>
        <CardTitle className="text-lg">Add company</CardTitle>
        <CardDescription>
          Creates a company account and emails login details with a secure link to set a new password first.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {successBlock}
        {formInner}
      </CardContent>
    </Card>
  );
}
