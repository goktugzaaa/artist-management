import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoRow } from "@/lib/demo";
import { updateProject } from "@/lib/actions/projects";
import { Field, Select, TextArea, SubmitButton, enumOptions } from "@/components/form";
import { projectStatusLabel, priorityLabel } from "@/lib/labels";
import type { Project } from "@/lib/types/db";

async function getProject(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) return demoRow<Project>("projects", id);
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("projects").select("*").eq("id", id).single();
    return (data as Project) ?? null;
  } catch {
    return null;
  }
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getProject(id);
  if (!p) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/dashboard/projects" className="text-xs text-faint hover:underline">
          &larr; Projeler
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Proje Duzenle</h1>
      </div>

      <form action={updateProject} className="grid gap-3 rounded-[20px] border border-line bg-surface elevate p-6 sm:grid-cols-2">
        <input type="hidden" name="id" value={p.id} />
        <Field name="name" label="Proje adi *" required defaultValue={p.name} />
        <Field name="deadline" label="Teslim tarihi" type="date" defaultValue={p.deadline ?? ""} />
        <Select name="status" label="Durum" defaultValue={p.status} options={enumOptions(projectStatusLabel)} />
        <Select name="priority" label="Oncelik" defaultValue={p.priority} options={enumOptions(priorityLabel)} />
        <TextArea name="description" label="Aciklama" defaultValue={p.description ?? ""} />
        <SubmitButton>Kaydet</SubmitButton>
      </form>
    </div>
  );
}
