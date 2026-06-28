# Supabase Baglama Notu

Uygulama Supabase olmadan derlenir ama veri okuyup yazmaz. Baglamak icin:

## 1. Proje olustur
- supabase.com -> New project
- Region: Frankfurt (eu-central) — TR'ye yakin, dusuk gecikme
- Guclu DB parolasi belirle, sakla

## 2. Env doldur
Proje > Settings > API'den al:
```bash
cp .env.local.example .env.local
```
```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # sadece script/seed icin
```
`anon key` istemciye gider (guvenli, RLS korur). `service_role` ASLA istemciye gitmez.

## 3. Semayi uygula
SQL Editor'de sirayla calistir:
1. `supabase/migrations/0001_init.sql`  (tablolar)
2. `supabase/migrations/0002_rls.sql`   (RLS + roller + trigger)
3. `supabase/seed.sql` (opsiyonel ornek veri)

Veya CLI ile:
```bash
npm i -g supabase
supabase link --project-ref <ref>
supabase db push
```

## 4. Ilk kullanici + staff yetkisi
Authentication > Users > Add user (email + parola).
Trigger otomatik `profiles` satiri olusturur, rol `artist` gelir.
Kendini staff yap:
```sql
update profiles set role = 'admin'
where id = (select id from auth.users where email = 'senin@mail.com');
```
> `admin/manager/assistant` = staff (tum veriye erisim). `artist` = sadece kendi verisi.

## 5. (Onerilen) Uretilmis tipler
Elle yazilan `src/lib/types/db.ts` yerine:
```bash
supabase gen types typescript --project-id <ref> > src/lib/types/db.ts
```
Sema her degistiginde tekrar calistir.

## 6. Calistir
```bash
npm run dev
```
`http://localhost:3000` -> `/login` -> giris -> `/dashboard`.

## Sorun Giderme
- **Login sonrasi bos veri:** rol `artist` kalmis olabilir; staff yap (adim 4).
- **`Invalid API key`:** `.env.local` yanlis veya dev server restart edilmedi.
- **RLS hatasi / 0 satir:** policy beklendigi gibi; staff degilsen sadece kendi
  `artists.profile_id = auth.uid()` satirlarini gorursun.
- **Trigger calismadi:** `0002_rls.sql` sonuna kadar calisti mi kontrol et.

## Guvenlik notu
- `.env.local` git'e girmez (`.gitignore`'da). Anahtarlari commit etme.
- `service_role` sadece sunucu tarafi script/seed icin. Repo'da kullanim yok.
