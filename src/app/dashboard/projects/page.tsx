import { createClient } from "@/lib/supabase/server";
import { getArtistsLite } from "@/lib/queries";
import { createProject, deleteProject } from "@/lib/actions/projects";
import { Field, Select, TextArea, SubmitButton, enumOptions } from "@/components/form";
import { projectStatusLabel, priorityLabel } from "@/lib/labels";
import type { Project } from "@/lib/types/db";

type Row = Project & { artists: { name: string } | null };

async function getProjects(): Promise<Row[]> {
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
        <h1 className="text-2xl font-semibold text-neutral-900">Projeler</h1>
        <p className="mt-1 text-sm text-neutral-500">{projects.length} kayit</p>
      </div>

      <form action={createProject} className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-5 sm:grid-cols-2">
        <Select name="artist_id" label="Sanatci *" required options={artists.map((a) => ({ value: a.id, label: a.name }))} />
        <Field name="name" label="Proje adi *" required />
        <Select name="status" label="Durum" options={enumOptions(projectStatusLabel)} />
        <Select name="priority" label="Oncelik" options={enumOptions(priorityLabel)} />
        <Field name="deadline" label="Teslim tarihi" type="date" />
        <TextArea name="description" label="Aciklama" />
        <SubmitButton>Proje ekle</SubmitButton>
      </form>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
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
              <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-400">Henuz proje yok.</td></tr>
            )}
            {projects.map((p) => (
              <tr key={p.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-medium text-neutral-900">{p.name}</td>
                <td className="px-4 py-3 text-neutral-600">{p.artists?.name ?? "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{projectStatusLabel[p.status]}</td>
                <td className="px-4 py-3 text-neutral-600">{priorityLabel[p.priority]}</td>
                <td className="px-4 py-3 text-neutral-600">{p.deadline ?? "-"}</td>
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
