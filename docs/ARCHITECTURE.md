# AMOS — Artist Management Operating System

Sanatci yonetimini, proje planlamasini, operasyonu ve stratejik karar almayi tek
platformda birlestiren olceklenebilir sistem. Excel takip tablosunun yerini alir,
uzerine otomasyon ve AI katmani ekler.

## Karar (kilitlendi)

- **Kapsam:** Dar MVP once (sen + ~5 sanatci icin ic arac), sonra cok kiracili SaaS.
- **Stack:** Next.js 16 (App Router) + TypeScript + Tailwind 4 + shadcn/ui + Supabase
  (Postgres + Auth + Storage + Realtime + RLS).
- **Veri:** Identifier'lar Ingilizce, icerik Turkce.

## Stack

| Katman      | Secim |
|-------------|-------|
| Frontend    | Next.js 16 App Router, React 19, TypeScript |
| UI          | Tailwind CSS 4, shadcn/ui, TanStack Table, React Hook Form, Recharts |
| Backend     | Supabase (Postgres, Auth, Storage, Realtime), Server Actions, Edge Functions |
| Auth        | Supabase Auth + RLS (rol: admin/manager/assistant/artist) |
| AI (sonra)  | AI Gateway / OpenAI, prompt template, RAG |

## Veri Modeli (ERD ozet)

```
profiles (auth.users 1:1, role)
   |
   | manager_id / profile_id
   v
artists 1─* projects 1─* tasks
artists 1─* weekly_plans
artists 1─* daily_logs        (project_id opsiyonel)
artists 1─* meetings
artists 1─* outputs
artists 1─* services
```

Tablolar `supabase/migrations/0001_init.sql`, RLS `0002_rls.sql`.

RLS modeli: staff (admin/manager/assistant) tam erisim; artist sadece kendi
kayitlarini okur. Per-manager scope ileride sikilastirilacak.

## Yol Haritasi (fazlar)

| Faz | Ad | Cikti |
|-----|----|-------|
| 0 | Temel | Scaffold + Supabase baglantisi + auth — deploy olan bos uygulama |
| 1 | Veri Modeli | Migration + RLS + uretilmis TS tipleri |
| 2 | MVP CRUD | 9 ekran (Dashboard, Sanatci, 6 Aylik, Haftalik, Gunluk, Dis Hizmet, Toplanti, Ciktilar, Listeler) |
| 3 | Gorsellestirme | Kanban, takvim, dashboard grafikleri, saat/risk hesaplari |
| 4 | Otomasyon | Cron edge functions, bildirim tablosu, e-posta |
| 5 | AI | Toplanti notu -> plan, yonetici ozeti, onceliklendirme, risk, RAG |
| 6 | Olcek | Multi-tenant, Storage dosya yonetimi, takvim/WhatsApp, mobil |

Her faz akisi: **Sema -> Migration -> API/Server Action -> UI -> Test -> Deploy preview.**

## Klasor Yapisi (hedef)

```
src/
  app/
    (auth)/login/
    (app)/dashboard/
      artists/  projects/  weekly/  daily/  services/  meetings/  outputs/
    layout.tsx
  components/         # shadcn + ortak UI
  lib/
    supabase/        # client.ts, server.ts
    types/           # uretilmis db tipleri
    actions/         # server actions (CRUD)
  middleware.ts
supabase/
  migrations/        # 0001_init.sql, 0002_rls.sql
  seed.sql
docs/
```

## Sprint Plani

- **Sprint 1 (MVP):** DB + auth + sanatci/proje/gunluk/haftalik CRUD + dashboard.
- **Sprint 2:** Dis hizmet + ciktilar + dosya yukleme + raporlama.
- **Sprint 3:** Bildirim + takvim + otomatik gorev + ilk AI onerileri.
- **Sprint 4:** Yonetici paneli + analizler + AI ozet + mobil + beta.
