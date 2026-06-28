import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoRow } from "@/lib/demo";
import { getProjectsLite } from "@/lib/queries";
import { updateService } from "@/lib/actions/services";
import { Field, Select, TextArea, SubmitButton, enumOptions } from "@/components/form";
import { serviceTypeLabel, serviceStatusLabel } from "@/lib/labels";
import type { ServiceType, ServiceStatus } from "@/lib/types/db";

interface Service {
  id: string;
  project_id: string | null;
  type: ServiceType;
  vendor: string | null;
  budget: number;
  status: ServiceStatus;
  delivery_date: string | null;
  invoice_status: string | null;
  notes: string | null;
}

async function getService(id: string): Promise<Service | null> {
  if (!isSupabaseConfigured()) return demoRow<Service>("services", id);
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("services").select("*").eq("id", id).single();
    return (data as Service) ?? null;
  } catch {
    return null;
  }
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [s, projects] = await Promise.all([getService(id), getProjectsLite()]);
  if (!s) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/dashboard/services" className="text-xs text-faint hover:underline">
          &larr; Dis Hizmetler
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Dis Hizmet Duzenle</h1>
      </div>

      <form action={updateService} className="grid gap-3 rounded-[20px] border border-line bg-surface elevate p-6 sm:grid-cols-2">
        <input type="hidden" name="id" value={s.id} />
        <Select name="project_id" label="Proje" defaultValue={s.project_id ?? ""} options={projects.map((p) => ({ value: p.id, label: p.name }))} />
        <Select name="type" label="Hizmet turu *" required defaultValue={s.type} options={enumOptions(serviceTypeLabel)} />
        <Field name="vendor" label="Tedarikci" defaultValue={s.vendor ?? ""} />
        <Field name="budget" label="Butce" type="number" step="0.01" defaultValue={s.budget} />
        <Select name="status" label="Durum" defaultValue={s.status} options={enumOptions(serviceStatusLabel)} />
        <Field name="delivery_date" label="Teslim tarihi" type="date" defaultValue={s.delivery_date ?? ""} />
        <Field name="invoice_status" label="Fatura durumu" defaultValue={s.invoice_status ?? ""} />
        <TextArea name="notes" label="Notlar" defaultValue={s.notes ?? ""} />
        <SubmitButton>Kaydet</SubmitButton>
      </form>
    </div>
  );
}
