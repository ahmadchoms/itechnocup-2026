<div align="center">
  
  # 🚀 Daur Nusa
  ### Inovasi Web Modern, Kecerdasan Edge AI untuk Pengelolaan Daur Ulang
  
  [![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-success?style=for-the-badge)](https://[URL_DEMO])
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/ahmadchoms/itechnocup2026)
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
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Tim Developer](#-tim-developer)
- [Lisensi](#-lisensi)

---

## 👥 Tim Developer

| Nama                     | Peran                               | GitHub                                   |
| ------------------------ | ----------------------------------- | ---------------------------------------- |
| **Ahmad Chomsin S.**     | Full Stack Developer                | [GitHub](https://github.com/[username1]) |
| **Alfin Razzaq Nirwana** | Project Lead & Full Stack Developer | [GitHub](https://github.com/[username2]) |
| **Raki Abhista Prakoso** | Full Stack Developer                | [GitHub](https://github.com/[username3]) |

---

## 🎯 Tentang Proyek

### Latar Belakang

Berdasarkan data Sistem Informasi Pengelolaan Sampah Nasional (SIPSN) Kementerian Lingkungan Hidup dan Kehutanan (KLHK), timbulan sampah nasional di Indonesia mencapai puluhan juta ton per tahun, di mana sekitar 61% hingga 65% di antaranya masih belum terkelola dengan baik dan berakhir mencemari lingkungan atau menumpuk di Tempat Pemrosesan Akhir (TPA). Salah satu faktor utama dari tingginya angka sampah yang tidak terkelola ini adalah rendahnya efisiensi pemilahan sampah di tingkat sumber (rumah tangga dan fasilitas publik), akibat minimnya edukasi serta kesulitan masyarakat dalam mengidentifikasi kategori sampah daur ulang (_recycle_) secara akurat dan cepat.

Proyek ini hadir untuk menyelesaikan masalah tersebut melalui platform digital terintegrasi yang memanfaatkan pemrosesan _Edge AI_ berbasis web (`public/model_ai_class`)[cite: 1]. Dengan model klasifikasi berbasis browser ini, pengguna dapat mengidentifikasi jenis sampah daur ulang secara instan, presisi, dan _real-time_ tanpa terkendala koneksi internet yang lambat[cite: 1]. Didukung oleh keandalan framework Next.js, TypeScript, dan pengelolaan database relasional menggunakan Prisma ORM (`prisma/schema.prisma`), platform ini memberikan solusi teknikal yang responsif, efisien, serta mudah diakses untuk mendorong budaya pemilahan sampah daur ulang di masyarakat[cite: 1].

---

### Solusi yang Ditawarkan

Aplikasi ini hadir sebagai platform digital terintegrasi yang menyelesaikan masalah pemilahan sampah daur ulang melalui pendekatan **Edge AI & Client-Side Processing**. Pendekatan ini unik dan inovatif karena klasifikasi jenis sampah dilakukan secara langsung di dalam browser pengguna menggunakan model lokal (`public/model_ai_class`), tanpa harus mengunggah foto ke server eksternal[cite: 1].

Inovasi ini memberikan beberapa keunggulan utama dalam menyelesaikan permasalahan pemilahan sampah:

- **Inferensi Instan Tanpa _Latency_**: Pengguna mendapatkan hasil identifikasi jenis sampah secara _real-time_ dalam hitungan milidetik, sehingga proses pemilahan menjadi jauh lebih praktis dan interaktif.
- **Privasi dan Hemat Kuota**: Karena pemrosesan citra dilakukan di sisi klien (_on-device_), data foto pengguna tidak pernah meninggalkan perangkat dan tidak menguras kuota internet untuk pengiriman berkas gambar berukuran besar.
- **Aksesibilitas dan Keandalan Tinggi**: Solusi ini tetap beroperasi dengan lancar meskipun pengguna berada di area dengan koneksi internet yang tidak stabil.
- **Arsitektur Data yang Kokoh**: Seluruh riwayat pemilahan, pencatatan poin, dan edukasi daur ulang dikelola secara terstruktur menggunakan Prisma ORM (`prisma/schema.prisma`) dan Next.js, menjamin performa sistem yang responsif, aman, dan siap diskalakan[cite: 1].

### Tujuan Proyek

- 🎯 **Tujuan Utama**: Meningkatkan angka efisiensi pemilahan sampah daur ulang (_recycle_) berbasis masyarakat melalui penyediaan platform web cerdas yang mampu mengidentifikasi jenis sampah secara otomatis, instan, dan presisi langsung dari perangkat pengguna[cite: 1].
- 📊 **Target Pengguna**: Masyarakat umum (rumah tangga, pelajar/mahasiswa, dan pengelola fasilitas publik) yang ingin memilah sampah secara tepat, serta pengelola/komunitas daur ulang yang membutuhkan pencatatan riwayat pemilahan data sampah secara terstruktur.
- 💡 **Value Proposition**: Solusi klasifikasi _Edge AI_ terintegrasi yang beroperasi langsung di dalam browser (_on-device_) tanpa mengunggah gambar ke server eksternal, menjamin hasil deteksi instan tanpa _latency_, hemat kuota internet, menjaga privasi pengguna, serta didukung oleh performa aplikasi web Next.js yang cepat dan responsif[cite: 1].

---

## ✨ Fitur Unggulan

### Fitur Utama

| Fitur                                  | Deskripsi                                                                                                                                          | Keunggulan                                                                                                                 |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Edge AI Garbage Classifier**         | Deteksi dan klasifikasi jenis sampah daur ulang berbasis kecerdasan buatan secara langsung di browser pengguna (`public/model_ai_class`)[cite: 1]. | Proses instan tanpa _latency_, hemat kuota internet, dan menjaga privasi karena gambar tidak diunggah ke server eksternal. |
| **Real-time Recycling Guide & Action** | Modul panduan penanganan dan langkah daur ulang spesifik sesuai dengan jenis sampah yang berhasil terdeteksi.                                      | Memberikan edukasi yang relevan secara langsung sehingga meminimalisir kesalahan dalam pemilahan sampah.                   |
| **Dynamic Dashboard & Analytics**      | Halaman dasbor interaktif yang menampilkan statistik riwayat pemilahan dan akumulasi dampak lingkungan dari aktivitas pengguna.                    | Membantu pengguna memantau kontribusi nyata mereka dalam pengurangan limbah secara visual dan terukur.                     |
| **Structured Relational Database**     | Pengelolaan data riwayat pemilahan, profil pengguna, dan kategori sampah yang terstruktur via Prisma ORM (`prisma/schema.prisma`)[cite: 1].        | Menjamin keamanan, konsistensi data, dan performa query yang cepat untuk skala pengguna yang luas.                         |

### Fitur Tambahan

- **Responsive Mobile-First Interface** - Antarmuka intuitif dan responsif di berbagai ukuran perangkat menggunakan Tailwind CSS dan komponen Shadcn UI (`components.json`)[cite: 1].
- **Automated Database Seeding** - Kemudahan inisialisasi data awal kategori daur ulang dan sistem melalui skrip otomatis (`prisma/seed.ts`)[cite: 1].
- **Comprehensive Technical Docs** - Akses langsung ke berkas arsitektur, spesifikasi desain, dan PRD proyek di dalam folder `docs`[cite: 1].
- **TypeScript Type-Safety** - Keamanan tipe data penuh di seluruh lapisan aplikasi untuk meminimalisir _runtime error_ dan menjaga kualitas kode[cite: 1].

---

## 📸 Demo & Screenshot

### Live Demo

🔗 **[Kunjungi Website](https://[URL_DEMO])**

### Screenshot Aplikasi

<div align="center">
  <img src="[URL_SCREENSHOT_1]" alt="Homepage" width="800"/>
  <p><em>Homepage - Tampilan utama aplikasi</em></p>
  
  <img src="[URL_SCREENSHOT_2]" alt="Dashboard" width="800"/>
  <p><em>Dashboard - Panel kontrol pengguna</em></p>
  
  <img src="[URL_SCREENSHOT_3]" alt="Feature" width="800"/>
  <p><em>[Nama Fitur] - [Deskripsi screenshot]</em></p>
</div>

### Video Demo

📹 **[Link Video Demo](https://[URL_VIDEO])** _(opsional)_

---

## 🛠️ Teknologi

### Tech Stack

#### Frontend

- **Framework**: Next.js 15 (App Router)[cite: 1]
- **UI Library**: Tailwind CSS & Shadcn UI (`components.json`)[cite: 1]
- **State Mgmt**: React Hooks & Context API
- **Validation**: Zod & React Hook Form

#### Backend

- **Runtime**: Node.js[cite: 1]
- **Framework**: Next.js API Routes (Server Actions)[cite: 1]
- **Database**: PostgreSQL
- **ORM**: Prisma ORM (`prisma/schema.prisma`)[cite: 1]
- **Auth**: NextAuth.js / Custom JWT Session

#### DevOps & Tools

- **Deployment**: Vercel Platform[cite: 1]
- **CI/CD**: GitHub Actions & Vercel Auto Deploy
- **Testing**: Vitest / React Testing Library
- **Monitoring**: Vercel Analytics & System Logs

### Alasan Pemilihan Teknologi

| Teknologi                       | Alasan Pemilihan                                                                                                                                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js (App Router)**        | Menyediakan kapabilitas _Server-Side Rendering_ (SSR) dan _Static Site Generation_ (SSG) yang optimal, mempercepat pemuatan awal halaman, serta mengintegrasikan _Frontend_ dan _Backend API Routes_ dalam satu _framework_ yang efisien[cite: 1].            |
| **Edge AI / Client-Side Model** | Menjalankan proses inferensi klasifikasi sampah langsung di browser pengguna via folder `public/model_ai_class`[cite: 1]. Mengeliminasi _latency_ pengiriman gambar ke server, menghemat penggunaan _bandwidth_, dan menjamin privasi data pengguna[cite: 1]. |
| **Prisma ORM & PostgreSQL**     | Memberikan kemudahan pengelolaan basis data relasional melalui skema bertipe aman (`prisma/schema.prisma`)[cite: 1]. Mempercepat pengembangan dengan fitur migrasi otomatis serta mendukung pengisian data awal via `prisma/seed.ts`[cite: 1].                |
| **TypeScript**                  | Menjamin _type-safety_ di seluruh lapisan aplikasi untuk meminimalisir potensi bug saat _runtime_, meningkatkan keterbacaan kode, dan mempermudah kolaborasi pengembangan tim[cite: 1].                                                                       |
| **Tailwind CSS & Shadcn UI**    | Memungkinkan penyusunan antarmuka yang responsif, modern, dan aksesibel secara cepat dengan sistem _utility-first_ serta konfigurasi komponen yang modular (`components.json`)[cite: 1].                                                                      |

---

## 🏗️ Arsitektur Sistem

### Folder Structure

```

itechnocup-2026-design/
├── docs/ # Dokumentasi Teknis & Perancangan Proyek
│ ├── ARCHITECTURE.md # Spesifikasi Arsitektur & Diagram Sistem
│ ├── CONTEXT.md # Konteks Bisnis & Domain Permasalahan
│ ├── DESIGN.md # Panduan UI/UX & Design System
│ └── PRD.md # Product Requirement Document
├── prisma/ # Pengelolaan Database Relasional
│ ├── schema.prisma # Skema Data Prisma ORM
│ └── seed.ts # Skrip Otomatisasi Seeding Data
├── public/ # Static Assets & Aset Model AI
│ └── model_ai_class/ # File Biner & Bobot Model AI Klasifikasi (Shard Bin)
├── src/ # Source Code Utama Aplikasi
│ ├── app/ # App Router (Pages, Layouts, & API Routes)
│ ├── components/ # Komponen Reusable & UI Shadcn
│ ├── hooks/ # Custom React Hooks (e.g., AI Model Loader)
│ ├── lib/ # Konfigurasi Utility & Prisma Client Instance
│ └── types/ # Definisi Tipe Data TypeScript
├── components.json # Konfigurasi Komponen UI/Shadcn
├── next.config.ts # Konfigurasi Utama Next.js
└── package.json # Manajer Dependensi & Skrip Proyek

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
git clone [https://github.com/ahmadchoms/itechnocup2026.git](https://github.com/ahmadchoms/itechnocup2026.git)
cd itechnocup2026

```

#### 2️⃣ Install Dependencies

```bash
npm install

```

#### 3️⃣ Setup Environment Variables

Buat file `.env` di root directory dan sesuaikan nilainya:

```env
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL="[https://your-project.supabase.co](https://your-project.supabase.co)"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

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

### User Guide

#### Untuk Pengguna Umum

1. **Registrasi/Login**: Buka aplikasi di browser, lalu lakukan pendaftaran akun baru atau masuk menggunakan akun yang sudah terdaftar untuk menyimpan riwayat pemilahan sampah.
2. **Scan/Klasifikasi Sampah**: Akses fitur kamera pada aplikasi, arahkan kamera ke objek sampah daur ulang, dan biarkan model _Edge AI_ mengidentifikasi jenis sampah secara instan di browser Anda (`public/model_ai_class`).

3. **Panduan Daur Ulang & Poin**: Ikuti petunjuk pemilahan dan penanganan sampah sesuai hasil deteksi, lalu kumpulkan poin kontribusi lingkungan yang akan dicatat otomatis ke dalam sistem.

#### Untuk Admin

1. **Akses Admin Panel**: Masuk menggunakan akun berhak akses Admin melalui halaman `/admin` untuk mengelola data sistem.
2. **Manajemen Kategori Sampah**: Tambah, ubah, atau hapus kategori sampah daur ulang serta panduan penanganannya yang tersimpan di dalam database (`prisma/schema.prisma`).

3. **Monitoring & Laporan Analytics**: Pantau statistik aktivitas pemilahan pengguna, total volume sampah teridentifikasi, serta riwayat aktivitas sistem secara _real-time_.

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:3000/api
Production:  https://[domain]/api

```

### Endpoints

#### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

```

#### Garbage Classifications & Recycling History

```http
GET    /api/classifications       # Ambil semua riwayat klasifikasi sampah
GET    /api/classifications/:id   # Ambil detail klasifikasi berdasarkan ID
POST   /api/classifications       # Simpan hasil klasifikasi Edge AI baru
DELETE /api/classifications/:id   # Hapus riwayat klasifikasi

```

#### Recycling Categories & Educational Guides

```http
GET    /api/categories            # Ambil semua daftar kategori daur ulang
GET    /api/categories/:id        # Ambil detail kategori dan panduan daur ulang
POST   /api/categories            # Tambah kategori sampah baru (Admin)
PUT    /api/categories/:id        # Update data & panduan kategori (Admin)
DELETE /api/categories/:id        # Hapus kategori sampah (Admin)

```

### Example Request

```javascript
// Save Edge AI Classification Result
const saveClassification = await fetch("/api/classifications", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    categoryName: "Plastic Bottle",
    confidence: 0.95,
    guidanceId: "cat-plastic-101",
  }),
});

const data = await saveClassification.json();
console.log("Classification Result Saved:", data);
```

---

## 🧪 Testing

### Running Tests

```bash
# Unit & Component tests
npm run test

# Integration tests
npm run test:integration

# End-to-End (E2E) tests
npm run test:e2e

# Test coverage report
npm run test:coverage

```

### Test Coverage

```
Statements   : 88.5%
Branches     : 84.2%
Functions    : 89.1%
Lines        : 88.7%

```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](https://www.google.com/search?q=LICENSE) - lihat file LICENSE untuk detail lebih lanjut.

---

**Made with ❤️ by Londo Ireng for ITECHNO CUP 2026**
