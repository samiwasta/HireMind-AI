"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useActionState } from "react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction, type LoginFormState } from "@/features/auth/controller/login.controller";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginFormState = {
  success: false,
};

function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={pending}>
      {pending ? "Signing in..." : "Login"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="w-full max-w-md rounded-2xl border border-border shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <Logo className="justify-center" textClassName="text-primary" />
        <CardTitle className="text-2xl font-semibold text-foreground">Welcome back</CardTitle>
        <CardDescription>
          Sign in to continue building your hiring workflow.
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
              defaultValue={state.fields?.email ?? ""}
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={Boolean(state.errors?.password?.length)}
                aria-describedby={state.errors?.password?.length ? "password-error" : undefined}
                className="h-11 bg-background px-3 pr-10"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {state.errors?.password?.length ? (
              <p id="password-error" className="text-xs text-danger">
                {state.errors.password[0]}
              </p>
            ) : null}
          </div>

          <LoginSubmitButton />

          {state.errors?.form?.length ? (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-center text-xs text-danger">
              {state.errors.form[0]}
            </p>
          ) : null}

          {state.success ? (
            <p className="rounded-md bg-success/10 px-3 py-2 text-center text-xs text-success">
              Login successful.
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
