import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoRow } from "@/lib/demo";
import { getProjectsLite } from "@/lib/queries";
import { updateDailyLog } from "@/lib/actions/daily";
import { Field, Select, TextArea, SubmitButton, enumOptions } from "@/components/form";
import { taskOwnerLabel, taskStatusLabel, priorityLabel } from "@/lib/labels";
import type { DailyLog } from "@/lib/types/db";

async function getLog(id: string): Promise<DailyLog | null> {
  if (!isSupabaseConfigured()) return demoRow<DailyLog>("daily_logs", id);
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("daily_logs").select("*").eq("id", id).single();
    return (data as DailyLog) ?? null;
  } catch {
    return null;
  }
}

export default async function EditDailyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [l, projects] = await Promise.all([getLog(id), getProjectsLite()]);
  if (!l) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/dashboard/daily" className="text-xs text-faint hover:underline">
          &larr; Gunluk Takip
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Gunluk Kayit Duzenle</h1>
      </div>

      <form action={updateDailyLog} className="grid gap-3 rounded-[20px] border border-line bg-surface elevate p-6 sm:grid-cols-2">
        <input type="hidden" name="id" value={l.id} />
        <Select name="project_id" label="Proje" defaultValue={l.project_id ?? ""} options={projects.map((p) => ({ value: p.id, label: p.name }))} />
        <Field name="log_date" label="Tarih" type="date" defaultValue={l.log_date} />
        <Field name="hours" label="Saat" type="number" step="0.5" defaultValue={l.hours} />
        <Select name="owner" label="Sahip" defaultValue={l.owner} options={enumOptions(taskOwnerLabel)} />
        <Select name="status" label="Durum" defaultValue={l.status} options={enumOptions(taskStatusLabel)} />
        <Select name="priority" label="Oncelik" defaultValue={l.priority} options={enumOptions(priorityLabel)} />
        <Field name="next_micro_step" label="Sonraki mikro adim" defaultValue={l.next_micro_step ?? ""} />
        <TextArea name="done" label="Yapilanlar" defaultValue={l.done ?? ""} />
        <TextArea name="todo" label="Yapilacaklar" defaultValue={l.todo ?? ""} />
        <TextArea name="blockers" label="Engeller" defaultValue={l.blockers ?? ""} />
        <SubmitButton>Kaydet</SubmitButton>
      </form>
    </div>
  );
}
