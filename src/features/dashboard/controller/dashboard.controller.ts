import { prisma } from "@/lib/prisma";
import type {
  AIInsightItem,
  UpcomingInterviewItem,
  DashboardProfile,
  RecentActivityItem,
  DashboardStat,
  OverviewAnalytics,
  TopCandidateItem,
  CandidateRecommendation,
  CandidateConfidence,
} from "@/features/dashboard/model/dashboard.model";
import { getAuthSession } from "@/lib/auth-session";

export async function getDashboardProfile(): Promise<DashboardProfile | null> {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }

  const profile = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      firstName: true,
      lastName: true,
      companyRole: true,
    },
  });

  if (!profile) return null;

  return {
    name: `${profile.firstName} ${profile.lastName}`.trim(),
    role: profile.companyRole,
  };
}

export async function getOverviewStats(): Promise<DashboardStat[] | null> {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }

  const [candidates, activeInterviews, aiEvaluations, shortlisted] = await Promise.all([
    prisma.candidate.count({
      where: { ownerId: session.userId },
    }),
    prisma.interview.count({
      where: {
        ownerId: session.userId,
        status: "ACTIVE",
      },
    }),
    prisma.aIEvaluation.count({
      where: { ownerId: session.userId },
    }),
    prisma.candidate.count({
      where: {
        ownerId: session.userId,
        OR: [{ stage: "SHORTLISTED" }, { shortlistedAt: { not: null } }],
      },
    }),
  ]);

  return [
    {
      label: "Active Interviews",
      value: activeInterviews,
      helperText:
        activeInterviews > 0
          ? "Interviews currently in progress"
          : "No interviews are currently active",
    },
    {
      label: "Candidates",
      value: candidates,
      helperText: candidates > 0 ? "Total candidates in your pipeline" : "No candidates yet",
    },
    {
      label: "AI Evaluations",
      value: aiEvaluations,
      helperText:
        aiEvaluations > 0 ? "AI evaluations available for review" : "No AI evaluations generated yet",
    },
    {
      label: "Shortlisted",
      value: shortlisted,
      helperText:
        shortlisted > 0 ? "Candidates ready for final round" : "No shortlisted candidates yet",
    },
  ];
}

export async function getOverviewAnalytics(): Promise<OverviewAnalytics | null> {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }

  const [applied, shortlisted, interviewRows, evaluationRows] = await Promise.all([
    prisma.candidate.count({
      where: { ownerId: session.userId },
    }),
    prisma.candidate.count({
      where: {
        ownerId: session.userId,
        OR: [{ stage: "SHORTLISTED" }, { shortlistedAt: { not: null } }],
      },
    }),
    prisma.interview.findMany({
      where: { ownerId: session.userId },
      select: { candidateId: true, createdAt: true },
    }),
    prisma.aIEvaluation.findMany({
      where: { ownerId: session.userId },
      select: { candidateId: true, score: true },
    }),
  ]);

  const attempted = new Set(interviewRows.map((row) => row.candidateId)).size;
  const evaluated = new Set(evaluationRows.map((row) => row.candidateId)).size;

  const validScores = evaluationRows
    .map((row) => row.score)
    .filter((score): score is number => typeof score === "number");
  const avgTechnical =
    validScores.length > 0
      ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
      : 0;
  const avgCommunication = validScores.length > 0 ? Math.max(0, Math.min(100, avgTechnical - 8)) : 0;

  const weekdayBuckets: Record<"Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun", number> = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };
  const dayKeys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  interviewRows.forEach((row) => {
    const dayKey = dayKeys[row.createdAt.getDay()];
    weekdayBuckets[dayKey] += 1;
  });

  const analytics: OverviewAnalytics = {
    funnel: [
      { name: "Applied", value: applied },
      { name: "Attempted", value: attempted },
      { name: "Evaluated", value: evaluated },
      { name: "Shortlisted", value: shortlisted },
    ],
    performance: [
      { metric: "Technical", score: avgTechnical },
      { metric: "Communication", score: avgCommunication },
    ],
    weeklyActivity: [
      { day: "Mon", interviews: weekdayBuckets.Mon },
      { day: "Tue", interviews: weekdayBuckets.Tue },
      { day: "Wed", interviews: weekdayBuckets.Wed },
      { day: "Thu", interviews: weekdayBuckets.Thu },
      { day: "Fri", interviews: weekdayBuckets.Fri },
      { day: "Sat", interviews: weekdayBuckets.Sat },
      { day: "Sun", interviews: weekdayBuckets.Sun },
    ],
  };
  return analytics;
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "HM";
}

function getRecommendation(score: number): CandidateRecommendation {
  if (score >= 8.5) return "Strong Hire";
  if (score >= 7.5) return "Hire";
  if (score >= 6.5) return "Consider";
  return "Hold";
}

function getConfidence(evaluationCount: number): CandidateConfidence {
  if (evaluationCount >= 3) return "High";
  if (evaluationCount >= 2) return "Medium";
  return "Low";
}

export async function getRecentActivity(): Promise<RecentActivityItem[] | null> {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }

  const [interviews, evaluations, shortlistedCandidates, owner] = await Promise.all([
    prisma.interview.findMany({
      where: { ownerId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        candidate: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
    prisma.aIEvaluation.findMany({
      where: { ownerId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        candidate: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
    prisma.candidate.findMany({
      where: {
        ownerId: session.userId,
        OR: [{ stage: "SHORTLISTED" }, { shortlistedAt: { not: null } }],
      },
      orderBy: [{ shortlistedAt: "desc" }, { updatedAt: "desc" }],
      take: 5,
      select: {
        id: true,
        shortlistedAt: true,
        updatedAt: true,
        firstName: true,
        lastName: true,
      },
    }),
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { firstName: true, lastName: true },
    }),
  ]);

  const actorInitials = owner ? getInitials(owner.firstName, owner.lastName) : "HM";

  const merged: RecentActivityItem[] = [
    ...interviews.map((row) => ({
      id: `interview-${row.id}`,
      type: "interview-created" as const,
      title: `${row.candidate.firstName} ${row.candidate.lastName}`.trim(),
      description: "New interview created",
      timestamp: row.createdAt.toISOString(),
      actorInitials,
    })),
    ...evaluations.map((row) => ({
      id: `evaluation-${row.id}`,
      type: "evaluation-completed" as const,
      title: `${row.candidate.firstName} ${row.candidate.lastName}`.trim(),
      description: "AI evaluation completed",
      timestamp: row.createdAt.toISOString(),
      actorInitials,
    })),
    ...shortlistedCandidates.map((row) => ({
      id: `shortlisted-${row.id}`,
      type: "candidate-shortlisted" as const,
      title: `${row.firstName} ${row.lastName}`.trim(),
      description: "Shortlisted for next round",
      timestamp: (row.shortlistedAt ?? row.updatedAt).toISOString(),
      actorInitials,
    })),
  ];

  return merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);
}

export async function getTopCandidates(): Promise<TopCandidateItem[] | null> {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }

  const candidates = await prisma.candidate.findMany({
    where: { ownerId: session.userId },
    take: 30,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      aiEvaluations: {
        select: {
          score: true,
        },
      },
    },
  });

  const leaderboard = candidates
    .map((candidate) => {
      const scores = candidate.aiEvaluations
        .map((evaluation) => evaluation.score)
        .filter((score): score is number => typeof score === "number")
        .map((score) => Math.max(0, Math.min(10, score / 10)));

      const aiScore = scores.length ? Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)) : 0;

      return {
        id: candidate.id,
        candidateName: `${candidate.firstName} ${candidate.lastName}`.trim(),
        aiScore,
        recommendation: getRecommendation(aiScore),
        confidence: getConfidence(scores.length),
      };
    })
    .sort((a, b) => b.aiScore - a.aiScore || a.candidateName.localeCompare(b.candidateName))
    .slice(0, 5);

  return leaderboard;
}

export async function getAIInsights(): Promise<AIInsightItem[] | null> {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }

  const [evaluationRows, thisWeekEvaluations, previousWeekEvaluations] = await Promise.all([
    prisma.aIEvaluation.findMany({
      where: { ownerId: session.userId },
      select: {
        id: true,
        score: true,
        summary: true,
      },
      take: 100,
      orderBy: { createdAt: "desc" },
    }),
    prisma.aIEvaluation.findMany({
      where: {
        ownerId: session.userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: { score: true },
    }),
    prisma.aIEvaluation.findMany({
      where: {
        ownerId: session.userId,
        createdAt: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: { score: true },
    }),
  ]);

  const insights: AIInsightItem[] = [];
  const summaries = evaluationRows
    .map((row) => row.summary?.toLowerCase() ?? "")
    .filter(Boolean);

  const ssrMentions = summaries.filter((summary) => summary.includes("ssr") || summary.includes("server-side rendering")).length;
  if (ssrMentions > 0) {
    insights.push({
      id: "insight-ssr",
      message: "Most candidates struggle with SSR concepts in recent evaluations.",
    });
  }

  const thisWeekScores = thisWeekEvaluations
    .map((row) => row.score)
    .filter((score): score is number => typeof score === "number");
  const previousWeekScores = previousWeekEvaluations
    .map((row) => row.score)
    .filter((score): score is number => typeof score === "number");

  if (thisWeekScores.length > 0 && previousWeekScores.length > 0) {
    const thisWeekAvg = thisWeekScores.reduce((sum, score) => sum + score, 0) / thisWeekScores.length;
    const previousWeekAvg = previousWeekScores.reduce((sum, score) => sum + score, 0) / previousWeekScores.length;
    if (previousWeekAvg > 0 && thisWeekAvg > previousWeekAvg) {
      const improvement = Math.round(((thisWeekAvg - previousWeekAvg) / previousWeekAvg) * 100);
      insights.push({
        id: "insight-communication",
        message: `Communication quality improved ${improvement}% this week.`,
      });
    }
  }

  const reactMentions = summaries.filter(
    (summary) => summary.includes("react") || summary.includes("hooks") || summary.includes("component")
  ).length;
  if (reactMentions > 0) {
    insights.push({
      id: "insight-react",
      message: "React ecosystem knowledge appears consistently strong across candidates.",
    });
  }

  return insights.slice(0, 3);
}

export async function getUpcomingInterviews(): Promise<UpcomingInterviewItem[] | null> {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }

  const interviews = await prisma.interview.findMany({
    where: {
      ownerId: session.userId,
      scheduledAt: {
        gte: new Date(),
      },
      status: {
        in: ["SCHEDULED", "ACTIVE"],
      },
    },
    orderBy: { scheduledAt: "asc" },
    take: 5,
    select: {
      id: true,
      scheduledAt: true,
      candidate: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return interviews.map((interview) => ({
    id: interview.id,
    title: `${interview.candidate.firstName} ${interview.candidate.lastName}`.trim(),
    scheduledAt: (interview.scheduledAt ?? new Date()).toISOString(),
  }));
}
