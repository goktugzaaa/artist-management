"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";

const PATH = "/dashboard/daily";

export async function createDailyLog(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  const artist_id = String(formData.get("artist_id") ?? "");
  if (!artist_id) return;

  await supabase.from("daily_logs").insert({
    artist_id,
    project_id: nz(formData.get("project_id")),
    log_date: nz(formData.get("log_date")) ?? new Date().toISOString().slice(0, 10),
    hours: Number(formData.get("hours") || 0),
    done: nz(formData.get("done")),
    todo: nz(formData.get("todo")),
    blockers: nz(formData.get("blockers")),
    owner: String(formData.get("owner") || "self"),
    status: String(formData.get("status") || "in_progress"),
    priority: String(formData.get("priority") || "medium"),
    next_micro_step: nz(formData.get("next_micro_step")),
  });
  revalidatePath(PATH);
}

export async function deleteDailyLog(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  await supabase.from("daily_logs").delete().eq("id", String(formData.get("id")));
  revalidatePath(PATH);
}

function nz(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
