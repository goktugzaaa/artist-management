import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoRow } from "@/lib/demo";
import { updateWeeklyPlan } from "@/lib/actions/weekly";
import { Field, Select, TextArea, SubmitButton, enumOptions } from "@/components/form";
import { planStatusLabel } from "@/lib/labels";
import type { WeeklyPlan } from "@/lib/types/db";

async function getPlan(id: string): Promise<WeeklyPlan | null> {
  if (!isSupabaseConfigured()) return demoRow<WeeklyPlan>("weekly_plans", id);
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("weekly_plans").select("*").eq("id", id).single();
    return (data as WeeklyPlan) ?? null;
  } catch {
    return null;
  }
}

export default async function EditWeeklyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const w = await getPlan(id);
  if (!w) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/dashboard/weekly" className="text-xs text-faint hover:underline">
          &larr; Haftalik Plan
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Haftalik Plan Duzenle</h1>
        <p className="mt-1 text-sm text-muted">Hafta: {w.week_start}</p>
      </div>

      <form action={updateWeeklyPlan} className="grid gap-3 rounded-[20px] border border-line bg-surface elevate p-6 sm:grid-cols-2">
        <input type="hidden" name="id" value={w.id} />
        <Field name="planned_hours" label="Planlanan saat" type="number" step="0.5" defaultValue={w.planned_hours} />
        <Field name="actual_hours" label="Gerceklesen saat" type="number" step="0.5" defaultValue={w.actual_hours} />
        <Select name="status" label="Durum" defaultValue={w.status} options={enumOptions(planStatusLabel)} />
        <Field name="focus" label="Odak" defaultValue={w.focus ?? ""} />
        <TextArea name="review" label="Hafta sonu degerlendirmesi" defaultValue={w.review ?? ""} />
        <SubmitButton>Kaydet</SubmitButton>
      </form>
    </div>
  );
}
