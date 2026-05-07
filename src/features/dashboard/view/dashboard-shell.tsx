import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardSidebar } from "@/features/dashboard/view/dashboard-sidebar";
import type { DashboardProfile } from "@/features/dashboard/model/dashboard.model";

type DashboardShellProps = {
  profile: DashboardProfile;
  pageTitle?: string;
};

export function DashboardShell({ profile, pageTitle = "Dashboard" }: DashboardShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar profile={profile} />

        <SidebarInset>
          <header className="flex h-14 items-center border-b border-border/80 bg-card/70 px-4 backdrop-blur-sm">
            <SidebarTrigger />
            <h1 className="ml-3 text-sm font-semibold text-foreground">{pageTitle}</h1>
          </header>
          <main className="flex-1 bg-linear-to-b from-background to-secondary/20 p-6">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]">
              <h2 className="text-xl font-semibold text-foreground">Welcome to HireMind Dashboard</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your sidebar layout is ready. You can now plug your modules here.
              </p>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
