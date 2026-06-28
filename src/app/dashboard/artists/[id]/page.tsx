import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoArtist, demoByTable } from "@/lib/demo";
import type { Artist } from "@/lib/types/db";
import {
  projectStatusLabel, priorityLabel, planStatusLabel,
  serviceTypeLabel, serviceStatusLabel, outputTypeLabel, taskStatusLabel,
} from "@/lib/labels";

async function getArtist(id: string): Promise<Artist | null> {
  if (!isSupabaseConfigured()) return demoArtist(id);
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("artists").select("*").eq("id", id).single();
    return (data as Artist) ?? null;
  } catch {
    return null;
  }
}

async function getChild<T>(table: string, id: string, select: string, orderCol: string): Promise<T[]> {
  if (!isSupabaseConfigured()) {
    return (demoByTable[table]?.filter((r) => r.artist_id === id) as unknown as T[]) ?? [];
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from(table)
      .select(select)
      .eq("artist_id", id)
      .order(orderCol, { ascending: false });
    return (data as unknown as T[]) ?? [];
  } catch {
    return [];
  }
}

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artist = await getArtist(id);
  if (!artist) notFound();

  const [projects, weekly, daily, meetings, outputs, services] = await Promise.all([
    getChild<{ id: string; name: string; status: keyof typeof projectStatusLabel; priority: keyof typeof priorityLabel; deadline: string | null }>(
      "projects", id, "id, name, status, priority, deadline", "created_at"),
    getChild<{ id: string; week_start: string; planned_hours: number; actual_hours: number; status: keyof typeof planStatusLabel }>(
      "weekly_plans", id, "id, week_start, planned_hours, actual_hours, status", "week_start"),
    getChild<{ id: string; log_date: string; hours: number; done: string | null }>(
      "daily_logs", id, "id, log_date, hours, done", "log_date"),
    getChild<{ id: string; meeting_date: string; decisions: string | null; mood: string | null }>(
      "meetings", id, "id, meeting_date, decisions, mood", "meeting_date"),
    getChild<{ id: string; type: keyof typeof outputTypeLabel; title: string; status: keyof typeof taskStatusLabel }>(
      "outputs", id, "id, type, title, status", "created_at"),
    getChild<{ id: string; type: keyof typeof serviceTypeLabel; vendor: string | null; budget: number; status: keyof typeof serviceStatusLabel }>(
      "services", id, "id, type, vendor, budget, status", "created_at"),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/dashboard/artists" className="text-xs text-faint hover:underline">
            &larr; Sanatcilar
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-ink">{artist.name}</h1>
          <p className="text-sm text-muted">{artist.specialty ?? "Uzmanlik belirtilmemis"}</p>
        </div>
        <Link
          href={`/dashboard/artists/${id}/edit`}
          className="rounded-lg border border-line px-3 py-2 text-sm text-muted hover:bg-surface-2"
        >
          Duzenle
        </Link>
      </div>

      {/* Profil */}
      <Card title="Profil">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
          <Info label="E-posta" value={artist.email} />
          <Info label="Telefon" value={artist.phone} />
          <Info label="Calisma bicimi" value={artist.working_style} />
          <Info label="Uretim dongusu" value={artist.production_cycle} />
          <Info label="Motivasyon" value={artist.motivation} />
          <Info label="Notlar" value={artist.notes} />
        </dl>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title={`Projeler (${projects.length})`}>
          <MiniList
            rows={projects.map((p) => ({
              key: p.id,
              main: p.name,
              sub: `${projectStatusLabel[p.status]} · ${priorityLabel[p.priority]}${p.deadline ? ` · ${p.deadline}` : ""}`,
            }))}
          />
        </Card>

        <Card title={`Haftalik Plan (${weekly.length})`}>
          <MiniList
            rows={weekly.map((w) => {
              const diff = Number(w.actual_hours) - Number(w.planned_hours);
              return {
                key: w.id,
                main: w.week_start,
                sub: `${w.actual_hours}/${w.planned_hours} sa (${diff >= 0 ? "+" : ""}${diff}) · ${planStatusLabel[w.status]}`,
              };
            })}
          />
        </Card>

        <Card title={`Gunluk Takip (${daily.length})`}>
          <MiniList
            rows={daily.map((d) => ({
              key: d.id,
              main: `${d.log_date} · ${d.hours} sa`,
              sub: d.done ?? "-",
            }))}
          />
        </Card>

        <Card title={`Toplantilar (${meetings.length})`}>
          <MiniList
            rows={meetings.map((m) => ({
              key: m.id,
              main: m.meeting_date,
              sub: `${m.mood ? m.mood + " · " : ""}${m.decisions ?? "-"}`,
            }))}
          />
        </Card>

        <Card title={`Ciktilar (${outputs.length})`}>
          <MiniList
            rows={outputs.map((o) => ({
              key: o.id,
              main: o.title,
              sub: `${outputTypeLabel[o.type]} · ${taskStatusLabel[o.status]}`,
            }))}
          />
        </Card>

        <Card title={`Dis Hizmetler (${services.length})`}>
          <MiniList
            rows={services.map((s) => ({
              key: s.id,
              main: serviceTypeLabel[s.type],
              sub: `${s.vendor ?? "-"} · ${Number(s.budget).toLocaleString("tr-TR")} · ${serviceStatusLabel[s.status]}`,
            }))}
          />
        </Card>
      </div>
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

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs text-faint">{label}</dt>
      <dd className="text-ink">{value || "-"}</dd>
    </div>
  );
}

function MiniList({ rows }: { rows: { key: string; main: string; sub: string }[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-faint">Kayit yok.</p>;
  }
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.key} className="border-b border-line pb-2 last:border-0 last:pb-0">
          <p className="text-sm font-medium text-ink">{r.main}</p>
          <p className="truncate text-xs text-muted">{r.sub}</p>
        </li>
      ))}
    </ul>
  );
}
