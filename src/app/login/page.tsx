import { signIn } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-base font-semibold text-white">
            M
          </span>
          <div className="leading-tight">
            <h1 className="text-base font-semibold tracking-tight text-ink">Mecenas</h1>
            <p className="text-xs text-faint">Sanatci Yonetim Sistemi</p>
          </div>
        </div>

        <form action={signIn} className="mt-6 space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-muted">E-posta</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink transition placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
              placeholder="ornek@mail.com"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-muted">Sifre</label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 active:translate-y-px"
          >
            Giris yap
          </button>
        </form>
      </div>
    </main>
  );
}
