import { Sidebar } from "@/components/sidebar";
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="flex w-60 flex-col justify-between border-r border-neutral-200 bg-white p-4">
        <div>
          <div className="px-3 py-2">
            <p className="text-lg font-semibold text-neutral-900">AMOS</p>
            <p className="text-xs text-neutral-400">Sanatci Yonetim</p>
          </div>
          <div className="mt-4">
            <Sidebar />
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-3">
          <p className="truncate px-3 text-xs text-neutral-500">{user?.email}</p>
          <form action={signOut}>
            <button className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-100">
              Cikis yap
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
