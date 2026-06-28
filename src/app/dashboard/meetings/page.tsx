import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoMeetings } from "@/lib/demo";
import { getArtistsLite, getProjectsLite } from "@/lib/queries";
import { createMeeting, deleteMeeting } from "@/lib/actions/meetings";
import { Field, Select, TextArea, SubmitButton } from "@/components/form";

interface Row {
  id: string;
  meeting_date: string;
  decisions: string | null;
  mood: string | null;
  next_action: string | null;
  artists: { name: string } | null;
}

async function getMeetings(): Promise<Row[]> {
  if (!isSupabaseConfigured()) return demoMeetings;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("meetings")
      .select("id, meeting_date, decisions, mood, next_action, artists(name)")
      .order("meeting_date", { ascending: false });
    return (data as unknown as Row[]) ?? [];
  } catch {
    return [];
  }
}

export default async function MeetingsPage() {
  const [meetings, artists, projects] = await Promise.all([
    getMeetings(),
    getArtistsLite(),
    getProjectsLite(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Toplantilar</h1>
        <p className="mt-1 text-sm text-neutral-500">{meetings.length} kayit</p>
      </div>

      <form action={createMeeting} className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-5 sm:grid-cols-2">
        <Select name="artist_id" label="Sanatci *" required options={artists.map((a) => ({ value: a.id, label: a.name }))} />
        <Select name="project_id" label="Proje" options={projects.map((p) => ({ value: p.id, label: p.name }))} />
        <Field name="meeting_date" label="Tarih" type="date" />
        <Field name="mood" label="Sanatcinin durumu" />
        <TextArea name="decisions" label="Kararlar" />
        <TextArea name="comments" label="Yorumlar" />
        <TextArea name="next_action" label="Sonraki aksiyon" />
        <SubmitButton>Toplanti ekle</SubmitButton>
      </form>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Tarih</th>
              <th className="px-4 py-3 font-medium">Sanatci</th>
              <th className="px-4 py-3 font-medium">Kararlar</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">Sonraki aksiyon</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {meetings.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-400">Henuz toplanti yok.</td></tr>
            )}
            {meetings.map((m) => (
              <tr key={m.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 text-neutral-600">{m.meeting_date}</td>
                <td className="px-4 py-3 font-medium text-neutral-900">{m.artists?.name ?? "-"}</td>
                <td className="px-4 py-3 max-w-xs truncate text-neutral-600">{m.decisions ?? "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{m.mood ?? "-"}</td>
                <td className="px-4 py-3 max-w-xs truncate text-neutral-600">{m.next_action ?? "-"}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteMeeting}>
                    <input type="hidden" name="id" value={m.id} />
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
