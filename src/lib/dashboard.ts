// Server-side aggregations for the dashboard. All resilient to a missing DB.
import { createClient } from "@/lib/supabase/server";
import { projectStatusLabel } from "@/lib/labels";
import type { ProjectStatus } from "@/lib/types/db";

export interface WeeklyTrendPoint {
  week: string;
  planned: number;
  actual: number;
}
export interface StatusSlice {
  status: string;
  count: number;
}
export interface DeadlineRow {
  id: string;
  name: string;
  deadline: string;
  artist: string;
}
export interface RiskRow {
  id: string;
  artist: string;
  week: string;
  planned: number;
  actual: number;
  ratio: number;
}

async function rows<T>(table: string, select: string): Promise<T[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from(table).select(select);
    return (data as unknown as T[]) ?? [];
  } catch {
    return [];
  }
}

export async function getWeeklyTrend(): Promise<WeeklyTrendPoint[]> {
  const data = await rows<{ week_start: string; planned_hours: number; actual_hours: number }>(
    "weekly_plans",
    "week_start, planned_hours, actual_hours",
  );
  const byWeek = new Map<string, { planned: number; actual: number }>();
  for (const r of data) {
    const cur = byWeek.get(r.week_start) ?? { planned: 0, actual: 0 };
    cur.planned += Number(r.planned_hours);
    cur.actual += Number(r.actual_hours);
    byWeek.set(r.week_start, cur);
  }
  return [...byWeek.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([week, v]) => ({ week: week.slice(5), planned: v.planned, actual: v.actual }));
}

export async function getProjectStatus(): Promise<StatusSlice[]> {
  const data = await rows<{ status: ProjectStatus }>("projects", "status");
  const counts = new Map<ProjectStatus, number>();
  for (const r of data) counts.set(r.status, (counts.get(r.status) ?? 0) + 1);
  return [...counts.entries()].map(([status, count]) => ({
    status: projectStatusLabel[status],
    count,
  }));
}

export async function getUpcomingDeadlines(): Promise<DeadlineRow[]> {
  const data = await rows<{
    id: string; name: string; deadline: string | null; status: string;
    artists: { name: string } | null;
  }>("projects", "id, name, deadline, status, artists(name)");

  const today = new Date().toISOString().slice(0, 10);
  const horizon = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);

  return data
    .filter((p) => p.deadline && p.deadline >= today && p.deadline <= horizon)
    .filter((p) => p.status !== "done" && p.status !== "cancelled")
    .sort((a, b) => (a.deadline! < b.deadline! ? -1 : 1))
    .map((p) => ({ id: p.id, name: p.name, deadline: p.deadline!, artist: p.artists?.name ?? "-" }));
}

export async function getAtRisk(): Promise<RiskRow[]> {
  const data = await rows<{
    id: string; week_start: string; planned_hours: number; actual_hours: number;
    artists: { name: string } | null;
  }>("weekly_plans", "id, week_start, planned_hours, actual_hours, artists(name)");

  return data
    .filter((w) => Number(w.planned_hours) > 0)
    .map((w) => ({
      id: w.id,
      artist: w.artists?.name ?? "-",
      week: w.week_start,
      planned: Number(w.planned_hours),
      actual: Number(w.actual_hours),
      ratio: Number(w.actual_hours) / Number(w.planned_hours),
    }))
    .filter((w) => w.ratio < 0.6)
    .sort((a, b) => a.ratio - b.ratio)
    .slice(0, 8);
}
