import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoWeekly } from "@/lib/demo";
import { getArtistsLite } from "@/lib/queries";
import { createWeeklyPlan, deleteWeeklyPlan } from "@/lib/actions/weekly";
import { Field, Select, TextArea, SubmitButton, enumOptions } from "@/components/form";
import { planStatusLabel } from "@/lib/labels";
import type { WeeklyPlan } from "@/lib/types/db";

type Row = WeeklyPlan & { artists: { name: string } | null };

async function getPlans(): Promise<Row[]> {
  if (!isSupabaseConfigured()) return demoWeekly;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("weekly_plans")
      .select("*, artists(name)")
      .order("week_start", { ascending: false });
    return (data as Row[]) ?? [];
  } catch {
    return [];
  }
}

export default async function WeeklyPage() {
  const [plans, artists] = await Promise.all([getPlans(), getArtistsLite()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Haftalik Plan</h1>
        <p className="mt-1 text-sm text-muted">{plans.length} kayit</p>
      </div>

      <form action={createWeeklyPlan} className="grid gap-3 rounded-2xl border border-line bg-surface elevate p-5 sm:grid-cols-2">
        <Select name="artist_id" label="Sanatci *" required options={artists.map((a) => ({ value: a.id, label: a.name }))} />
        <Field name="week_start" label="Hafta baslangici *" type="date" required />
        <Field name="planned_hours" label="Planlanan saat" type="number" step="0.5" />
        <Field name="actual_hours" label="Gerceklesen saat" type="number" step="0.5" />
        <Select name="status" label="Durum" options={enumOptions(planStatusLabel)} />
        <Field name="focus" label="Odak" />
        <TextArea name="review" label="Hafta sonu degerlendirmesi" />
        <SubmitButton>Plan ekle</SubmitButton>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface elevate">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface-2 text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Hafta</th>
              <th className="px-4 py-3 font-medium">Sanatci</th>
              <th className="px-4 py-3 font-medium">Odak</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Gercek</th>
              <th className="px-4 py-3 font-medium">Fark</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-faint">Henuz plan yok.</td></tr>
            )}
            {plans.map((p) => {
              const diff = Number(p.actual_hours) - Number(p.planned_hours);
              return (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-4 py-3 text-muted">{p.week_start}</td>
                  <td className="px-4 py-3 font-medium text-ink">{p.artists?.name ?? "-"}</td>
                  <td className="px-4 py-3 text-muted">{p.focus ?? "-"}</td>
                  <td className="px-4 py-3 text-muted">{p.planned_hours}</td>
                  <td className="px-4 py-3 text-muted">{p.actual_hours}</td>
                  <td className={`px-4 py-3 font-medium ${diff < 0 ? "text-red-500" : "text-green-600"}`}>
                    {diff > 0 ? `+${diff}` : diff}
                  </td>
                  <td className="px-4 py-3 text-muted">{planStatusLabel[p.status]}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/dashboard/weekly/${p.id}/edit`} className="text-xs text-accent hover:underline">
                        Duzenle
                      </Link>
                      <form action={deleteWeeklyPlan}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="text-xs text-red-500 hover:underline">Sil</button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
