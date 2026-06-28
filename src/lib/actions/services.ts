"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";

const PATH = "/dashboard/services";

export async function createService(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  const artist_id = String(formData.get("artist_id") ?? "");
  const type = String(formData.get("type") ?? "");
  if (!artist_id || !type) return;

  await supabase.from("services").insert({
    artist_id,
    project_id: nz(formData.get("project_id")),
    type,
    vendor: nz(formData.get("vendor")),
    budget: Number(formData.get("budget") || 0),
    status: String(formData.get("status") || "requested"),
    delivery_date: nz(formData.get("delivery_date")),
    invoice_status: nz(formData.get("invoice_status")),
    notes: nz(formData.get("notes")),
  });
  revalidatePath(PATH);
}

export async function deleteService(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", String(formData.get("id")));
  revalidatePath(PATH);
}

function nz(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
