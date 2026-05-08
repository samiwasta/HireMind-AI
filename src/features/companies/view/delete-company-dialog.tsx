"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import type { CompaniesListRow } from "@/features/companies/controller/create-company.controller";
import {
  deleteCompanyAction,
  type DeleteCompanyState,
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

const initialDeleteState: DeleteCompanyState = {};

type DeleteCompanyDialogProps = {
  row: CompaniesListRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteCompanyDialog({ row, open, onOpenChange }: DeleteCompanyDialogProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(deleteCompanyAction, initialDeleteState);

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete company</DialogTitle>
          <DialogDescription>
            This permanently removes <span className="font-medium text-foreground">{row.companyName}</span> and its login.
            This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="companyId" value={row.id} />
          {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
