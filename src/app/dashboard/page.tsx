import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoArtists, demoProjects, demoServices, demoMeetings } from "@/lib/demo";
import { WeeklyTrendChart, StatusChart } from "@/components/charts";
import {
  getWeeklyTrend, getProjectStatus, getUpcomingDeadlines, getAtRisk,
} from "@/lib/dashboard";

const DEMO_COUNTS: Record<string, number> = {
  artists: demoArtists.length,
  projects: demoProjects.length,
  services: demoServices.length,
  meetings: demoMeetings.length,
};

async function safeCount(table: string): Promise<number> {
  if (!isSupabaseConfigured()) return DEMO_COUNTS[table] ?? 0;
  try {
    const supabase = await createClient();
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-ink tnum">{value}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function DashboardPage() {
  const [
    artists, projects, services, meetings,
    trend, status, deadlines, risk,
  ] = await Promise.all([
    safeCount("artists"),
    safeCount("projects"),
    safeCount("services"),
    safeCount("meetings"),
    getWeeklyTrend(),
    getProjectStatus(),
    getUpcomingDeadlines(),
    getAtRisk(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Genel Bakis</h1>
        <p className="mt-1 text-sm text-muted">Tum sanatcilar, projeler ve riskler</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <Kpi label="Sanatci" value={artists} />
        <Kpi label="Proje" value={projects} />
        <Kpi label="Dis Hizmet" value={services} />
        <Kpi label="Toplanti" value={meetings} />
        <Kpi label="Yaklasan Teslim" value={deadlines.length} />
        <Kpi label="Riskli Hafta" value={risk.length} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Haftalik Saat (planlanan vs gerceklesen)">
          <WeeklyTrendChart data={trend} />
        </Card>
        <Card title="Proje Durum Dagilimi">
          <StatusChart data={status} />
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title={`Yaklasan Teslimler (14 gun) — ${deadlines.length}`}>
          {deadlines.length === 0 ? (
            <p className="text-sm text-faint">Yaklasan teslim yok.</p>
          ) : (
            <ul className="space-y-2">
              {deadlines.map((d) => (
                <li key={d.id} className="flex items-center justify-between border-b border-line pb-2 text-sm last:border-0 last:pb-0">
                  <span className="font-medium text-ink">{d.name}</span>
                  <span className="text-muted">{d.artist} · {d.deadline}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title={`Risk (saat < %60) — ${risk.length}`}>
          {risk.length === 0 ? (
            <p className="text-sm text-faint">Riskli hafta yok.</p>
          ) : (
            <ul className="space-y-2">
              {risk.map((r) => (
                <li key={r.id} className="flex items-center justify-between border-b border-line pb-2 text-sm last:border-0 last:pb-0">
                  <span className="font-medium text-ink">{r.artist}</span>
                  <span className="text-red-500">
                    {r.actual}/{r.planned} sa (%{Math.round(r.ratio * 100)}) · {r.week}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <p className="text-xs text-faint">
        Hizli erisim:{" "}
        <Link href="/dashboard/weekly" className="hover:underline">Haftalik Plan</Link> ·{" "}
        <Link href="/dashboard/projects" className="hover:underline">Projeler</Link>
      </p>
    </div>
  );
}
