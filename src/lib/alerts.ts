// Rule-based alerts derived from current data. Works in demo and live mode.
// This is the Phase 4 automation logic without cron/persistence — alerts are
// computed on read. A later phase can snapshot these into a notifications table.
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoArtists, demoProjects, demoWeekly, demoDaily } from "@/lib/demo";

export type Severity = "high" | "medium" | "low";

export interface Alert {
  id: string;
  severity: Severity;
  kind: string;
  title: string;
  detail: string;
  href: string;
}

const DAY = 864e5;
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (n: number) => new Date(Date.now() + n * DAY).toISOString().slice(0, 10);

interface ProjectRow { id: string; name: string; deadline: string | null; status: string; artists: { name: string } | null }
interface WeeklyRow { id: string; week_start: string; planned_hours: number; actual_hours: number; artists: { name: string } | null }
interface ArtistRow { id: string; name: string }
interface DailyRow { artist_id: string; log_date: string }

async function fetchData() {
  if (!isSupabaseConfigured()) {
    return {
      projects: demoProjects as unknown as ProjectRow[],
      weekly: demoWeekly as unknown as WeeklyRow[],
      artists: demoArtists as unknown as ArtistRow[],
      daily: demoDaily as unknown as DailyRow[],
    };
  }
  try {
    const supabase = await createClient();
    const [projects, weekly, artists, daily] = await Promise.all([
      supabase.from("projects").select("id, name, deadline, status, artists(name)"),
      supabase.from("weekly_plans").select("id, week_start, planned_hours, actual_hours, artists(name)"),
      supabase.from("artists").select("id, name"),
      supabase.from("daily_logs").select("artist_id, log_date"),
    ]);
    return {
      projects: (projects.data as unknown as ProjectRow[]) ?? [],
      weekly: (weekly.data as unknown as WeeklyRow[]) ?? [],
      artists: (artists.data as unknown as ArtistRow[]) ?? [],
      daily: (daily.data as unknown as DailyRow[]) ?? [],
    };
  } catch {
    return { projects: [], weekly: [], artists: [], daily: [] };
  }
}

export async function getAlerts(): Promise<Alert[]> {
  const { projects, weekly, artists, daily } = await fetchData();
  const alerts: Alert[] = [];
  const now = today();
  const in3 = addDays(3);

  // Rule 1: deadline within 3 days
  for (const p of projects) {
    if (!p.deadline || p.status === "done" || p.status === "cancelled") continue;
    if (p.deadline >= now && p.deadline <= in3) {
      alerts.push({
        id: `deadline-${p.id}`, severity: "high", kind: "Teslim",
        title: `Teslim yaklasiyor: ${p.name}`,
        detail: `${p.artists?.name ?? "-"} · son tarih ${p.deadline}`,
        href: "/dashboard/projects",
      });
    }
  }

  // Rule 2: weekly hours under 60%
  for (const w of weekly) {
    const planned = Number(w.planned_hours);
    if (planned <= 0) continue;
    const ratio = Number(w.actual_hours) / planned;
    if (ratio < 0.6) {
      alerts.push({
        id: `risk-${w.id}`, severity: "medium", kind: "Saat riski",
        title: `Dusuk saat: ${w.artists?.name ?? "-"}`,
        detail: `${w.actual_hours}/${planned} sa (%${Math.round(ratio * 100)}) · ${w.week_start}`,
        href: "/dashboard/weekly",
      });
    }
  }

  // Rule 3: no daily log in last 10 days
  const lastLog = new Map<string, string>();
  for (const d of daily) {
    const cur = lastLog.get(d.artist_id);
    if (!cur || d.log_date > cur) lastLog.set(d.artist_id, d.log_date);
  }
  const cutoff = addDays(-10);
  for (const a of artists) {
    const last = lastLog.get(a.id);
    if (!last || last < cutoff) {
      alerts.push({
        id: `idle-${a.id}`, severity: "medium", kind: "Giris yok",
        title: `10+ gun kayit yok: ${a.name}`,
        detail: last ? `son kayit ${last}` : "hic gunluk kayit yok",
        href: "/dashboard/daily",
      });
    }
  }

  const order: Record<Severity, number> = { high: 0, medium: 1, low: 2 };
  return alerts.sort((x, y) => order[x.severity] - order[y.severity]);
}
