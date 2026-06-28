// Sidebar navigation — mirrors the 9 Excel sheets.
export const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/alerts", label: "Uyarilar" },
  { href: "/dashboard/artists", label: "Sanatcilar" },
  { href: "/dashboard/projects", label: "Projeler" },
  { href: "/dashboard/board", label: "Pano" },
  { href: "/dashboard/weekly", label: "Haftalik Plan" },
  { href: "/dashboard/daily", label: "Gunluk Takip" },
  { href: "/dashboard/services", label: "Dis Hizmetler" },
  { href: "/dashboard/meetings", label: "Toplantilar" },
  { href: "/dashboard/outputs", label: "Ciktilar" },
] as const;
