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
- [ ] shadcn/ui standardina gecis (tablo/form/dialog)
- [ ] Sanatci detay sayfasi (tek panel: projeler+toplantilar+ciktilar)
- [ ] Inline edit (su an create + delete var, update yok)

## Faz 3 — Gorsellestirme  `[ ]`
- [ ] Kanban (proje/gorev surukle-birak)
- [ ] Takvim (deadline + toplanti)
- [ ] Dashboard grafikleri (Recharts): saat trendi, durum dagilimi
- [ ] Hesaplamalar: planlanan vs gerceklesen saat, risk skoru
- [ ] Filtre/arama/siralama (TanStack Table)

## Faz 4 — Otomasyon  `[ ]`
- [ ] `notifications` tablosu
- [ ] Cron edge functions:
  - [ ] 10 gun giris yok -> hatirlatma
  - [ ] Deadline 3 gun -> bildirim
  - [ ] Haftalik saat < %60 -> risk
  - [ ] Portfolyo 6 ay eski -> hatirlatma
- [ ] E-posta entegrasyonu (Resend / Supabase)

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
