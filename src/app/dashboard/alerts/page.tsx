import Link from "next/link";
import { getAlerts, type Severity } from "@/lib/alerts";

const SEV: Record<Severity, { label: string; cls: string }> = {
  high: { label: "Yuksek", cls: "bg-red-50 text-red-600 border-red-200" },
  medium: { label: "Orta", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  low: { label: "Dusuk", cls: "bg-surface-2 text-muted border-line" },
};

export default async function AlertsPage() {
  const alerts = await getAlerts();
  const byKind = alerts.reduce<Record<string, number>>((acc, a) => {
    acc[a.kind] = (acc[a.kind] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Uyarilar</h1>
        <p className="mt-1 text-sm text-muted">
          {alerts.length} aktif uyari
          {Object.keys(byKind).length > 0 && (
            <> · {Object.entries(byKind).map(([k, n]) => `${k}: ${n}`).join(" · ")}</>
          )}
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center text-sm text-faint">
          Aktif uyari yok. Her sey yolunda.
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((a) => {
            const s = SEV[a.severity];
            return (
              <li key={a.id}>
                <Link
                  href={a.href}
                  className="flex items-center justify-between rounded-2xl border border-line bg-surface elevate p-4 hover:border-line"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">{a.title}</p>
                    <p className="text-xs text-muted">{a.detail}</p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
                    {a.kind} · {s.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-xs text-faint">
        Kurallar: teslim &le; 3 gun · haftalik saat &lt; %60 · 10+ gun kayit yok.
        Ileride bu uyarilar cron + e-posta ile otomatik gonderilecek (Faz 4).
      </p>
    </div>
  );
}
