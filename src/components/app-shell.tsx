"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Responsive shell: static sidebar on lg+, off-canvas drawer on mobile.
export function AppShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-line bg-surface/70 px-4 py-5 backdrop-blur-xl lg:flex">
        {sidebar}
      </aside>

      {/* Mobile drawer + overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-line bg-surface px-4 py-5 transition-transform duration-200 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label="Menuyu ac"
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-lg border border-line"
          >
            <span className="h-0.5 w-4 rounded bg-ink" />
            <span className="h-0.5 w-4 rounded bg-ink" />
            <span className="h-0.5 w-4 rounded bg-ink" />
          </button>
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-semibold text-white">
            M
          </span>
          <span className="text-sm font-semibold tracking-tight text-ink">Mecenas</span>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
