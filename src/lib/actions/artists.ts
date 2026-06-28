"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";

export async function createArtist(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();

  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    email: emptyToNull(formData.get("email")),
    phone: emptyToNull(formData.get("phone")),
    specialty: emptyToNull(formData.get("specialty")),
    working_style: emptyToNull(formData.get("working_style")),
    production_cycle: emptyToNull(formData.get("production_cycle")),
    notes: emptyToNull(formData.get("notes")),
  };

  if (!payload.name) return;

  await supabase.from("artists").insert(payload);
  revalidatePath("/dashboard/artists");
}

export async function updateArtist(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;

  await supabase
    .from("artists")
    .update({
      name,
      email: emptyToNull(formData.get("email")),
      phone: emptyToNull(formData.get("phone")),
      specialty: emptyToNull(formData.get("specialty")),
      working_style: emptyToNull(formData.get("working_style")),
      production_cycle: emptyToNull(formData.get("production_cycle")),
      motivation: emptyToNull(formData.get("motivation")),
      notes: emptyToNull(formData.get("notes")),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/dashboard/artists");
  revalidatePath(`/dashboard/artists/${id}`);
  redirect(`/dashboard/artists/${id}`);
}

export async function deleteArtist(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("artists").delete().eq("id", id);
  revalidatePath("/dashboard/artists");
}

function emptyToNull(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
