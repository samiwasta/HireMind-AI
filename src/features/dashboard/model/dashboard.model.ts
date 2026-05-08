export type DashboardNavItem = {
  title: string;
  href: string;
  icon:
    | "overview"
    | "interviews"
    | "candidates"
    | "companies"
    | "ai-evaluations"
    | "analytics"
    | "question-bank"
    | "team"
    | "settings";
  isActive?: boolean;
};

export type DashboardProfile = {
  name: string;
  role: string;
};

export type DashboardStat = {
  label: "Active Interviews" | "Candidates" | "AI Evaluations" | "Shortlisted";
  value: number;
  helperText: string;
};

export type FunnelStage = {
  name: "Applied" | "Attempted" | "Evaluated" | "Shortlisted";
  value: number;
};

export type CandidatePerformancePoint = {
  metric: "Technical" | "Communication";
  score: number;
};

export type WeeklyActivityPoint = {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  interviews: number;
};

export type OverviewAnalytics = {
  funnel: FunnelStage[];
  performance: CandidatePerformancePoint[];
  weeklyActivity: WeeklyActivityPoint[];
};

export type ActivityType = "interview-created" | "evaluation-completed" | "candidate-shortlisted";

export type RecentActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  actorInitials: string;
};

export type CandidateRecommendation = "Strong Hire" | "Hire" | "Consider" | "Hold";
export type CandidateConfidence = "High" | "Medium" | "Low";

export type TopCandidateItem = {
  id: string;
  candidateName: string;
  aiScore: number;
  recommendation: CandidateRecommendation;
  confidence: CandidateConfidence;
};

export type AIInsightItem = {
  id: string;
  message: string;
};

export type UpcomingInterviewItem = {
  id: string;
  title: string;
  scheduledAt: string;
};

export const mainNavigationItems: DashboardNavItem[] = [
  { title: "Overview", href: "/overview", icon: "overview", isActive: true },
  { title: "Interviews", href: "/interviews", icon: "interviews" },
  { title: "Candidates", href: "/candidates", icon: "candidates" },
  { title: "Companies", href: "/companies", icon: "companies" },
  { title: "AI Evaluations", href: "/ai-evaluations", icon: "ai-evaluations" },
  { title: "Analytics", href: "/analytics", icon: "analytics" },
];

export const secondaryNavigationItems: DashboardNavItem[] = [
  { title: "Question Bank", href: "#", icon: "question-bank" },
  { title: "Team", href: "#", icon: "team" },
  { title: "Settings", href: "#", icon: "settings" },
];
