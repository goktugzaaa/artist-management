import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoArtist } from "@/lib/demo";
import { updateArtist } from "@/lib/actions/artists";
import { Field, TextArea, SubmitButton } from "@/components/form";
import type { Artist } from "@/lib/types/db";

async function getArtist(id: string): Promise<Artist | null> {
  if (!isSupabaseConfigured()) return demoArtist(id);
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("artists").select("*").eq("id", id).single();
    return (data as Artist) ?? null;
  } catch {
    return null;
  }
}

export default async function EditArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = await getArtist(id);
  if (!a) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href={`/dashboard/artists/${id}`} className="text-xs text-neutral-400 hover:underline">
          &larr; {a.name}
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-900">Sanatci Duzenle</h1>
      </div>

      <form action={updateArtist} className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-5 sm:grid-cols-2">
        <input type="hidden" name="id" value={a.id} />
        <Field name="name" label="Ad *" required defaultValue={a.name} />
        <Field name="specialty" label="Uzmanlik" defaultValue={a.specialty ?? ""} />
        <Field name="email" label="E-posta" type="email" defaultValue={a.email ?? ""} />
        <Field name="phone" label="Telefon" defaultValue={a.phone ?? ""} />
        <Field name="working_style" label="Calisma bicimi" defaultValue={a.working_style ?? ""} />
        <Field name="production_cycle" label="Uretim dongusu" defaultValue={a.production_cycle ?? ""} />
        <TextArea name="motivation" label="Motivasyon" defaultValue={a.motivation ?? ""} />
        <TextArea name="notes" label="Notlar" defaultValue={a.notes ?? ""} />
        <SubmitButton>Kaydet</SubmitButton>
      </form>
    </div>
  );
}
