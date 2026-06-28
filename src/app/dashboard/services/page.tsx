import { createClient } from "@/lib/supabase/server";
import { getArtistsLite, getProjectsLite } from "@/lib/queries";
import { createService, deleteService } from "@/lib/actions/services";
import { Field, Select, TextArea, SubmitButton, enumOptions } from "@/components/form";
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

export default async function ServicesPage() {
  const [services, artists, projects] = await Promise.all([
    getServices(),
    getArtistsLite(),
    getProjectsLite(),
  ]);
  const totalBudget = services.reduce((s, r) => s + Number(r.budget), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Dis Hizmetler</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {services.length} kayit · toplam butce {totalBudget.toLocaleString("tr-TR")}
        </p>
      </div>

      <form action={createService} className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-5 sm:grid-cols-2">
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

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
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
              <tr><td colSpan={7} className="px-4 py-8 text-center text-neutral-400">Henuz hizmet yok.</td></tr>
            )}
            {services.map((s) => (
              <tr key={s.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-medium text-neutral-900">{serviceTypeLabel[s.type]}</td>
                <td className="px-4 py-3 text-neutral-600">{s.artists?.name ?? "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{s.vendor ?? "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{Number(s.budget).toLocaleString("tr-TR")}</td>
                <td className="px-4 py-3 text-neutral-600">{serviceStatusLabel[s.status]}</td>
                <td className="px-4 py-3 text-neutral-600">{s.delivery_date ?? "-"}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteService}>
                    <input type="hidden" name="id" value={s.id} />
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
