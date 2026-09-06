<div align="center">
  
  # 🚀 Daur Nusa
  ### Inovasi Web Modern, Kecerdasan Edge AI & Marketplace untuk Pengelolaan Daur Ulang
  
  [![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-success?style=for-the-badge)](https://daurnusa.algaray.biz.id)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/ahmadchoms/itechnocup-2026)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
  
  **Submission for ITECHNO CUP 2026 - Web Development**
  
  **By Londo Ireng**
  
</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Unggulan](#-fitur-unggulan)
- [Demo & Screenshot](#-demo--screenshot)
- [Teknologi](#-teknologi)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Instalasi & Setup](#-instalasi--setup)
- [Penggunaan](#-penggunaan)
- [Tim Developer](#-tim-developer)
- [Lisensi](#-lisensi)

---

## 👥 Tim Developer

| Nama                     | Peran                               | GitHub                                   |
| ------------------------ | ----------------------------------- | ---------------------------------------- |
| **Ahmad Chomsin S.**     | Full Stack Developer                | [GitHub](https://github.com/ahmadchoms) |
| **Alfin Razzaq Nirwana** | Project Lead & Full Stack Developer | [GitHub](https://github.com/Algaray02) |
| **Raki Abhista Prakoso** | Full Stack Developer                | [GitHub](https://github.com/RakiAbhistaPrakoso) |

---

## 🎯 Tentang Proyek

### Latar Belakang

Berdasarkan data Sistem Informasi Pengelolaan Sampah Nasional (SIPSN) Kementerian Lingkungan Hidup dan Kehutanan (KLHK), timbulan sampah nasional di Indonesia mencapai puluhan juta ton per tahun, di mana sekitar 61% hingga 65% di antaranya masih belum terkelola dengan baik dan berakhir mencemari lingkungan atau menumpuk di Tempat Pemrosesan Akhir (TPA). Salah satu faktor utama dari tingginya angka sampah yang tidak terkelola ini adalah rendahnya efisiensi pemilahan sampah di tingkat sumber (rumah tangga dan fasilitas publik), akibat minimnya edukasi serta kesulitan masyarakat dalam mengidentifikasi kategori sampah daur ulang (_recycle_) secara akurat dan cepat.

Selain edukasi, kendala terbesar lainnya adalah **terputusnya rantai distribusi** antara masyarakat yang sudah memilah sampah dengan pihak pengepul atau UMKM daur ulang. Seringkali warga bingung ke mana harus menyalurkan sampah bernilai ekonomis mereka.

### Solusi yang Ditawarkan

**Daur Nusa** hadir untuk menyelesaikan masalah tersebut melalui platform *Marketplace Peer-to-Peer* terintegrasi yang menghubungkan Warga (Penyedia Sampah) langsung dengan UMKM/Pengepul (Pembeli Sampah). Pendekatan kami sangat unik karena menggabungkan:
1. **Edge AI & Client-Side Processing**: Klasifikasi jenis sampah dilakukan secara langsung di dalam browser pengguna menggunakan model lokal, membuat identifikasi instan tanpa _latency_ dan menghemat kuota.
2. **Geo-Location Matchmaking**: Mempertemukan *Listing* (penawaran sampah dari warga) dengan *Request* (permintaan dari pengepul) berdasarkan jarak terdekat menggunakan peta interaktif.
3. **Sistem Jual Beli & Komunikasi Real-time**: Transaksi sampah yang aman dan terukur yang dilengkapi sistem *live chat* langsung antara pengguna.

### Tujuan Proyek

- 🎯 **Tujuan Utama**: Meningkatkan efisiensi pemilahan sampah daur ulang berbasis masyarakat dan memfasilitasi transaksi ekonomi sirkular antara warga dan pengepul UMKM.
- 📊 **Target Pengguna**: Masyarakat umum (Warga) yang ingin menyalurkan sampah daur ulangnya dan mendapatkan nilai ekonomis, serta Pengepul/UMKM Daur Ulang yang membutuhkan pasokan material secara konsisten.
- 💡 **Value Proposition**: Ekosistem Jual-Beli Sampah terpadu yang ditenagai oleh kecerdasan buatan (Edge AI) untuk identifikasi instan dan algoritma pencocokan berbasis lokasi geospasial.

---

## ✨ Fitur Unggulan

### Fitur Utama

| Fitur | Deskripsi | Keunggulan |
|-------|-----------|------------|
| **Marketplace Sampah (Listing & Request)** | Sistem jual beli dua arah. Warga bisa membuat penawaran (*Listing*) sampah, UMKM bisa membuat permintaan (*Request*). | Membentuk rantai pasok ekonomi sirkular yang transparan dan saling menguntungkan. |
| **Edge AI Garbage Classifier** | Deteksi jenis sampah daur ulang berbasis kecerdasan buatan (*TensorFlow.js*) secara langsung di browser pengguna. | Proses instan tanpa _latency_, hemat kuota internet, dan menjaga privasi pengguna. |
| **Geo-Location Matchmaking** | Pencocokan otomatis antara penjual dan pembeli sampah berdasarkan titik koordinat dan jarak terdekat menggunakan peta interaktif. | Meminimalisir biaya logistik dan memudahkan pertemuan antara warga dan UMKM lokal. |
| **Real-time Chat & Transaction** | Modul komunikasi percakapan langsung (*Chat*) dan rekam jejak transaksi yang aman di dalam platform. | Membangun kepercayaan (*trust*) melalui transparansi transaksi dan sistem *Review & Rating*. |

### Fitur Tambahan

- **Multi-Role System** - Akses khusus yang dibedakan antara Warga, UMKM/Petugas, dan Admin. Termasuk fitur validasi aplikasi *Buyer* (UMKM) melalui KTP & Foto Outlet.
- **Responsive Mobile-First Interface** - Antarmuka intuitif dan responsif di berbagai ukuran perangkat menggunakan Tailwind CSS dan komponen Shadcn UI.
- **Server Actions Automation** - Memanfaatkan arsitektur *Next.js Server Actions* terbaru untuk mutasi data yang cepat, aman, dan tanpa perlu membuat endpoint API tradisional.

---

## 📸 Demo & Screenshot

### Live Demo

🔗 **[Kunjungi Daur Nusa](https://daurnusa.algaray.biz.id)**

### Screenshot Aplikasi

*(Gambar-gambar di bawah dapat dilihat di folder `public/docs/screenshots`)*

<div align="center">
  <img src="/docs/screenshots/homepage.png" alt="Homepage" width="800"/>
  <p><em>Homepage - Tampilan utama aplikasi Daur Nusa</em></p>
  
  <img src="/docs/screenshots/ai-scanner.png" alt="AI Scanner" width="800"/>
  <p><em>Edge AI Scanner - Identifikasi sampah real-time melalui kamera</em></p>
  
  <img src="/docs/screenshots/marketplace.png" alt="Marketplace" width="800"/>
  <p><em>Marketplace - Halaman listing dan permintaan (request) sampah daur ulang</em></p>
  
  <img src="/docs/screenshots/maps.png" alt="Maps Matchmaking" width="800"/>
  <p><em>Matchmaking Lokasi - Peta interaktif mempertemukan warga dan pengepul terdekat</em></p>
</div>

---

## 🛠️ Teknologi

### Tech Stack

#### Frontend
```
Framework    : Next.js 16.3.0 (App Router)
UI Library   : Tailwind CSS, Shadcn UI, Framer Motion
Maps         : React-Leaflet
State Mgmt   : React Hooks
Validation   : Zod & React Hook Form
AI Client    : @tensorflow/tfjs (Edge Classification)
```

#### Backend & Data
```
Runtime      : Node.js
Architecture : Next.js Server Actions (No traditional API routes)
Database     : PostgreSQL
ORM          : Prisma ORM
Auth         : Custom (bcryptjs) & @supabase/ssr
AI Provider  : @google/genai (Gemini)
```

#### DevOps & Tools
```
Deployment   : Vercel Platform
CI/CD        : GitHub Actions & Vercel Auto Deploy
```

### Dependencies Utama

```json
{
  "dependencies": {
    "@google/genai": "^2.19.0",
    "@prisma/client": "^7.9.1",
    "@supabase/supabase-js": "^2.112.3",
    "@tensorflow/tfjs": "^4.22.0",
    "bcryptjs": "^3.0.3",
    "next": "16.3.0",
    "pg": "^8.23.0",
    "react": "19.2.8",
    "react-leaflet": "^5.0.0",
    "shadcn": "^4.16.2",
    "zod": "^4.4.3"
  }
}
```

---

## 🏗️ Arsitektur Sistem

### Database Schema (ERD)

Database dirancang sangat terstruktur untuk mendukung proses Jual Beli (Marketplace) secara *Peer-to-Peer*. Berikut adalah entitas utama sistem:

1. **User**: Menyimpan data pengguna dengan role (`WARGA`, `PETUGAS`, `UMKM`, `ADMIN`) dan koordinat lokasi (Latitude, Longitude).
2. **WasteCategory**: Kategori sampah (Plastik, Kertas, Logam, dll).
3. **Listing**: Penawaran sampah dari pengguna (Sellers). Memiliki estimasi berat, harga, serta integrasi hasil pemindaian kamera (`cvPredictedCategoryId`).
4. **WasteRequest**: Permintaan sampah dari pengepul (Buyers) yang membutuhkan bahan baku daur ulang tertentu.
5. **Match**: Sistem pencocokan antara `Listing` dan `WasteRequest` berdasarkan `distance_km` terdekat.
6. **Conversation & Message**: Modul chat komunikasi langsung.
7. **Transaction & Review**: Pencatatan akhir jual-beli dan sistem rating kepuasan.

### Folder Structure

```
itechnocup-2026/
├── prisma/               # Schema Database Relasional (PostgreSQL)
│   ├── schema.prisma     
│   └── seed.ts           
├── public/               
│   ├── model_ai_class/   # File Biner & Bobot Model AI Klasifikasi Edge Lokal
│   └── docs/screenshots/ # Direktori aset gambar untuk dokumentasi
├── src/                  
│   ├── actions/          # Next.js Server Actions (Pengganti API Routes: auth, listing, geo, dll)
│   ├── app/              # App Router Pages ((auth), admin, chat, listings, profile, requests)
│   ├── components/       # Reusable UI & Shadcn Components
│   └── lib/              # Konfigurasi Utility, Prisma Client, Supabase Client
├── components.json       # Konfigurasi Komponen UI/Shadcn
├── next.config.ts        # Konfigurasi Utama Next.js
└── package.json          # Dependensi Proyek
```

---

## ⚙️ Instalasi & Setup

### Prerequisites

Pastikan Anda telah menginstall:
- **Node.js** (v18.x atau lebih tinggi)
- **npm** / **yarn** / **pnpm**
- **PostgreSQL Database**
- **Git**

### Langkah Instalasi

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/ahmadchoms/itechnocup-2026.git
cd itechnocup-2026
```

#### 2️⃣ Install Dependencies

```bash
npm install
```

#### 3️⃣ Setup Environment Variables

Buat file `.env` di root directory:

```env
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Supabase Storage/Auth (Opsional jika digunakan)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# AI Integration
GEMINI_API_KEY="your-gemini-api-key"
```

#### 4️⃣ Setup Database

```bash
# Jalankan migrasi database
npx prisma migrate dev

# Seed data awal kategori & sistem
npx prisma db seed
```

#### 5️⃣ Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

---

## 🚀 Penggunaan

### Arsitektur Backend (Server Actions)

Daur Nusa menggunakan arsitektur modern dari React dan Next.js yaitu **Server Actions**. Tidak ada endpoint API eksternal statis (`/api/...`). Seluruh proses mutasi data, pemrosesan transaksi, hingga komunikasi chat dieksekusi secara aman menggunakan Server Actions di folder `src/actions/` (misal: `listing.actions.ts`, `geo.actions.ts`, `chat.actions.ts`).

Hal ini menjamin *type-safety* end-to-end, keamanan yang ketat karena fungsi berjalan di sisi server, serta performa aplikasi yang jauh lebih cepat.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE) - lihat file LICENSE untuk detail lebih lanjut.

---

<div align="center">
  **Made with ❤️ by Londo Ireng for ITECHNO CUP 2026**
</div>
