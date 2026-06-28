"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav";

export function Sidebar({ alertCount = 0 }: { alertCount?: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        const badge = item.href === "/dashboard/alerts" && alertCount > 0 ? alertCount : null;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
              active
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:bg-surface-2 hover:text-ink"
            }`}
          >
            <span>{item.label}</span>
            {badge && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium tnum ${
                  active ? "bg-white/20 text-white" : "bg-accent-soft text-accent-ink"
                }`}
              >
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
