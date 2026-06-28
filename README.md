# AMOS — Artist Management OS

Sanatci yonetim, proje planlama ve operasyon platformu. Next.js 16 + Supabase.

Mimari ve yol haritasi: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Demo modu (Supabase olmadan)

Env yoksa uygulama **offline demo modunda** calisir: ornek veriyle dolu, auth yok,
tum ekranlar gezilebilir. Kayit ekleme/silme kapali (salt okunur).

```bash
npm install
npm run dev
# http://localhost:3000 -> /dashboard (login gerekmez)
```

Gercek veri + kayit icin Supabase bagla (asagi).

## Kurulum

1. Bagimliliklar:
   ```bash
   npm install
   ```

2. Supabase projesi olustur (supabase.com) ve env doldur:
   ```bash
   cp .env.local.example .env.local
   # NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY gir
   ```

3. Semayi uygula. Supabase Studio > SQL Editor'de sirayla calistir:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_rls.sql`
   - (opsiyonel) `supabase/seed.sql`

   Veya Supabase CLI ile:
   ```bash
   supabase db push
   ```

4. Ilk kullaniciyi olustur ve staff yap. Studio > Authentication'da kullanici
   ekle, sonra SQL Editor'de:
   ```sql
   update profiles set role = 'admin' where id = '<user-id>';
   ```

5. Gelistirme:
   ```bash
   npm run dev
   ```
   `/login` -> giris -> `/dashboard`.

## Durum

- [x] Faz 0: Scaffold, Supabase baglantisi, auth, dashboard shell
- [x] Faz 1: Veri modeli + RLS (9 tablo)
- [x] Faz 2: MVP CRUD — 8 ekran (sanatci, proje, gunluk, haftalik, dis hizmet, toplanti, cikti) + dashboard KPI
- [ ] Faz 3+: Gorsellestirme, otomasyon, AI

Detayli yol haritasi: [docs/ROADMAP.md](docs/ROADMAP.md) · Supabase baglama: [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)
