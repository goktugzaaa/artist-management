"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";

export async function signIn(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/dashboard");
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/dashboard");
}

export async function signOut() {
  if (!isSupabaseConfigured()) redirect("/dashboard");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
