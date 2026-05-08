"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardSidebar } from "@/features/dashboard/view/dashboard-sidebar";
import type { DashboardProfile } from "@/features/dashboard/model/dashboard.model";

type DashboardShellProps = {
  profile: DashboardProfile;
  pageTitle?: string;
  greetingTitle?: string;
  greetingDescription?: string;
  showWorkspaceGreeting?: boolean;
  /** When false, the header "Create Interview" action is hidden (e.g. Companies page). */
  showHeaderCreateInterview?: boolean;
  children?: ReactNode;
};

export function DashboardShell({
  profile,
  pageTitle = "Dashboard",
  greetingTitle = "Welcome to HireMind Dashboard",
  greetingDescription = "Your sidebar layout is ready. You can now plug your modules here.",
  showWorkspaceGreeting = true,
  showHeaderCreateInterview = true,
  children,
}: DashboardShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar profile={profile} />

        <SidebarInset>
          <header className="flex h-14 items-center justify-between border-b border-border/80 bg-card/70 px-4 backdrop-blur-sm">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="ml-3 text-sm font-semibold text-foreground">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
              {showHeaderCreateInterview ? (
                <motion.div
                  whileHover={{ y: -1, scale: 1.01 }}
                  whileTap={{ y: 0, scale: 0.99 }}
                  transition={{ duration: 0.16 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-lg border-primary/25 bg-primary/5 px-3.5 text-primary hover:bg-primary/10 hover:text-primary-hover"
                  >
                    <Plus className="size-4" />
                    Create Interview
                  </Button>
                </motion.div>
              ) : null}
            </div>
          </header>
          <main className="flex-1 bg-linear-to-b from-background to-secondary/20 p-6">
            {showWorkspaceGreeting ? (
              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]">
                <h2 className="text-2xl font-semibold text-foreground">{greetingTitle}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{greetingDescription}</p>
              </div>
            ) : null}
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
