import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoOutputs } from "@/lib/demo";
import { getArtistsLite, getProjectsLite } from "@/lib/queries";
import { createOutput, deleteOutput } from "@/lib/actions/outputs";
import { Field, Select, SubmitButton, enumOptions } from "@/components/form";
import { outputTypeLabel, taskStatusLabel } from "@/lib/labels";
import type { OutputType, TaskStatus } from "@/lib/types/db";

interface Row {
  id: string;
  type: OutputType;
  title: string;
  status: TaskStatus;
  link: string | null;
  artists: { name: string } | null;
}

async function getOutputs(): Promise<Row[]> {
  if (!isSupabaseConfigured()) return demoOutputs;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("outputs")
      .select("id, type, title, status, link, artists(name)")
      .order("created_at", { ascending: false });
    return (data as unknown as Row[]) ?? [];
  } catch {
    return [];
  }
}

export default async function OutputsPage() {
  const [outputs, artists, projects] = await Promise.all([
    getOutputs(),
    getArtistsLite(),
    getProjectsLite(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Ciktilar</h1>
        <p className="mt-1 text-sm text-muted">{outputs.length} kayit</p>
      </div>

      <form action={createOutput} className="grid gap-3 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-2">
        <Select name="artist_id" label="Sanatci *" required options={artists.map((a) => ({ value: a.id, label: a.name }))} />
        <Select name="project_id" label="Proje" options={projects.map((p) => ({ value: p.id, label: p.name }))} />
        <Select name="type" label="Cikti turu *" required options={enumOptions(outputTypeLabel)} />
        <Field name="title" label="Baslik *" required />
        <Select name="status" label="Durum" options={enumOptions(taskStatusLabel)} />
        <Field name="link" label="Link" />
        <SubmitButton>Cikti ekle</SubmitButton>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface-2 text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Baslik</th>
              <th className="px-4 py-3 font-medium">Tur</th>
              <th className="px-4 py-3 font-medium">Sanatci</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">Link</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {outputs.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-faint">Henuz cikti yok.</td></tr>
            )}
            {outputs.map((o) => (
              <tr key={o.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium text-ink">{o.title}</td>
                <td className="px-4 py-3 text-muted">{outputTypeLabel[o.type]}</td>
                <td className="px-4 py-3 text-muted">{o.artists?.name ?? "-"}</td>
                <td className="px-4 py-3 text-muted">{taskStatusLabel[o.status]}</td>
                <td className="px-4 py-3 text-muted">
                  {o.link ? (
                    <a href={o.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Ac
                    </a>
                  ) : "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteOutput}>
                    <input type="hidden" name="id" value={o.id} />
                    <button className="text-xs text-red-500 hover:underline">Sil</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
