"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import type { CompaniesListRow } from "@/features/companies/controller/create-company.controller";
import {
  updateCompanyAction,
  type UpdateCompanyFormState,
} from "@/features/companies/controller/manage-company.controller";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: UpdateCompanyFormState = {};

type EditCompanyDialogProps = {
  row: CompaniesListRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditCompanyDialog({ row, open, onOpenChange }: EditCompanyDialogProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(updateCompanyAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
      router.refresh();
    }
  }, [state.success, onOpenChange, router]);

  if (!row) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit company</DialogTitle>
          <DialogDescription>Update details for {row.companyName}. Leave password blank to keep the current one.</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="companyId" value={row.id} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor={`edit-companyName-${row.id}`}>Company name</Label>
              <Input
                id={`edit-companyName-${row.id}`}
                name="companyName"
                required
                defaultValue={state.fields?.companyName ?? row.companyName}
                className="h-10 rounded-lg"
                aria-invalid={Boolean(state.errors?.companyName?.length)}
              />
              {state.errors?.companyName?.[0] ? (
                <p className="text-xs text-destructive">{state.errors.companyName[0]}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`edit-city-${row.id}`}>City</Label>
              <Input
                id={`edit-city-${row.id}`}
                name="city"
                required
                defaultValue={state.fields?.city ?? row.city}
                className="h-10 rounded-lg"
                aria-invalid={Boolean(state.errors?.city?.length)}
              />
              {state.errors?.city?.[0] ? <p className="text-xs text-destructive">{state.errors.city[0]}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`edit-state-${row.id}`}>State</Label>
              <Input
                id={`edit-state-${row.id}`}
                name="state"
                required
                defaultValue={state.fields?.state ?? row.state}
                className="h-10 rounded-lg"
                aria-invalid={Boolean(state.errors?.state?.length)}
              />
              {state.errors?.state?.[0] ? <p className="text-xs text-destructive">{state.errors.state[0]}</p> : null}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor={`edit-email-${row.id}`}>Company email</Label>
              <Input
                id={`edit-email-${row.id}`}
                name="email"
                type="email"
                required
                autoComplete="off"
                defaultValue={state.fields?.email ?? row.email}
                className="h-10 rounded-lg"
                aria-invalid={Boolean(state.errors?.email?.length)}
              />
              {state.errors?.email?.[0] ? <p className="text-xs text-destructive">{state.errors.email[0]}</p> : null}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor={`edit-password-${row.id}`}>New password (optional)</Label>
              <div className="relative">
                <Input
                  id={`edit-password-${row.id}`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Leave blank to keep current password"
                  className="h-10 rounded-lg pr-11"
                  aria-invalid={Boolean(state.errors?.password?.length)}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-2 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4 shrink-0" /> : <Eye className="size-4 shrink-0" />}
                </button>
              </div>
              {state.errors?.password?.[0] ? (
                <p className="text-xs text-destructive">{state.errors.password[0]}</p>
              ) : (
                <p className="text-xs text-muted-foreground">At least 8 characters if you set a new password.</p>
              )}
            </div>
          </div>

          {state.errors?.form?.[0] ? (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.errors.form[0]}</p>
          ) : null}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
