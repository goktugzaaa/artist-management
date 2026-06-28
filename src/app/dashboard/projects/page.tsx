import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoProjects } from "@/lib/demo";
import { getArtistsLite } from "@/lib/queries";
import { createProject, deleteProject } from "@/lib/actions/projects";
import { Field, Select, TextArea, SubmitButton, enumOptions } from "@/components/form";
import { projectStatusLabel, priorityLabel } from "@/lib/labels";
import type { Project } from "@/lib/types/db";

type Row = Project & { artists: { name: string } | null };

async function getProjects(): Promise<Row[]> {
  if (!isSupabaseConfigured()) return demoProjects;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*, artists(name)")
      .order("created_at", { ascending: false });
    return (data as Row[]) ?? [];
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const [projects, artists] = await Promise.all([getProjects(), getArtistsLite()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Projeler</h1>
        <p className="mt-1 text-sm text-muted">{projects.length} kayit</p>
      </div>

      <form action={createProject} className="grid gap-3 rounded-2xl border border-line bg-surface elevate p-5 sm:grid-cols-2">
        <Select name="artist_id" label="Sanatci *" required options={artists.map((a) => ({ value: a.id, label: a.name }))} />
        <Field name="name" label="Proje adi *" required />
        <Select name="status" label="Durum" options={enumOptions(projectStatusLabel)} />
        <Select name="priority" label="Oncelik" options={enumOptions(priorityLabel)} />
        <Field name="deadline" label="Teslim tarihi" type="date" />
        <TextArea name="description" label="Aciklama" />
        <SubmitButton>Proje ekle</SubmitButton>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface elevate">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface-2 text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Proje</th>
              <th className="px-4 py-3 font-medium">Sanatci</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">Oncelik</th>
              <th className="px-4 py-3 font-medium">Teslim</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-faint">Henuz proje yok.</td></tr>
            )}
            {projects.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                <td className="px-4 py-3 text-muted">{p.artists?.name ?? "-"}</td>
                <td className="px-4 py-3 text-muted">{projectStatusLabel[p.status]}</td>
                <td className="px-4 py-3 text-muted">{priorityLabel[p.priority]}</td>
                <td className="px-4 py-3 text-muted">{p.deadline ?? "-"}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={p.id} />
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
