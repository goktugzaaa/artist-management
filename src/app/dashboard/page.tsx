import { createClient } from "@/lib/supabase/server";

async function safeCount(table: string): Promise<number> {
  try {
    const supabase = await createClient();
    const { count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const [artists, projects, services, meetings] = await Promise.all([
    safeCount("artists"),
    safeCount("projects"),
    safeCount("services"),
    safeCount("meetings"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">Genel bakis</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Sanatci" value={artists} />
        <Kpi label="Proje" value={projects} />
        <Kpi label="Dis Hizmet" value={services} />
        <Kpi label="Toplanti" value={meetings} />
      </div>
    </div>
  );
}
