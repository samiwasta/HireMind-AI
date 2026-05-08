"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  candidateRegistrationAction,
  type CandidateRegistrationFormState,
} from "@/features/candidates/controller/candidate-register.controller";
import {
  CandidateResumeUploadField,
  type ResumeUploadValue,
} from "@/features/candidates/view/candidate-resume-upload-field";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: CandidateRegistrationFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={pending}>
      {pending ? "Creating account..." : "Create candidate account"}
    </Button>
  );
}

export function CandidateRegistrationForm() {
  const [state, formAction] = useActionState(candidateRegistrationAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [resume, setResume] = useState<ResumeUploadValue | null>(null);

  return (
    <Card className="w-full max-w-lg rounded-2xl border border-border shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <Logo className="justify-center" textClassName="text-primary" />
        <CardTitle className="text-2xl font-semibold text-foreground">Candidate registration</CardTitle>
        <CardDescription>Create your profile and upload your resume to get started.</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5" noValidate>
          <input type="hidden" name="resumeUrl" value={resume?.url ?? ""} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Jane"
                defaultValue={state.fields?.firstName ?? ""}
                aria-invalid={Boolean(state.errors?.firstName?.length)}
                className="h-11 bg-background px-3"
                required
              />
              {state.errors?.firstName?.[0] ? (
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
              {state.errors?.lastName?.[0] ? (
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
              placeholder="you@example.com"
              defaultValue={state.fields?.email ?? ""}
              aria-invalid={Boolean(state.errors?.email?.length)}
              className="h-11 bg-background px-3"
              required
            />
            {state.errors?.email?.[0] ? <p className="text-xs text-danger">{state.errors.email[0]}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                aria-invalid={Boolean(state.errors?.password?.length)}
                className="h-11 bg-background px-3 pr-11"
                required
                minLength={8}
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
            {state.errors?.password?.[0] ? (
              <p className="text-xs text-danger">{state.errors.password[0]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume-upload">Resume (PDF)</Label>
            <CandidateResumeUploadField
              id="resume-upload"
              value={resume}
              onChange={setResume}
              errorText={state.errors?.resumeUrl?.[0]}
            />
          </div>

          <SubmitButton />

          {state.errors?.form?.[0] ? (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-center text-xs text-danger">{state.errors.form[0]}</p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
