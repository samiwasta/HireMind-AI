"use client";

import { Eye, EyeOff, RefreshCcw } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction, type RegisterFormState } from "@/features/auth/controller/register.controller";

const initialState: RegisterFormState = {
  success: false,
};

function buildGeneratedPassword(length = 14) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function RegisterSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={pending}>
      {pending ? "Registering..." : "Register user"}
    </Button>
  );
}

export function RegistrationForm() {
  const [state, formAction] = useActionState(registerAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [setPasswordAfterFirstLogin, setSetPasswordAfterFirstLogin] = useState(false);

  const passwordToRender = useMemo(
    () => (passwordValue.length ? passwordValue : ""),
    [passwordValue]
  );

  return (
    <Card className="w-full max-w-lg rounded-2xl border border-border shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <Logo className="justify-center" textClassName="text-primary" />
        <CardTitle className="text-2xl font-semibold text-foreground">Register user</CardTitle>
        <CardDescription>Create a new user account in your organization.</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                defaultValue={state.fields?.firstName ?? ""}
                aria-invalid={Boolean(state.errors?.firstName?.length)}
                className="h-11 bg-background px-3"
                required
              />
              {state.errors?.firstName?.length ? (
                <p className="text-xs text-danger">{state.errors.firstName[0]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                defaultValue={state.fields?.lastName ?? ""}
                aria-invalid={Boolean(state.errors?.lastName?.length)}
                className="h-11 bg-background px-3"
                required
              />
              {state.errors?.lastName?.length ? (
                <p className="text-xs text-danger">{state.errors.lastName[0]}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="john@company.com"
              defaultValue={state.fields?.email ?? ""}
              aria-invalid={Boolean(state.errors?.email?.length)}
              className="h-11 bg-background px-3"
              required
            />
            {state.errors?.email?.length ? (
              <p className="text-xs text-danger">{state.errors.email[0]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setPasswordValue(buildGeneratedPassword())}
              >
                <RefreshCcw className="size-3.5" />
                Auto generate
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={passwordToRender}
                onChange={(event) => setPasswordValue(event.target.value)}
                placeholder="Enter a secure password"
                aria-invalid={Boolean(state.errors?.password?.length)}
                className="h-11 bg-background px-3 pr-11"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {showPassword ? <EyeOff className="size-4 shrink-0" /> : <Eye className="size-4 shrink-0" />}
              </button>
            </div>
            {state.errors?.password?.length ? (
              <p className="text-xs text-danger">{state.errors.password[0]}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyRole">Company role</Label>
              <Input
                id="companyRole"
                name="companyRole"
                placeholder="Recruiter"
                defaultValue={state.fields?.companyRole ?? ""}
                aria-invalid={Boolean(state.errors?.companyRole?.length)}
                className="h-11 bg-background px-3"
                required
              />
              {state.errors?.companyRole?.length ? (
                <p className="text-xs text-danger">{state.errors.companyRole[0]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="privilageRole">Privilage role</Label>
              <Input
                id="privilageRole"
                name="privilageRole"
                placeholder="Admin"
                defaultValue={state.fields?.privilageRole ?? ""}
                aria-invalid={Boolean(state.errors?.privilageRole?.length)}
                className="h-11 bg-background px-3"
                required
              />
              {state.errors?.privilageRole?.length ? (
                <p className="text-xs text-danger">{state.errors.privilageRole[0]}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-md border border-border bg-secondary/35 p-3">
            <input
              type="checkbox"
              id="setPasswordAfterFirstLogin"
              name="setPasswordAfterFirstLogin"
              value="true"
              checked={setPasswordAfterFirstLogin}
              onChange={(event) => setSetPasswordAfterFirstLogin(event.target.checked)}
              className="mt-1 size-4 rounded border border-input accent-primary"
            />
            <div className="space-y-1">
              <Label htmlFor="setPasswordAfterFirstLogin" className="text-sm">
                Ask user to set password on first login
              </Label>
              <p className="text-xs text-muted-foreground">
                If enabled, this user will be required to update the password after first sign in.
              </p>
            </div>
          </div>
          <RegisterSubmitButton />

          {state.errors?.form?.length ? (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-center text-xs text-danger">
              {state.errors.form[0]}
            </p>
          ) : null}

          {state.success ? (
            <p className="rounded-md bg-success/10 px-3 py-2 text-center text-xs text-success">
              {state.emailSent
                ? "User registered successfully. Credentials email has been sent."
                : "User registered successfully. Credentials email could not be sent."}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
