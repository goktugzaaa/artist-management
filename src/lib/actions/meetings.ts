"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";

const PATH = "/dashboard/meetings";

export async function createMeeting(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  const artist_id = String(formData.get("artist_id") ?? "");
  if (!artist_id) return;

  await supabase.from("meetings").insert({
    artist_id,
    project_id: nz(formData.get("project_id")),
    meeting_date: nz(formData.get("meeting_date")) ?? new Date().toISOString().slice(0, 10),
    decisions: nz(formData.get("decisions")),
    comments: nz(formData.get("comments")),
    mood: nz(formData.get("mood")),
    next_action: nz(formData.get("next_action")),
  });
  revalidatePath(PATH);
}

export async function updateMeeting(formData: FormData) {
  if (!isSupabaseConfigured()) redirect(PATH);
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase
    .from("meetings")
    .update({
      project_id: nz(formData.get("project_id")),
      meeting_date: nz(formData.get("meeting_date")) ?? new Date().toISOString().slice(0, 10),
      decisions: nz(formData.get("decisions")),
      comments: nz(formData.get("comments")),
      mood: nz(formData.get("mood")),
      next_action: nz(formData.get("next_action")),
    })
    .eq("id", id);
  revalidatePath(PATH);
  redirect(PATH);
}

export async function deleteMeeting(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  await supabase.from("meetings").delete().eq("id", String(formData.get("id")));
  revalidatePath(PATH);
}

function nz(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
