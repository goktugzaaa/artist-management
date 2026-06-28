# AMOS — Yol Haritasi (Roadmap)

Durum isaretleri: `[x]` bitti · `[~]` devam · `[ ]` bekliyor

## Faz 0 — Temel  `[x]`
- [x] Next.js 16 + TS + Tailwind 4 scaffold
- [x] Supabase client/server + session proxy
- [x] Auth (email/sifre) + login ekrani
- [x] Dashboard shell + sidebar (8 bolum)
- [x] Build temiz, deploy'a hazir

## Faz 1 — Veri Modeli  `[x]`
- [x] 9 tablo + enum + index (`0001_init.sql`)
- [x] RLS + rol modeli (staff/artist) (`0002_rls.sql`)
- [x] Signup -> profil auto-trigger
- [ ] Uretilmis TS tipleri (Supabase baglaninca `supabase gen types`)

## Faz 2 — MVP CRUD  `[x]`
- [x] Sanatcilar (sablon dilim)
- [x] Dashboard KPI
- [x] Projeler (FK: sanatci)
- [x] Gunluk Takip (FK: sanatci, proje)
- [x] Haftalik Plan (saat farki hesabi)
- [x] Dis Hizmetler (butce toplami)
- [x] Toplantilar
- [x] Ciktilar (link)
- [x] Sanatci detay sayfasi (tek panel: profil+projeler+haftalik+gunluk+toplanti+cikti+hizmet)
- [x] Sanatci duzenle (update)
- [ ] Diger ekranlar icin update/edit (proje, gunluk, vb.)
- [ ] shadcn/ui standardina gecis (tablo/form/dialog)

## Faz 3 — Gorsellestirme  `[~]`
- [x] Dashboard grafikleri (Recharts): haftalik saat trendi, proje durum dagilimi
- [x] Hesaplamalar: planlanan vs gerceklesen saat, risk skoru (%60 alti)
- [x] Yaklasan teslimler (14 gun) + risk listesi
- [ ] Kanban (proje/gorev surukle-birak)
- [ ] Takvim (deadline + toplanti)
- [ ] Filtre/arama/siralama (TanStack Table)

## Faz 4 — Otomasyon  `[~]`
- [x] Uyari motoru (lib/alerts.ts) — okuma aninda hesaplanir, demo+canli
  - [x] Deadline <= 3 gun
  - [x] Haftalik saat < %60
  - [x] 10+ gun gunluk kayit yok
- [x] Uyari merkezi sayfasi + sidebar rozet (sayac)
- [ ] `notifications` tablosu (snapshot + okundu durumu)
- [ ] Cron edge function (uyarilari periyodik snapshot)
- [ ] E-posta entegrasyonu (Resend / Supabase)
- [ ] Portfolyo 6 ay eski -> hatirlatma

## Faz 5 — AI Katmani  `[ ]`
- [ ] Toplanti notu -> haftalik plan onerisi
- [ ] Haftalik yonetici ozeti
- [ ] Gorev onceliklendirme
- [ ] Risk analizi
- [ ] RAG (sanatci gecmisi + proje dokumanlari context)

## Faz 6 — Olcek  `[ ]`
- [ ] Multi-tenant sertlestirme (per-manager scope)
- [ ] Storage: eser gorsel/PDF/video yukleme
- [ ] Takvim sync (Google)
- [ ] WhatsApp / e-posta bildirim
- [ ] Mobil uyum / PWA
- [ ] Beta yayini

## Sprint Plani

| Sprint | Sure | Kapsam |
|--------|------|--------|
| 1 | 2 hf | DB + auth + sanatci/proje/gunluk/haftalik CRUD + dashboard |
| 2 | 2 hf | Dis hizmet + ciktilar + dosya yukleme + raporlama |
| 3 | 2 hf | Bildirim + takvim + otomatik gorev + ilk AI |
| 4 | 2-3 hf | Yonetici paneli + analiz + AI ozet + mobil + beta |

## Her Ozellik Akisi
`Sema -> Migration -> API/Server Action -> UI -> Test -> Deploy preview`
