"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import type { CompaniesListRow } from "@/features/companies/controller/create-company.controller";
import { Button } from "@/components/ui/button";
import { DeleteCompanyDialog } from "@/features/companies/view/delete-company-dialog";
import { EditCompanyDialog } from "@/features/companies/view/edit-company-dialog";

type CompaniesTableProps = {
  rows: CompaniesListRow[];
};

export function CompaniesTable({ rows }: CompaniesTableProps) {
  const [editRow, setEditRow] = useState<CompaniesListRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<CompaniesListRow | null>(null);
  const [editNonce, setEditNonce] = useState(0);

  function startEdit(row: CompaniesListRow) {
    setEditRow(row);
    setEditNonce((n) => n + 1);
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border/70 bg-secondary/30 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No companies yet. Use Add Company to create one.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-secondary/25">
                  <td className="px-4 py-3 font-medium text-foreground">{row.companyName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.city}, {row.state}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(row.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={`Edit ${row.companyName}`}
                        onClick={() => startEdit(row)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Delete ${row.companyName}`}
                        onClick={() => setDeleteRow(row)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editRow ? (
        <EditCompanyDialog
          key={`${editRow.id}-${editNonce}`}
          row={editRow}
          open
          onOpenChange={(v) => {
            if (!v) setEditRow(null);
          }}
        />
      ) : null}

      {deleteRow ? (
        <DeleteCompanyDialog
          key={deleteRow.id}
          row={deleteRow}
          open
          onOpenChange={(v) => {
            if (!v) setDeleteRow(null);
          }}
        />
      ) : null}
    </>
  );
}
