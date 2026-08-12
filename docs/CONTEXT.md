# DaurNusa — Context Teknis (Developer Context)

## 1. Tujuan Dokumen

Dokumen ini melengkapi `PRD_DaurNusa.md`. Jika PRD menjelaskan **apa** yang dibangun dan **mengapa**, dokumen ini menjelaskan **bagaimana** membangunnya secara teknis — tech stack, arsitektur, struktur folder, dan konvensi kerja tim. Dokumen ini juga bisa dipakai sebagai instruksi dasar bagi AI coding assistant yang membantu tim mengerjakan proyek ini.

Semua ID kebutuhan fungsional (AUTH, LST, REQ, MTC, CHT, TRX, STAT, KLS, RVW, ADM) yang dirujuk di sini mengacu ke Bab 6 `PRD_DaurNusa.md`.

## 2. Ringkasan Proyek

DaurNusa adalah platform web marketplace dua sisi yang mempertemukan Seller (masyarakat/UMKM penghasil sampah) dan Buyer (pencari sampah/limbah) berdasarkan kategori sampah dan kedekatan lokasi, dilengkapi chat real-time dan klasifikasi sampah otomatis berbasis computer vision. Proyek ini dikembangkan untuk lomba **ITechnoCup** dengan tema SDGs 7, 8, 9, dan 11, dengan tenggat pengumpulan dokumen **6 September 2026**.

## 3. Tim & Pembagian Kerja

| Nama  | Fokus                       |
| ----- | --------------------------- |
| Alfin | Computer Vision & Fullstack |
| Raki  | Fullstack                   |
| Ahmad | Fullstack                   |

Karena ketiganya fullstack, pembagian kerja disarankan **per modul** (lihat Bab 7 di bawah), bukan per layer (frontend/backend), agar tidak saling menunggu satu sama lain.

## 4. Tech Stack

| Layer              | Teknologi                                                     | Status                                                                          |
| ------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Frontend           | Next.js                                                       | Ditentukan tim                                                                  |
| Backend            | Next.js (Route Handlers / Server Actions, fullstack monolith) | Ditentukan tim                                                                  |
| Database           | Supabase (PostgreSQL)                                         | Ditentukan tim                                                                  |
| Autentikasi        | Supabase Auth (email/password) + Google OAuth                 | Sebagian ditentukan — Google OAuth perlu setup                                  |
| Storage foto       | Supabase Storage                                              | Ditentukan tim                                                                  |
| Realtime chat      | Supabase Realtime                                             | Asumsi teknis, cocok untuk kebutuhan CHT-2                                      |
| Computer Vision    | Roboflow atau Google Teachable Machine                        | **TBD** — belum final                                                           |
| Peta / Geocoding   | Asumsi: OpenStreetMap Nominatim                               | **TBD** — perlu konfirmasi, termasuk klarifikasi istilah "OPM" dari diskusi tim |
| Email notifikasi   | Belum ditentukan (mis. Resend, SendGrid)                      | **TBD**                                                                         |
| Hosting/Deployment | Belum ditentukan                                              | **TBD** — tim akan menentukan kemudian                                          |

## 5. Arsitektur Sistem (Ringkas)

```
[Browser - Next.js Client]
            │
            ▼
[Next.js Server - Route Handlers / Server Actions]
   │            │              │              │
   ▼            ▼              ▼              ▼
[Supabase]  [CV Provider]  [Geocoding]   [Email Provider]
 DB, Auth,   Roboflow /     OSM Nomi-     Resend/SendGrid/
 Storage,    Teachable      natim (TBD)   dsb (TBD)
 Realtime    Machine (TBD)
```

Pendekatan: monolith Next.js dengan Supabase sebagai backend-as-a-service (database, auth, storage, realtime). Layanan eksternal (CV, geocoding, email) dipanggil dari sisi server (Route Handler) agar API key tidak terekspos ke client.

## 6. Struktur Folder Usulan (Next.js App Router)

```
daurnusa/
├─ app/
│  ├─ (auth)/
│  │  ├─ login/
│  │  └─ register/
│  ├─ (main)/
│  │  ├─ listings/          # LST - Seller
│  │  ├─ requests/          # REQ - Buyer
│  │  ├─ matches/           # MTC
│  │  ├─ chat/[id]/         # CHT
│  │  ├─ transactions/      # TRX
│  │  ├─ profile/[id]/      # STAT, RVW
│  │  └─ admin/             # ADM
│  └─ api/
│     ├─ classify/          # KLS - proxy ke CV provider
│     ├─ geocode/           # proxy ke layanan geocoding
│     └─ webhooks/
├─ components/
├─ lib/
│  ├─ supabase/
│  ├─ cv/
│  ├─ geocode/
│  └─ email/
├─ types/
└─ ...
```

Struktur ini usulan awal, dapat disesuaikan tim saat implementasi dimulai.

## 7. Pemetaan Modul ke Kebutuhan Fungsional PRD

| Modul                         | Prefix PRD | Folder Terkait                                      |
| ----------------------------- | ---------- | --------------------------------------------------- |
| Autentikasi & Profil          | AUTH       | `app/(auth)/`, `lib/supabase/`                      |
| Listing Sampah (Seller)       | LST        | `app/(main)/listings/`                              |
| Permintaan Sampah (Buyer)     | REQ        | `app/(main)/requests/`                              |
| Pencocokan Otomatis           | MTC        | `app/(main)/matches/`, trigger/function di Supabase |
| Chat & Negosiasi              | CHT        | `app/(main)/chat/[id]/`                             |
| Transaksi                     | TRX        | `app/(main)/transactions/`                          |
| Statistik & Riwayat Penjualan | STAT       | `app/(main)/profile/[id]/`                          |
| Klasifikasi Computer Vision   | KLS        | `app/api/classify/`, `lib/cv/`                      |
| Rating & Ulasan               | RVW        | `app/(main)/profile/[id]/`                          |
| Admin                         | ADM        | `app/(main)/admin/`                                 |

## 8. Autentikasi & Otorisasi

- Gunakan Supabase Auth (email/password + provider Google).
- Buat tabel `public.users` sebagai extended profile, disinkronkan dari `auth.users` lewat trigger/function saat sign-up.
- Kolom `is_admin` pada `users` menentukan akses ke rute `/admin/*`.
- Tidak ada role tetap Seller/Buyer di level akun — dibedakan dari konteks aksi (lihat PRD Bab 5).
- Terapkan Row Level Security (RLS) Supabase pada semua tabel agar pengguna hanya bisa mengubah data miliknya sendiri; kebijakan tambahan untuk Admin lewat pengecekan `is_admin`.

## 9. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # server-only, jangan pernah expose ke client

CV_PROVIDER_API_KEY=             # Roboflow atau Teachable Machine - TBD
CV_PROVIDER_MODEL_ENDPOINT=

GEOCODING_API_URL=               # asumsi: Nominatim OSM - TBD

EMAIL_PROVIDER_API_KEY=          # TBD

GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
```

## 10. Alur Data Kritis

### 10.1 Upload & Klasifikasi Foto (KLS)

1. Client mengunggah foto ke Supabase Storage → mendapat URL.
2. Client (atau server) mengirim URL/foto ke `/api/classify`.
3. Route handler meneruskan foto ke CV provider (Roboflow/Teachable Machine).
4. Hasil prediksi (kategori + tingkat keyakinan) dikembalikan ke client untuk ditinjau/dikoreksi Seller (KLS-2).
5. Saat listing disimpan, hasil akhir (dikoreksi atau tidak) disimpan pada kolom prediksi CV di tabel `listings`.

### 10.2 Matching Engine (MTC)

Pencocokan dijalankan setiap kali listing atau permintaan baru dibuat (via Supabase Database Function/Trigger, atau logic di server): cocokkan kategori yang sama, hitung jarak dari hasil geocoding, simpan ke tabel `matches`, urutkan berdasarkan jarak terdekat.

### 10.3 Chat Realtime (CHT)

Gunakan Supabase Realtime pada tabel `messages`, subscribe per `conversation_id` agar pesan baru langsung muncul di kedua sisi tanpa refresh.

### 10.4 Transaksi & Statistik (TRX, STAT)

Saat transaksi ditandai "Selesai": ubah status `listings` terkait menjadi "terjual", lalu hitung statistik (total pendapatan, jumlah transaksi) via query agregasi saat halaman profil diakses — tidak perlu tabel statistik terpisah untuk MVP.

## 11. Keamanan & Privasi

- Jangan tampilkan alamat lengkap & nomor telepon secara publik di listing/permintaan — hanya setelah percakapan terbentuk antara Seller dan Buyer (selaras dengan NFR di PRD Bab 9).
- Validasi ukuran & tipe file foto saat proses upload.
- `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di server, tidak pernah dikirim ke client.

## 12. Konvensi Kerja Tim

- Branch: `main` (stabil), `dev` (integrasi), branch fitur `feat/<modul>-<deskripsi>` — contoh: `feat/lst-form-listing`.
- Commit message ringkas berpola `<modul>: <perubahan>` — contoh: `lst: tambah form upload foto`.
- Karena tim kecil (3 orang) dan waktu lomba terbatas, disarankan sinkronisasi singkat setiap hari untuk menghindari konflik kerja di modul yang sama.

## 13. Referensi

- PRD: `PRD_DaurNusa.md`
- ERD: kode DBML dibagikan langsung di percakapan tim; disarankan disimpan sebagai project baru di dbdiagram.io bernama "DaurNusa_ERD" agar mudah diakses bersama.

## 14. Catatan Teknis Terbuka (TBD)

- Provider computer vision final: Roboflow vs Google Teachable Machine.
- Provider geocoding final (asumsi sementara: OpenStreetMap Nominatim) — termasuk klarifikasi istilah "OPM" dari diskusi tim.
- Provider email final untuk notifikasi.
- Platform hosting final (tim akan menentukan kemudian).
- Konfirmasi App Router vs Pages Router pada Next.js — dokumen ini berasumsi App Router.

---

_Dokumen ini merupakan draft sementara dan dapat berubah seiring pembahasan lebih lanjut dengan tim._
