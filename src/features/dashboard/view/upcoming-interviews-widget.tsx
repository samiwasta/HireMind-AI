"use client";

import { useMemo, useState } from "react";
import { CalendarClock, CalendarDays, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { UpcomingInterviewItem } from "@/features/dashboard/model/dashboard.model";
import { cn } from "@/lib/utils";

type UpcomingInterviewsWidgetProps = {
  interviews: UpcomingInterviewItem[];
  className?: string;
};

function formatScheduleLabel(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getDateKey(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function UpcomingInterviewsWidget({ interviews, className }: UpcomingInterviewsWidgetProps) {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const interviewsByDate = useMemo(() => {
    const grouped = new Map<string, UpcomingInterviewItem[]>();
    for (const interview of interviews) {
      const key = getDateKey(interview.scheduledAt);
      const existing = grouped.get(key) ?? [];
      existing.push(interview);
      grouped.set(key, existing);
    }
    return grouped;
  }, [interviews]);

  const sortedDateKeys = useMemo(() => Array.from(interviewsByDate.keys()).sort(), [interviewsByDate]);
  const calendarBaseDate = useMemo(() => {
    if (!sortedDateKeys[0]) {
      return new Date();
    }
    return new Date(`${sortedDateKeys[0]}T00:00:00`);
  }, [sortedDateKeys]);

  const daysInMonth = new Date(calendarBaseDate.getFullYear(), calendarBaseDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarBaseDate.getFullYear(), calendarBaseDate.getMonth(), 1).getDay();

  return (
    <section
      className={cn(
        "flex h-[340px] flex-col rounded-2xl border border-border/80 bg-card p-4 shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-border)_70%,transparent)]",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="grid size-8 place-items-center rounded-full bg-secondary">
          <CalendarClock className="size-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">Upcoming Interviews</h3>
          <p className="text-xs text-muted-foreground">Scheduled interviews ahead</p>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border/70 bg-secondary/30 p-0.5">
          <Button
            type="button"
            size="icon"
            variant={viewMode === "list" ? "default" : "ghost"}
            className="size-6"
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <List className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant={viewMode === "calendar" ? "default" : "ghost"}
            className="size-6"
            onClick={() => setViewMode("calendar")}
            aria-label="Calendar view"
          >
            <CalendarDays className="size-3.5" />
          </Button>
        </div>
      </div>

      {interviews.length ? (
        viewMode === "list" ? (
          <div className="flex-1 divide-y divide-border/60 overflow-y-auto pr-1">
            {interviews.map((interview) => (
              <article key={interview.id} className="py-2.5 first:pt-0 last:pb-0">
                <p className="truncate text-sm font-medium text-foreground">{interview.title}</p>
                <p className="text-xs text-muted-foreground">{formatScheduleLabel(interview.scheduledAt)}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="mb-2 text-xs font-medium text-muted-foreground">
              {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(calendarBaseDate)}
            </div>
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                <span key={`empty-${index}`} className="block h-6" />
              ))}
              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const key = `${calendarBaseDate.getFullYear()}-${String(calendarBaseDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const hasInterview = interviewsByDate.has(key);
                const dayInterviews = interviewsByDate.get(key) ?? [];
                const dayButton = (
                  <button
                    key={key}
                    type="button"
                    className={cn(
                      "relative h-7 rounded text-[11px] transition-colors",
                      hasInterview ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-muted-foreground/60 hover:bg-secondary"
                    )}
                  >
                    {day}
                    {hasInterview ? <span className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary" /> : null}
                  </button>
                );
                return (
                  <Tooltip key={key}>
                    <TooltipTrigger asChild>{dayButton}</TooltipTrigger>
                    {hasInterview ? (
                      <TooltipContent sideOffset={8} className="max-w-52">
                        <div className="space-y-1">
                          {dayInterviews.map((interview) => (
                            <div key={interview.id}>
                              <p className="font-medium">{interview.title}</p>
                              <p className="text-[11px] opacity-80">{formatScheduleLabel(interview.scheduledAt)}</p>
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    ) : (
                      <TooltipContent sideOffset={8}>No interviews</TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </div>
          </div>
        )
      ) : (
        <div className="grid h-full place-items-center rounded-lg border border-dashed border-border/70 bg-secondary/25 px-4 text-center text-xs text-muted-foreground">
          No upcoming interviews scheduled.
        </div>
      )}
    </section>
  );
}
