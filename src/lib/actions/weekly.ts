"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const PATH = "/dashboard/weekly";

export async function createWeeklyPlan(formData: FormData) {
  const supabase = await createClient();
  const artist_id = String(formData.get("artist_id") ?? "");
  const week_start = nz(formData.get("week_start"));
  if (!artist_id || !week_start) return;

  await supabase.from("weekly_plans").insert({
    artist_id,
    week_start,
    focus: nz(formData.get("focus")),
    planned_hours: Number(formData.get("planned_hours") || 0),
    actual_hours: Number(formData.get("actual_hours") || 0),
    status: String(formData.get("status") || "planned"),
    review: nz(formData.get("review")),
  });
  revalidatePath(PATH);
}

export async function deleteWeeklyPlan(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("weekly_plans").delete().eq("id", String(formData.get("id")));
  revalidatePath(PATH);
}

function nz(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
