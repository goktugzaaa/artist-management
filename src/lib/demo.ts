// Offline demo dataset. Used when Supabase is not configured so the whole UI
// is browsable without an account. Read-only; writes are no-ops in demo mode.
import type {
  Artist, Project, WeeklyPlan, DailyLog,
} from "@/lib/types/db";

const A1 = "demo-artist-1";
const A2 = "demo-artist-2";
const A3 = "demo-artist-3";
const P1 = "demo-project-1";
const P2 = "demo-project-2";
const P3 = "demo-project-3";

function isoDaysFromNow(d: number): string {
  return new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);
}
function weekStart(weeksAgo: number): string {
  const d = new Date(Date.now() - weeksAgo * 7 * 864e5);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}
const NOW = new Date().toISOString();

export const demoArtists: Artist[] = [
  {
    id: A1, profile_id: null, manager_id: null, name: "Ahmet Yilmaz",
    email: "ahmet@ornek.com", phone: "0532 000 0001", specialty: "Resim",
    working_style: "Studyo, sabah", motivation: "Sergi hedefi", production_cycle: "Aylik seri",
    notes: "Yeni sergi hazirligi", created_at: NOW, updated_at: NOW,
  },
  {
    id: A2, profile_id: null, manager_id: null, name: "Elif Demir",
    email: "elif@ornek.com", phone: "0532 000 0002", specialty: "Heykel",
    working_style: "Atolye, yogun", motivation: "Uluslararasi fuar", production_cycle: "Proje bazli",
    notes: "Portfolyo guncellenecek", created_at: NOW, updated_at: NOW,
  },
  {
    id: A3, profile_id: null, manager_id: null, name: "Can Kaya",
    email: "can@ornek.com", phone: "0532 000 0003", specialty: "Fotograf",
    working_style: "Saha, esnek", motivation: "Kitap projesi", production_cycle: "Haftalik",
    notes: "Web sitesi eksik", created_at: NOW, updated_at: NOW,
  },
];

export const demoProjects: (Project & { artists: { name: string } })[] = [
  { id: P1, artist_id: A1, name: "Bahar Sergisi", description: "12 eserlik kisisel sergi",
    status: "active", priority: "high", deadline: isoDaysFromNow(9), created_at: NOW, updated_at: NOW,
    artists: { name: "Ahmet Yilmaz" } },
  { id: P2, artist_id: A2, name: "Fuar Hazirligi", description: "Stand + katalog",
    status: "planned", priority: "urgent", deadline: isoDaysFromNow(20), created_at: NOW, updated_at: NOW,
    artists: { name: "Elif Demir" } },
  { id: P3, artist_id: A3, name: "Foto Kitap", description: "60 sayfa baski",
    status: "active", priority: "medium", deadline: isoDaysFromNow(4), created_at: NOW, updated_at: NOW,
    artists: { name: "Can Kaya" } },
];

export const demoWeekly: (WeeklyPlan & { artists: { name: string } })[] = [
  { id: "w1", artist_id: A1, week_start: weekStart(2), focus: "Tuval hazirligi", planned_hours: 20, actual_hours: 18, status: "on_track", review: null, created_at: NOW, artists: { name: "Ahmet Yilmaz" } },
  { id: "w2", artist_id: A1, week_start: weekStart(1), focus: "Boyama", planned_hours: 25, actual_hours: 12, status: "at_risk", review: null, created_at: NOW, artists: { name: "Ahmet Yilmaz" } },
  { id: "w3", artist_id: A2, week_start: weekStart(1), focus: "Kalip", planned_hours: 30, actual_hours: 31, status: "done", review: "Iyi gitti", created_at: NOW, artists: { name: "Elif Demir" } },
  { id: "w4", artist_id: A3, week_start: weekStart(0), focus: "Cekim", planned_hours: 15, actual_hours: 5, status: "at_risk", review: null, created_at: NOW, artists: { name: "Can Kaya" } },
];

export const demoDaily: (DailyLog & { artists: { name: string }; projects: { name: string } | null })[] = [
  { id: "d1", artist_id: A1, project_id: P1, log_date: isoDaysFromNow(-1), hours: 4, done: "Eskiz", todo: "Renk testi", blockers: null, owner: "self", status: "in_progress", priority: "high", next_micro_step: "Palet sec", created_at: NOW, artists: { name: "Ahmet Yilmaz" }, projects: { name: "Bahar Sergisi" } },
  { id: "d2", artist_id: A3, project_id: P3, log_date: isoDaysFromNow(0), hours: 3, done: "Mekan kesfi", todo: "Cekim listesi", blockers: "Hava", owner: "with_manager", status: "in_progress", priority: "medium", next_micro_step: "Ekipman kira", created_at: NOW, artists: { name: "Can Kaya" }, projects: { name: "Foto Kitap" } },
];

export const demoMeetings = [
  { id: "m1", artist_id: A1, meeting_date: isoDaysFromNow(-3), decisions: "Sergi tarihi netlesti", mood: "Motive", next_action: "Mekan rezervasyonu", artists: { name: "Ahmet Yilmaz" } },
  { id: "m2", artist_id: A2, meeting_date: isoDaysFromNow(-7), decisions: "Katalog tasarimcisi secildi", mood: "Yorgun", next_action: "Brief gonder", artists: { name: "Elif Demir" } },
];

export const demoOutputs = [
  { id: "o1", artist_id: A1, type: "portfolio" as const, title: "2026 Portfolyo PDF", status: "in_progress" as const, link: null, artists: { name: "Ahmet Yilmaz" } },
  { id: "o2", artist_id: A2, type: "price_list" as const, title: "Fiyat Listesi", status: "todo" as const, link: null, artists: { name: "Elif Demir" } },
  { id: "o3", artist_id: A3, type: "photo" as const, title: "Eser Fotograflari", status: "done" as const, link: "https://example.com", artists: { name: "Can Kaya" } },
];

export const demoServices = [
  { id: "s1", artist_id: A1, type: "photography" as const, vendor: "Foto Stud", budget: 8000, status: "in_progress" as const, delivery_date: isoDaysFromNow(6), artists: { name: "Ahmet Yilmaz" } },
  { id: "s2", artist_id: A2, type: "catalog" as const, vendor: "Baski A.S.", budget: 15000, status: "requested" as const, delivery_date: isoDaysFromNow(18), artists: { name: "Elif Demir" } },
];

// table -> demo rows, for the artist detail page child lists.
export const demoByTable: Record<string, { artist_id: string }[]> = {
  projects: demoProjects,
  weekly_plans: demoWeekly,
  daily_logs: demoDaily,
  meetings: demoMeetings,
  outputs: demoOutputs,
  services: demoServices,
};

export function demoArtist(id: string): Artist | null {
  return demoArtists.find((a) => a.id === id) ?? null;
}

// Single demo row by table + id, for entity edit pages.
export function demoRow<T>(table: string, id: string): T | null {
  const rows = demoByTable[table] as unknown as { id: string }[] | undefined;
  return (rows?.find((r) => r.id === id) as T) ?? null;
}
