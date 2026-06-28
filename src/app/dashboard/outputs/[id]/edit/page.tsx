import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoRow } from "@/lib/demo";
import { getProjectsLite } from "@/lib/queries";
import { updateOutput } from "@/lib/actions/outputs";
import { Field, Select, SubmitButton, enumOptions } from "@/components/form";
import { outputTypeLabel, taskStatusLabel } from "@/lib/labels";
import type { OutputType, TaskStatus } from "@/lib/types/db";

interface Output {
  id: string;
  project_id: string | null;
  type: OutputType;
  title: string;
  status: TaskStatus;
  link: string | null;
}

async function getOutput(id: string): Promise<Output | null> {
  if (!isSupabaseConfigured()) return demoRow<Output>("outputs", id);
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("outputs").select("*").eq("id", id).single();
    return (data as Output) ?? null;
  } catch {
    return null;
  }
}

export default async function EditOutputPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [o, projects] = await Promise.all([getOutput(id), getProjectsLite()]);
  if (!o) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/dashboard/outputs" className="text-xs text-faint hover:underline">
          &larr; Ciktilar
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Cikti Duzenle</h1>
      </div>

      <form action={updateOutput} className="grid gap-3 rounded-[20px] border border-line bg-surface elevate p-6 sm:grid-cols-2">
        <input type="hidden" name="id" value={o.id} />
        <Select name="project_id" label="Proje" defaultValue={o.project_id ?? ""} options={projects.map((p) => ({ value: p.id, label: p.name }))} />
        <Select name="type" label="Cikti turu *" required defaultValue={o.type} options={enumOptions(outputTypeLabel)} />
        <Field name="title" label="Baslik *" required defaultValue={o.title} />
        <Select name="status" label="Durum" defaultValue={o.status} options={enumOptions(taskStatusLabel)} />
        <Field name="link" label="Link" defaultValue={o.link ?? ""} />
        <SubmitButton>Kaydet</SubmitButton>
      </form>
    </div>
  );
}
