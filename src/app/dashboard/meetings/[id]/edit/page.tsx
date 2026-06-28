import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoRow } from "@/lib/demo";
import { getProjectsLite } from "@/lib/queries";
import { updateMeeting } from "@/lib/actions/meetings";
import { Field, Select, TextArea, SubmitButton } from "@/components/form";

interface Meeting {
  id: string;
  project_id: string | null;
  meeting_date: string;
  decisions: string | null;
  comments: string | null;
  mood: string | null;
  next_action: string | null;
}

async function getMeeting(id: string): Promise<Meeting | null> {
  if (!isSupabaseConfigured()) return demoRow<Meeting>("meetings", id);
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("meetings").select("*").eq("id", id).single();
    return (data as Meeting) ?? null;
  } catch {
    return null;
  }
}

export default async function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [m, projects] = await Promise.all([getMeeting(id), getProjectsLite()]);
  if (!m) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/dashboard/meetings" className="text-xs text-faint hover:underline">
          &larr; Toplantilar
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Toplanti Duzenle</h1>
      </div>

      <form action={updateMeeting} className="grid gap-3 rounded-[20px] border border-line bg-surface elevate p-6 sm:grid-cols-2">
        <input type="hidden" name="id" value={m.id} />
        <Select name="project_id" label="Proje" defaultValue={m.project_id ?? ""} options={projects.map((p) => ({ value: p.id, label: p.name }))} />
        <Field name="meeting_date" label="Tarih" type="date" defaultValue={m.meeting_date} />
        <Field name="mood" label="Sanatcinin durumu" defaultValue={m.mood ?? ""} />
        <TextArea name="decisions" label="Kararlar" defaultValue={m.decisions ?? ""} />
        <TextArea name="comments" label="Yorumlar" defaultValue={m.comments ?? ""} />
        <TextArea name="next_action" label="Sonraki aksiyon" defaultValue={m.next_action ?? ""} />
        <SubmitButton>Kaydet</SubmitButton>
      </form>
    </div>
  );
}
