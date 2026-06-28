import { Sidebar } from "@/components/sidebar";
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

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="flex w-60 flex-col justify-between border-r border-neutral-200 bg-white p-4">
        <div>
          <div className="px-3 py-2">
            <p className="text-lg font-semibold text-neutral-900">AMOS</p>
            <p className="text-xs text-neutral-400">Sanatci Yonetim</p>
          </div>
          <div className="mt-4">
            <Sidebar alertCount={alertCount} />
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-3">
          {configured ? (
            <>
              <p className="truncate px-3 text-xs text-neutral-500">{email}</p>
              <form action={signOut}>
                <button className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-100">
                  Cikis yap
                </button>
              </form>
            </>
          ) : (
            <p className="px-3 text-xs text-amber-600">Demo modu (salt okunur)</p>
          )}
        </div>
      </aside>

      <main className="flex-1">
        {!configured && (
          <div className="border-b border-amber-200 bg-amber-50 px-8 py-2 text-xs text-amber-700">
            Demo modu — ornek veri gosteriliyor, kayit eklenemez. Gercek veri icin
            Supabase bagla (docs/SUPABASE_SETUP.md).
          </div>
        )}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
