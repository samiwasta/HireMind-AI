"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import type { CompaniesListRow } from "@/features/companies/controller/create-company.controller";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompaniesTable } from "@/features/companies/view/companies-table";
import { CreateCompanyForm } from "@/features/companies/view/create-company-form";

type CompaniesPageContentProps = {
  rows: CompaniesListRow[];
};

export function CompaniesPageContent({ rows }: CompaniesPageContentProps) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setFormKey((k) => k + 1);
    }
  }

  return (
    <div className="mt-1 space-y-8">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Company accounts</h2>
          <Button
            type="button"
            size="sm"
            className="h-9 gap-1.5 rounded-lg"
            onClick={() => handleOpenChange(true)}
          >
            <Plus className="size-4" />
            Add Company
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a company account, share the generated password, and we email a link to set a new password first.
        </p>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add company</DialogTitle>
            <DialogDescription>
              Creates a company account and emails login details with a secure link to set a new password first.
            </DialogDescription>
          </DialogHeader>
          <CreateCompanyForm key={formKey} variant="plain" onDismissSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Companies you added</h3>
        <CompaniesTable rows={rows} />
      </div>
    </div>
  );
}
