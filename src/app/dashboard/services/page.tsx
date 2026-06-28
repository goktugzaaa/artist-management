import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoServices } from "@/lib/demo";
import { getArtistsLite, getProjectsLite } from "@/lib/queries";
import { createService, deleteService } from "@/lib/actions/services";
import { Field, Select, TextArea, SubmitButton, enumOptions } from "@/components/form";
import { SearchBox } from "@/components/search-box";
import { filterByQuery } from "@/lib/search";
import { serviceTypeLabel, serviceStatusLabel } from "@/lib/labels";
import type { ServiceType, ServiceStatus } from "@/lib/types/db";

interface Row {
  id: string;
  type: ServiceType;
  vendor: string | null;
  budget: number;
  status: ServiceStatus;
  delivery_date: string | null;
  artists: { name: string } | null;
}

async function getServices(): Promise<Row[]> {
  if (!isSupabaseConfigured()) return demoServices;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("id, type, vendor, budget, status, delivery_date, artists(name)")
      .order("created_at", { ascending: false });
    return (data as unknown as Row[]) ?? [];
  } catch {
    return [];
  }
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [all, artists, projects] = await Promise.all([
    getServices(),
    getArtistsLite(),
    getProjectsLite(),
  ]);
  const services = filterByQuery(all, q, (s) => [s.artists?.name, s.vendor, serviceTypeLabel[s.type]]);
  const totalBudget = services.reduce((s, r) => s + Number(r.budget), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Dis Hizmetler</h1>
          <p className="mt-1 text-sm text-muted">
            {services.length} kayit · toplam butce {totalBudget.toLocaleString("tr-TR")}
          </p>
        </div>
        <SearchBox placeholder="Hizmet ara..." />
      </div>

      <form action={createService} className="grid gap-3 rounded-2xl border border-line bg-surface elevate p-5 sm:grid-cols-2">
        <Select name="artist_id" label="Sanatci *" required options={artists.map((a) => ({ value: a.id, label: a.name }))} />
        <Select name="project_id" label="Proje" options={projects.map((p) => ({ value: p.id, label: p.name }))} />
        <Select name="type" label="Hizmet turu *" required options={enumOptions(serviceTypeLabel)} />
        <Field name="vendor" label="Tedarikci" />
        <Field name="budget" label="Butce" type="number" step="0.01" />
        <Select name="status" label="Durum" options={enumOptions(serviceStatusLabel)} />
        <Field name="delivery_date" label="Teslim tarihi" type="date" />
        <Field name="invoice_status" label="Fatura durumu" />
        <TextArea name="notes" label="Notlar" />
        <SubmitButton>Hizmet ekle</SubmitButton>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface elevate">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface-2 text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Tur</th>
              <th className="px-4 py-3 font-medium">Sanatci</th>
              <th className="px-4 py-3 font-medium">Tedarikci</th>
              <th className="px-4 py-3 font-medium">Butce</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">Teslim</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-faint">Henuz hizmet yok.</td></tr>
            )}
            {services.map((s) => (
              <tr key={s.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium text-ink">{serviceTypeLabel[s.type]}</td>
                <td className="px-4 py-3 text-muted">{s.artists?.name ?? "-"}</td>
                <td className="px-4 py-3 text-muted">{s.vendor ?? "-"}</td>
                <td className="px-4 py-3 text-muted">{Number(s.budget).toLocaleString("tr-TR")}</td>
                <td className="px-4 py-3 text-muted">{serviceStatusLabel[s.status]}</td>
                <td className="px-4 py-3 text-muted">{s.delivery_date ?? "-"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/dashboard/services/${s.id}/edit`} className="text-xs text-accent hover:underline">
                      Duzenle
                    </Link>
                    <form action={deleteService}>
                      <input type="hidden" name="id" value={s.id} />
                      <button className="text-xs text-red-500 hover:underline">Sil</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
