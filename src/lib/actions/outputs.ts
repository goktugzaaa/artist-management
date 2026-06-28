"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";

const PATH = "/dashboard/outputs";

export async function createOutput(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  const artist_id = String(formData.get("artist_id") ?? "");
  const type = String(formData.get("type") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!artist_id || !type || !title) return;

  await supabase.from("outputs").insert({
    artist_id,
    project_id: nz(formData.get("project_id")),
    type,
    title,
    status: String(formData.get("status") || "todo"),
    link: nz(formData.get("link")),
  });
  revalidatePath(PATH);
}

export async function deleteOutput(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  await supabase.from("outputs").delete().eq("id", String(formData.get("id")));
  revalidatePath(PATH);
}

function nz(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
