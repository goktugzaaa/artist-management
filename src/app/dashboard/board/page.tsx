import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoProjects } from "@/lib/demo";
import { projectStatusLabel, priorityLabel } from "@/lib/labels";
import type { Project, ProjectStatus } from "@/lib/types/db";

type Row = Project & { artists: { name: string } | null };

const COLUMNS: ProjectStatus[] = ["planned", "active", "on_hold", "done", "cancelled"];

const PRIORITY_DOT: Record<string, string> = {
  urgent: "bg-red-500", high: "bg-amber-500", medium: "bg-blue-500", low: "bg-neutral-400",
};

async function getProjects(): Promise<Row[]> {
  if (!isSupabaseConfigured()) return demoProjects;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*, artists(name)")
      .order("deadline", { ascending: true });
    return (data as Row[]) ?? [];
  } catch {
    return [];
  }
}

export default async function BoardPage() {
  const projects = await getProjects();
  const byStatus = (s: ProjectStatus) => projects.filter((p) => p.status === s);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Pano</h1>
        <p className="mt-1 text-sm text-neutral-500">Projeler duruma gore — {projects.length} proje</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {COLUMNS.map((status) => {
          const items = byStatus(status);
          return (
            <div key={status} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
              <div className="flex items-center justify-between px-1 pb-2">
                <h2 className="text-sm font-semibold text-neutral-700">{projectStatusLabel[status]}</h2>
                <span className="rounded-full bg-neutral-200 px-2 text-xs text-neutral-600">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.length === 0 && (
                  <p className="px-1 py-4 text-center text-xs text-neutral-300">-</p>
                )}
                {items.map((p) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/artists/${p.artist_id}`}
                    className="block rounded-xl border border-neutral-200 bg-white p-3 hover:border-neutral-300"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${PRIORITY_DOT[p.priority]}`} />
                      <p className="text-sm font-medium text-neutral-900">{p.name}</p>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">{p.artists?.name ?? "-"}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                      <span>{priorityLabel[p.priority]}</span>
                      <span>{p.deadline ?? "-"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-neutral-400">
        Surukle-birak ile durum degistirme Supabase baglaninca eklenecek (su an demo salt okunur).
      </p>
    </div>
  );
}
