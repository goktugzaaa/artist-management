import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoArtists } from "@/lib/demo";
import { createArtist, deleteArtist } from "@/lib/actions/artists";
import type { Artist } from "@/lib/types/db";

async function getArtists(): Promise<Artist[]> {
  if (!isSupabaseConfigured()) return demoArtists;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("artists")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as Artist[]) ?? [];
  } catch {
    return [];
  }
}

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Sanatcilar</h1>
        <p className="mt-1 text-sm text-muted">{artists.length} kayit</p>
      </div>

      {/* Create form */}
      <form
        action={createArtist}
        className="grid gap-3 rounded-2xl border border-line bg-surface elevate p-5 sm:grid-cols-2"
      >
        <Field name="name" label="Ad *" required />
        <Field name="specialty" label="Uzmanlik" />
        <Field name="email" label="E-posta" type="email" />
        <Field name="phone" label="Telefon" />
        <Field name="working_style" label="Calisma Bicimi" />
        <Field name="production_cycle" label="Uretim Dongusu" />
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-muted">Notlar</label>
          <textarea
            name="notes"
            rows={2}
            className="mt-1 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/12"
          />
        </div>
        <div className="sm:col-span-2">
          <button className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent-ink active:scale-[0.98]">
            Sanatci ekle
          </button>
        </div>
      </form>

      {/* List */}
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface elevate">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface-2 text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Ad</th>
              <th className="px-4 py-3 font-medium">Uzmanlik</th>
              <th className="px-4 py-3 font-medium">E-posta</th>
              <th className="px-4 py-3 font-medium">Telefon</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {artists.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-faint">
                  Henuz sanatci yok. Yukaridaki formdan ekle.
                </td>
              </tr>
            )}
            {artists.map((a) => (
              <tr key={a.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/dashboard/artists/${a.id}`} className="text-ink hover:underline">
                    {a.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{a.specialty ?? "-"}</td>
                <td className="px-4 py-3 text-muted">{a.email ?? "-"}</td>
                <td className="px-4 py-3 text-muted">{a.phone ?? "-"}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteArtist}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className="text-xs text-red-500 hover:underline">Sil</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/12"
      />
    </div>
  );
}
