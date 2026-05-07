export type DashboardNavItem = {
  title: string;
  href: string;
  icon: "overview" | "interviews" | "candidates" | "ai-evaluations" | "analytics" | "question-bank" | "team" | "settings";
  isActive?: boolean;
};

export type DashboardProfile = {
  name: string;
  role: string;
};

export const mainNavigationItems: DashboardNavItem[] = [
  { title: "Overview", href: "/overview", icon: "overview", isActive: true },
  { title: "Interviews", href: "#", icon: "interviews" },
  { title: "Candidates", href: "#", icon: "candidates" },
  { title: "AI Evaluations", href: "#", icon: "ai-evaluations" },
  { title: "Analytics", href: "#", icon: "analytics" },
];

export const secondaryNavigationItems: DashboardNavItem[] = [
  { title: "Question Bank", href: "#", icon: "question-bank" },
  { title: "Team", href: "#", icon: "team" },
  { title: "Settings", href: "#", icon: "settings" },
];
