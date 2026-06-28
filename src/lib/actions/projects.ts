"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";

const PATH = "/dashboard/projects";

export async function createProject(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  const artist_id = String(formData.get("artist_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!artist_id || !name) return;

  await supabase.from("projects").insert({
    artist_id,
    name,
    description: nz(formData.get("description")),
    status: String(formData.get("status") || "planned"),
    priority: String(formData.get("priority") || "medium"),
    deadline: nz(formData.get("deadline")),
  });
  revalidatePath(PATH);
}

export async function deleteProject(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  await supabase.from("projects").delete().eq("id", String(formData.get("id")));
  revalidatePath(PATH);
}

function nz(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
