import { Sidebar } from "@/components/sidebar";
import { AppShell } from "@/components/app-shell";
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { getAlerts } from "@/lib/alerts";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = isSupabaseConfigured();
  let email: string | undefined;
  if (configured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email;
  }

  const alertCount = (await getAlerts()).length;

  const sidebar = (
    <>
      <div>
        <div className="flex items-center gap-2.5 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-white">
            M
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-ink">Mecenas</p>
            <p className="text-[11px] text-faint">Sanatci Yonetim</p>
          </div>
        </div>
        <div className="mt-6">
          <Sidebar alertCount={alertCount} />
        </div>
      </div>

      <div className="border-t border-line pt-3">
        {configured ? (
          <>
            <p className="truncate px-2 text-xs text-muted">{email}</p>
            <form action={signOut}>
              <button className="mt-1 w-full rounded-lg px-2 py-2 text-left text-sm text-muted transition hover:bg-surface-2 hover:text-ink">
                Cikis yap
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center gap-2 px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <p className="text-xs text-muted">Demo modu</p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <AppShell sidebar={sidebar}>
      {!configured && (
        <div className="border-b border-line bg-accent-soft px-4 py-2 text-xs text-accent-ink sm:px-8">
          Demo modu — ornek veriyle calisiyor, kayit eklenemez. Gercek veri icin Supabase bagla.
        </div>
      )}
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 sm:py-8">{children}</div>
    </AppShell>
  );
}
