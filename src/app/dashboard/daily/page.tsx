import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoDaily } from "@/lib/demo";
import { getArtistsLite, getProjectsLite } from "@/lib/queries";
import { createDailyLog, deleteDailyLog } from "@/lib/actions/daily";
import { Field, Select, TextArea, SubmitButton, enumOptions } from "@/components/form";
import { SearchBox } from "@/components/search-box";
import { filterByQuery } from "@/lib/search";
import { taskOwnerLabel, taskStatusLabel, priorityLabel } from "@/lib/labels";
import type { DailyLog } from "@/lib/types/db";

type Row = DailyLog & { artists: { name: string } | null; projects: { name: string } | null };

async function getLogs(): Promise<Row[]> {
  if (!isSupabaseConfigured()) return demoDaily;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("daily_logs")
      .select("*, artists(name), projects(name)")
      .order("log_date", { ascending: false });
    return (data as Row[]) ?? [];
  } catch {
    return [];
  }
}

export default async function DailyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [all, artists, projects] = await Promise.all([
    getLogs(),
    getArtistsLite(),
    getProjectsLite(),
  ]);
  const logs = filterByQuery(all, q, (l) => [l.artists?.name, l.projects?.name, l.done, l.todo]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Gunluk Takip</h1>
          <p className="mt-1 text-sm text-muted">{logs.length} kayit</p>
        </div>
        <SearchBox placeholder="Kayit ara..." />
      </div>

      <form action={createDailyLog} className="grid gap-3 rounded-2xl border border-line bg-surface elevate p-5 sm:grid-cols-2">
        <Select name="artist_id" label="Sanatci *" required options={artists.map((a) => ({ value: a.id, label: a.name }))} />
        <Select name="project_id" label="Proje" options={projects.map((p) => ({ value: p.id, label: p.name }))} />
        <Field name="log_date" label="Tarih" type="date" />
        <Field name="hours" label="Saat" type="number" step="0.5" />
        <Select name="owner" label="Sahip" options={enumOptions(taskOwnerLabel)} />
        <Select name="status" label="Durum" options={enumOptions(taskStatusLabel)} />
        <Select name="priority" label="Oncelik" options={enumOptions(priorityLabel)} />
        <Field name="next_micro_step" label="Sonraki mikro adim" />
        <TextArea name="done" label="Yapilanlar" />
        <TextArea name="todo" label="Yapilacaklar" />
        <TextArea name="blockers" label="Engeller" />
        <SubmitButton>Kayit ekle</SubmitButton>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface elevate">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface-2 text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Tarih</th>
              <th className="px-4 py-3 font-medium">Sanatci</th>
              <th className="px-4 py-3 font-medium">Proje</th>
              <th className="px-4 py-3 font-medium">Saat</th>
              <th className="px-4 py-3 font-medium">Sahip</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-faint">Henuz kayit yok.</td></tr>
            )}
            {logs.map((l) => (
              <tr key={l.id} className="border-t border-line">
                <td className="px-4 py-3 text-muted">{l.log_date}</td>
                <td className="px-4 py-3 font-medium text-ink">{l.artists?.name ?? "-"}</td>
                <td className="px-4 py-3 text-muted">{l.projects?.name ?? "-"}</td>
                <td className="px-4 py-3 text-muted">{l.hours}</td>
                <td className="px-4 py-3 text-muted">{taskOwnerLabel[l.owner]}</td>
                <td className="px-4 py-3 text-muted">{taskStatusLabel[l.status]}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/dashboard/daily/${l.id}/edit`} className="text-xs text-accent hover:underline">
                      Duzenle
                    </Link>
                    <form action={deleteDailyLog}>
                      <input type="hidden" name="id" value={l.id} />
                      <button className="text-xs text-red-500 hover:underline">Sil</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
