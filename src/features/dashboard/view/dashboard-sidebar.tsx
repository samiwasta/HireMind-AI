"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  BookText,
  Building2,
  Sparkles,
  Home,
  LogOut,
  Settings,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  mainNavigationItems,
  secondaryNavigationItems,
  type DashboardNavItem,
  type DashboardProfile,
} from "@/features/dashboard/model/dashboard.model";

const iconMap: Record<DashboardNavItem["icon"], LucideIcon> = {
  overview: Home,
  interviews: Video,
  candidates: Users,
  companies: Building2,
  "ai-evaluations": Sparkles,
  analytics: BarChart3,
  "question-bank": BookText,
  team: Users,
  settings: Settings,
};

type DashboardSidebarProps = {
  profile: DashboardProfile;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const pathname = usePathname();
  const initials = getInitials(profile.name);

  function navActive(href: string) {
    if (href === "/overview") {
      return pathname === "/overview" || pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <Sidebar variant="inset" collapsible="none">
      <SidebarHeader>
        <div className="rounded-xl border border-sidebar-border/70 bg-linear-to-r from-sidebar-primary/12 via-sidebar-primary/6 to-transparent px-3 py-3">
          <Logo textClassName="text-sidebar-foreground tracking-[0.2em]" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <p className="px-2 text-[11px] font-semibold tracking-[0.16em] text-sidebar-foreground/55 uppercase">
            Main Navigation
          </p>
          <SidebarGroupContent>
            <SidebarMenu className="mt-1">
              {mainNavigationItems.map((item) => {
                const Icon = iconMap[item.icon];
                const active = navActive(item.href);
                return (
                  <SidebarMenuItem key={item.title}>
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ x: 2 }}
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className="rounded-lg data-[active=true]:bg-sidebar-primary/15 data-[active=true]:text-sidebar-foreground data-[active=true]:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-sidebar-primary)_45%,transparent)] hover:bg-sidebar-accent/80"
                      >
                        <Link href={item.href}>
                          <Icon />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </motion.div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-1.5" />

        <SidebarGroup>
          <p className="px-2 text-[11px] font-semibold tracking-[0.16em] text-sidebar-foreground/55 uppercase">
            Workspace
          </p>
          <SidebarGroupContent>
            <SidebarMenu className="mt-1">
              {secondaryNavigationItems.map((item) => {
                const Icon = iconMap[item.icon];
                return (
                  <SidebarMenuItem key={item.title}>
                    <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.16 }}>
                      <SidebarMenuButton asChild className="rounded-lg hover:bg-sidebar-accent/80">
                        <Link href={item.href}>
                          <Icon />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </motion.div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.16 }}>
              <SidebarMenuButton
                asChild
                className="rounded-lg text-danger hover:bg-danger/10 hover:text-danger"
              >
                <Link href="/logout">
                  <LogOut />
                  <span className="font-medium">Logout</span>
                </Link>
              </SidebarMenuButton>
            </motion.div>
          </SidebarMenuItem>
        </SidebarMenu>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="rounded-xl border border-sidebar-border/80 bg-sidebar-accent/45 p-2.5 shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-sidebar-border)_70%,transparent)]"
        >
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary/20 text-xs font-semibold tracking-wide text-sidebar-foreground">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{profile.name}</p>
              <p className="text-xs text-sidebar-foreground/70">{profile.role}</p>
            </div>
          </div>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  );
}
