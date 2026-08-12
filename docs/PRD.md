# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## DaurNusa

**STATUS: DRAFT SEMENTARA**

| | |
| --- | --- |
| **Nama Produk** | DaurNusa — Platform Jual-Beli Sampah/Limbah untuk Masyarakat & UMKM |
| **Versi Dokumen** | v0.1 (Draft Sementara) |
| **Disusun oleh** | Raki, Ahmad, dan Alfin (Tim Pengembang) |
| **Untuk** | Panitia & Juri Lomba ITechnoCup (Tema SDGs 7, 8, 9, 11) |
| **Tanggal** | 10 Agustus 2026 |
| **Dokumen Terkait** | Diskusi Internal Tim — 10 Agustus 2026; CONTEXT_DaurNusa.md (Konteks Teknis) |

---

# 1. Ringkasan Produk (Overview)

Pengelolaan sampah/limbah rumah tangga dan UMKM saat ini sebagian besar masih berjalan secara informal — melalui tukang loak keliling, grup media sosial, atau komunikasi japri antar pihak. Proses ini membuat masyarakat maupun UMKM kesulitan menemukan pembeli yang benar-benar membutuhkan jenis sampah tertentu di lokasi terdekat, tidak ada transparansi harga awal, dan potensi ekonomi dari sampah yang sebenarnya bernilai jual sering kali tidak termanfaatkan secara optimal.

DaurNusa dibangun sebagai platform web dua sisi (marketplace) yang mempertemukan Seller (masyarakat/UMKM penghasil sampah) dengan Buyer (pihak yang mencari sampah/limbah tertentu) berdasarkan kesamaan kategori sampah dan kedekatan lokasi. Platform ini mencakup siklus dari pelistingan sampah oleh Seller, permintaan sampah oleh Buyer, pencocokan otomatis, negosiasi lewat chat real-time, hingga pencatatan riwayat transaksi dan statistik pendapatan Seller. Sebagai nilai tambah, DaurNusa juga mengintegrasikan model computer vision untuk membantu mengklasifikasikan jenis sampah secara otomatis dari foto yang diunggah Seller, mendukung terciptanya ekosistem ekonomi sirkular yang selaras dengan SDGs 7 (Energi Bersih dan Terjangkau), 8 (Pekerjaan Layak dan Pertumbuhan Ekonomi), 9 (Industri, Inovasi, dan Infrastruktur), serta 11 (Kota dan Permukiman yang Berkelanjutan).

# 2. Tujuan & Sasaran (Goals)

- Memusatkan proses jual-beli sampah/limbah masyarakat & UMKM ke satu platform, menggantikan proses informal yang tersebar di berbagai kanal.
- Mempercepat pertemuan antara penjual dan pembeli sampah/limbah melalui pencocokan otomatis berbasis kategori dan lokasi terdekat.
- Mendorong partisipasi masyarakat dan UMKM dalam ekonomi sirkular dengan memberi nilai ekonomi pada sampah yang sebelumnya terbuang.
- Menyediakan riwayat transaksi dan statistik pendapatan bagi Seller sebagai insentif sekaligus bukti dampak sosial-ekonomi.
- Mengurangi friksi input manual saat pelistingan sampah melalui klasifikasi otomatis berbasis computer vision.
- Memberikan transparansi harga awal dan ruang negosiasi terbuka antara Seller dan Buyer.

# 3. Pengguna & Peran (Users & Roles)

- **Seller (Masyarakat/UMKM) :** mengelist sampah/limbah yang ingin dijual lengkap dengan foto, menerima hasil klasifikasi otomatis dari computer vision (dan dapat mengoreksinya), menerima rekomendasi Buyer yang cocok, melakukan chat & negosiasi, menandai transaksi selesai, serta melihat riwayat penjualan dan statistik pendapatan di profilnya.
- **Buyer (Pencari Sampah/Limbah) :** memposting permintaan sampah/limbah yang ingin dibeli lengkap dengan estimasi harga awal, menerima rekomendasi Seller dengan listing serupa di lokasi terdekat, melakukan chat & negosiasi dengan Seller, serta memberi ulasan/rating setelah transaksi selesai. *(Catatan: satu akun pengguna dapat berperan sebagai Seller maupun Buyer sekaligus tergantung aksi yang dilakukan — lihat Bab 5.)*
- **Admin :** mengelola dan memoderasi pengguna, listing, dan permintaan yang melanggar ketentuan, serta memantau aktivitas platform secara umum. *(Cakupan detail hak akses Admin masih perlu digali lebih lanjut — lihat Bab 12.)*

# 4. Ruang Lingkup (Scope)

## 4.1 Termasuk (MVP)

- Registrasi & login pengguna (email/password, opsi login Google)
- Pelistingan sampah oleh Seller (foto, nama, kategori, berat estimasi, kondisi, jumlah & satuan, deskripsi)
- Postingan permintaan sampah oleh Buyer (kategori, deskripsi, jumlah & satuan yang diinginkan, estimasi harga awal)
- Pencocokan otomatis antara listing dan permintaan berdasarkan kategori sampah dan kedekatan lokasi
- Chat real-time antara Seller dan Buyer untuk negosiasi
- Pencatatan transaksi (pasca-COD) beserta riwayat dan statistik penjualan/pendapatan di profil Seller
- Rating & ulasan setelah transaksi selesai
- Klasifikasi otomatis jenis sampah dari foto menggunakan model computer vision (diusahakan ada, prioritas Penting)
- Panel Admin dasar untuk moderasi pengguna, listing, dan permintaan

## 4.2 Di Luar Lingkup Awal / Fase Lanjutan

Fitur pembayaran digital (payment gateway), mekanisme escrow, sistem komisi/fee transaksi, statistik lanjutan per kategori, log evaluasi model computer vision, dashboard analitik Admin, perluasan kategori sampah, dan notifikasi push web ditunda ke fase lanjutan — lihat Bab 11.

# 5. Asumsi & Batasan (Assumptions & Constraints)

- **[Asumsi Tim]** Satu akun pengguna dapat berperan sebagai Seller maupun Buyer sekaligus tergantung aksi yang dilakukan (memposting listing = berperan Seller, memposting permintaan = berperan Buyer). Role Admin bersifat khusus dan terpisah dari akun biasa. Perlu dikonfirmasi ulang bila ternyata dimaksudkan sebagai role tetap per akun.
- **[Asumsi Teknis]** Karena lokasi diinput manual sebagai alamat teks (bukan GPS), sistem melakukan geocoding alamat menjadi koordinat (latitude/longitude) di backend agar estimasi jarak dan pengurutan "terdekat" dapat dihitung, menggunakan layanan peta open-source (kemungkinan OpenStreetMap/Nominatim — perlu konfirmasi, lihat Bab 12).
- **[Asumsi Teknis]** Pilihan model computer vision (Roboflow atau Google Teachable Machine) belum final; arsitektur sistem dibuat agar mudah mengganti provider CV tanpa mengubah alur bisnis inti.
- **[Asumsi]** Satuan jual-beli (kg, karung, unit, dll.) diinput bebas oleh pengguna sesuai kesepakatan, bukan satuan baku yang ditentukan sistem.
- **[Batasan]** Tidak ada payment gateway maupun sistem komisi pada MVP — transaksi finansial terjadi secara offline (COD) di luar sistem; platform hanya mencatat hasil akhir transaksi secara manual untuk keperluan statistik.
- **[Batasan]** Karena tidak ada payment gateway, tidak ada mekanisme escrow/jaminan; risiko transaksi COD sepenuhnya menjadi tanggung jawab kedua pihak (Seller & Buyer).
- **[Asumsi Teknis]** Notifikasi pengguna menggunakan email (bukan push notification web) sesuai keputusan tim.
- **[Asumsi]** Pendekatan desain menggunakan prinsip Mobile First mengingat target pengguna mayoritas diperkirakan mengakses lewat perangkat mobile — perlu dikonfirmasi ke tim.
- **[Batasan]** Skala awal platform ditujukan untuk kebutuhan demo lomba (skala kecil), namun arsitektur data & sistem dirancang agar dapat dikembangkan ke skala produksi.

# 6. Kebutuhan Fungsional (Functional Requirements)

## 6.1 Pengguna — Autentikasi & Profil

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **AUTH-1** | Sistem memungkinkan pengguna mendaftar akun baru menggunakan email dan kata sandi | **Wajib** |
| **AUTH-2** | Sistem memungkinkan pengguna masuk (login) menggunakan akun Google | **Penting** |
| **AUTH-3** | Pengguna dapat melengkapi dan memperbarui data profil (nama, nomor telepon, alamat, foto profil) | **Wajib** |
| **AUTH-4** | Sistem membedakan hak akses antara pengguna biasa dan Admin | **Wajib** |

## 6.2 Seller — Manajemen Listing Sampah

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **LST-1** | Seller dapat membuat listing sampah baru dengan mengunggah foto, nama, kategori, berat estimasi, kondisi, jumlah beserta satuannya, dan deskripsi | **Wajib** |
| **LST-2** | Seller dapat mengedit atau menghapus listing yang telah dibuat | **Wajib** |
| **LST-3** | Seller dapat melihat daftar seluruh listing miliknya beserta statusnya (aktif/terjual/dihapus) | **Wajib** |
| **LST-4** | Sistem menampilkan estimasi harga pada listing apabila tersedia dari hasil pencocokan permintaan Buyer | **Penting** |

## 6.3 Buyer — Manajemen Permintaan Sampah

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **REQ-1** | Buyer dapat membuat postingan permintaan sampah/limbah yang ingin dibeli beserta kategori, deskripsi, jumlah & satuan yang diinginkan, dan estimasi harga awal | **Wajib** |
| **REQ-2** | Buyer dapat mengedit atau menghapus postingan permintaannya | **Wajib** |
| **REQ-3** | Buyer dapat melihat daftar seluruh postingan permintaan miliknya beserta statusnya | **Wajib** |

## 6.4 Sistem — Pencocokan Otomatis (Matching)

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **MTC-1** | Sistem secara otomatis mencocokkan listing Seller dengan permintaan Buyer berdasarkan kesamaan kategori sampah | **Wajib** |
| **MTC-2** | Sistem mengurutkan hasil pencocokan berdasarkan estimasi jarak terdekat antara lokasi Seller dan Buyer | **Wajib** |
| **MTC-3** | Sistem menampilkan estimasi jarak pada setiap hasil pencocokan | **Penting** |
| **MTC-4** | Buyer menerima rekomendasi Seller dengan listing serupa setelah membuat postingan permintaan | **Wajib** |
| **MTC-5** | Seller menerima rekomendasi Buyer yang sedang mencari sampah serupa di lokasi terdekat | **Wajib** |

## 6.5 Seller & Buyer — Chat & Negosiasi

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **CHT-1** | Seller dan Buyer dapat memulai percakapan dari hasil pencocokan listing/permintaan | **Wajib** |
| **CHT-2** | Sistem mengirim dan menampilkan pesan secara real-time dalam percakapan | **Wajib** |
| **CHT-3** | Pengguna dapat melihat riwayat seluruh percakapan yang pernah dilakukan | **Wajib** |
| **CHT-4** | Sistem mengirim notifikasi email saat pengguna menerima pesan baru | **Penting** |

## 6.6 Seller & Buyer — Transaksi

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **TRX-1** | Seller atau Buyer dapat menandai sebuah percakapan sebagai kesepakatan (harga & jumlah akhir) | **Wajib** |
| **TRX-2** | Seller dapat menandai transaksi sebagai "Selesai" setelah COD dilakukan | **Wajib** |
| **TRX-3** | Pengguna dapat membatalkan transaksi yang belum selesai | **Penting** |
| **TRX-4** | Sistem mencatat riwayat seluruh transaksi yang telah selesai pada masing-masing akun | **Wajib** |

## 6.7 Seller — Statistik & Riwayat Penjualan

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **STAT-1** | Sistem menampilkan riwayat penjualan Seller pada halaman profil | **Wajib** |
| **STAT-2** | Sistem menampilkan statistik ringkas pendapatan Seller (total pendapatan, jumlah transaksi selesai) | **Wajib** |
| **STAT-3** | Sistem menampilkan statistik penjualan berdasarkan kategori sampah | **Fase 2** |

## 6.8 Sistem — Klasifikasi Otomatis Computer Vision

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **KLS-1** | Sistem mengklasifikasikan jenis sampah secara otomatis dari foto yang diunggah Seller menggunakan model computer vision | **Penting** |
| **KLS-2** | Seller dapat mengoreksi hasil klasifikasi otomatis secara manual sebelum listing disimpan | **Penting** |
| **KLS-3** | Sistem menyimpan log hasil klasifikasi (termasuk kasus yang dikoreksi manual) untuk keperluan evaluasi model | **Fase 2** |

## 6.9 Seller & Buyer — Rating & Ulasan

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **RVW-1** | Pengguna dapat memberikan rating bintang (1–5) dan ulasan deskriptif setelah transaksi ditandai selesai *(arah penilaian masih perlu dikonfirmasi — lihat Bab 12)* | **Wajib** |
| **RVW-2** | Sistem menampilkan rata-rata rating dan ulasan pada halaman profil pengguna | **Wajib** |

## 6.10 Admin — Manajemen Pengguna & Konten

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **ADM-1** | Admin dapat melihat daftar seluruh pengguna terdaftar | **Wajib** |
| **ADM-2** | Admin dapat menonaktifkan/memblokir akun pengguna yang melanggar ketentuan | **Penting** |
| **ADM-3** | Admin dapat menghapus listing atau permintaan yang melanggar ketentuan | **Penting** |
| **ADM-4** | Admin dapat melihat ringkasan statistik penggunaan platform secara keseluruhan | **Fase 2** |

# 7. Alur Pengguna Utama (Key User Flows)

## 7.1 Seller Membuat Listing (dengan Computer Vision)

1. Seller login ke akun DaurNusa.
2. Seller memilih menu "Jual Sampah" dan mengunggah foto sampah yang ingin dijual.
3. Sistem menjalankan model computer vision untuk memprediksi kategori sampah dari foto.
4. Seller meninjau hasil prediksi; jika sesuai, lanjut ke langkah berikutnya — jika tidak sesuai, Seller mengoreksi kategori secara manual.
5. Seller melengkapi data listing (nama, berat estimasi, kondisi, jumlah & satuan, deskripsi, alamat).
6. Seller menyimpan listing; status listing menjadi "Aktif".
7. Sistem menjalankan pencocokan otomatis dan menampilkan rekomendasi Buyer yang relevan kepada Seller.

## 7.2 Buyer Memposting Permintaan

1. Buyer login ke akun DaurNusa.
2. Buyer memilih menu "Cari Sampah" dan membuat postingan permintaan dengan kategori, deskripsi, jumlah & satuan yang diinginkan, serta estimasi harga.
3. Buyer menyimpan postingan; status menjadi "Aktif".
4. Sistem menjalankan pencocokan otomatis dan menampilkan rekomendasi Seller dengan listing serupa di lokasi terdekat kepada Buyer.
5. Buyer menunggu Seller yang tertarik menghubungi melalui chat.

## 7.3 Negosiasi & Transaksi (Happy Path)

1. Seller atau Buyer memulai percakapan dari hasil pencocokan.
2. Kedua pihak bernegosiasi harga dan jumlah melalui chat real-time.
3. Setelah sepakat, salah satu pihak menandai kesepakatan pada percakapan tersebut; status berubah menjadi "Menunggu Konfirmasi COD".
4. Buyer datang ke lokasi Seller (atau titik temu yang disepakati) untuk COD.
5. Seller menandai transaksi sebagai "Selesai" setelah barang dan pembayaran diserahterimakan.
6. Sistem memperbarui status listing menjadi "Terjual" dan mencatat transaksi ke riwayat serta statistik pendapatan Seller.
7. Kedua pihak dapat saling memberi rating dan ulasan.

## 7.4 Pembatalan Transaksi

1. Salah satu pihak (Seller/Buyer) memutuskan membatalkan kesepakatan sebelum status "Selesai".
2. Pengguna memilih opsi "Batalkan Transaksi" pada percakapan terkait.
3. Sistem mengubah status transaksi menjadi "Dibatalkan" dan mengembalikan status listing/permintaan menjadi "Aktif" kembali.
4. Kedua pihak dapat melanjutkan percakapan atau mencari pencocokan lain.

## 7.5 Moderasi oleh Admin

1. Admin login ke panel Admin.
2. Admin meninjau daftar pengguna, listing, atau permintaan yang dilaporkan/melanggar ketentuan.
3. Admin menonaktifkan akun atau menghapus konten yang melanggar.
4. Sistem mencatat tindakan moderasi tersebut.

# 8. Model Data (High-Level)

| **Entitas** | **Field Utama** | **Keterangan** |
| --- | --- | --- |
| **Pengguna (users)** | nama, email, no_telepon, alamat, is_admin | Satu akun dapat berperan Seller maupun Buyer (lihat Bab 5) |
| **Kategori Sampah (waste_categories)** | nama_kategori, deskripsi | Awal: Organik, Anorganik, Logam; dapat diperluas |
| **Listing Sampah (listings)** | seller_id, kategori_id, foto, nama, berat_estimasi, kondisi, jumlah, satuan, deskripsi, alamat, status, kategori_prediksi_cv, tingkat_keyakinan_cv | Dibuat oleh Seller; field prediksi CV bisa kosong jika CV belum tersedia |
| **Permintaan Sampah (waste_requests)** | buyer_id, kategori_id, deskripsi, jumlah_diinginkan, satuan, estimasi_harga, alamat, status | Dibuat oleh Buyer |
| **Pencocokan (matches)** | listing_id, request_id, estimasi_jarak, status | Dibuat otomatis oleh sistem |
| **Percakapan (conversations)** | match_id, seller_id, buyer_id | Ruang chat antar pengguna |
| **Pesan (messages)** | conversation_id, pengirim_id, isi_pesan, waktu_kirim | Isi percakapan real-time |
| **Transaksi (transactions)** | conversation_id, harga_akhir, jumlah_akhir, satuan, status, waktu_selesai | Dicatat setelah kesepakatan & COD |
| **Ulasan (reviews)** | transaction_id, pemberi_ulasan_id, penerima_ulasan_id, rating, komentar | Arah penilaian masih perlu dikonfirmasi (Bab 12) |
| **Log Klasifikasi CV (cv_classification_logs)** | [listing_id, kategori_prediksi, tingkat_keyakinan, provider_model] | Fase Lanjutan — untuk evaluasi performa model CV (Bab 11) |

**Catatan:** field dalam [tanda kurung siku] merupakan bagian dari fitur usulan/Fase Lanjutan (Bab 11).

# 9. Kebutuhan Non-Fungsional (Non-Functional Requirements)

- **Responsivitas (Mobile First) :** Antarmuka dirancang mobile-first karena mayoritas pengguna (masyarakat & UMKM) diperkirakan mengakses lewat smartphone.
- **Keamanan Data Lokasi & Foto :** Foto sampah dan alamat pengguna disimpan dengan akses terbatas sehingga hanya pihak terkait (Seller, Buyer yang cocok, dan Admin) yang dapat melihat detail alamat lengkap sebelum kesepakatan tercapai.
- **Keamanan & Hak Akses :** Setiap aksi (membuat listing, mengedit, menghapus, moderasi) dibatasi sesuai peran pengguna (Seller/Buyer/Admin) melalui mekanisme otorisasi berbasis role.
- **Performa Realtime :** Fitur chat harus mengirim dan menerima pesan dengan latensi rendah menggunakan koneksi realtime.
- **Skalabilitas :** Struktur data dan arsitektur dirancang agar dapat berkembang dari skala demo lomba ke skala produksi tanpa perubahan besar.
- **Privasi Data Pribadi :** Data kontak (nomor telepon, alamat lengkap) hanya ditampilkan kepada pihak yang sudah saling terhubung melalui percakapan, bukan ditampilkan publik di listing/permintaan.

# 10. Integrasi Pihak Ketiga

| **Layanan** | **Fungsi** | **Catatan** |
| --- | --- | --- |
| **Supabase (PostgreSQL, Auth, Storage, Realtime)** | Database utama, autentikasi, penyimpanan foto, dan koneksi realtime untuk chat | Wajib, MVP |
| **Google OAuth** | Login menggunakan akun Google | Penting, MVP |
| **Roboflow / Google Teachable Machine** | Model computer vision untuk klasifikasi otomatis jenis sampah dari foto | Penting, MVP — pilihan provider belum final (lihat Bab 12) |
| **Layanan Peta/Geocoding (asumsi: OpenStreetMap Nominatim)** | Mengonversi alamat manual menjadi koordinat untuk estimasi jarak Seller-Buyer | Wajib, MVP — perlu konfirmasi provider (lihat Bab 12) |
| **Layanan Email (mis. Resend/SendGrid, dsb.)** | Mengirim notifikasi email untuk pesan baru dan aktivitas penting lain | Penting, MVP — provider belum ditentukan (lihat Bab 12) |

# 11. Fitur Usulan / Fase Lanjutan

- **Payment Gateway & Escrow.** Integrasi pembayaran digital dengan mekanisme penahanan dana (escrow) agar transaksi tidak lagi murni COD, sekaligus membuka peluang model bisnis komisi/fee bagi platform.
- **Statistik Penjualan per Kategori Sampah.** Dashboard analitik lanjutan bagi Seller untuk melihat performa penjualan berdasarkan kategori sampah tertentu.
- **Log & Evaluasi Model Computer Vision.** Penyimpanan riwayat prediksi model CV (termasuk kasus yang dikoreksi manual) untuk keperluan pelatihan ulang dan peningkatan akurasi model.
- **Dashboard Statistik Platform untuk Admin.** Ringkasan metrik keseluruhan platform (jumlah pengguna aktif, volume transaksi, kategori sampah terpopuler, dsb.).
- **Perluasan Kategori Sampah.** Penambahan kategori sampah di luar Organik, Anorganik, dan Logam (misalnya elektronik, tekstil, B3) seiring pengembangan model CV yang lebih luas.
- **Notifikasi Push Web.** Notifikasi real-time langsung di browser sebagai pelengkap notifikasi email yang sudah ada di MVP.

# 12. Pertanyaan Terbuka / TBD

- Arah penilaian rating (RVW-1): apakah Seller menilai Buyer, Buyer menilai Seller, atau keduanya saling menilai?
- Provider computer vision final: Roboflow atau Google Teachable Machine (atau kombinasi keduanya)?
- Provider layanan peta/geocoding final untuk estimasi jarak — istilah "OPM" yang disebut tim perlu dikonfirmasi maksudnya (diasumsikan sementara OpenStreetMap Nominatim).
- Provider layanan email untuk notifikasi belum ditentukan.
- Hosting/deployment akan ditentukan kemudian oleh tim.
- Apakah pendekatan desain benar-benar Mobile First atau perlu mempertimbangkan tampilan desktop juga?
- Kategori sampah final untuk MVP: apakah tetap 3 (Organik, Anorganik, Logam) atau menyesuaikan hasil eksplorasi model CV yang dipilih?
- Cakupan detail hak akses Admin (ADM-1 s.d. ADM-4) masih perlu digali lebih lanjut.
- Deadline pengumpulan seluruh dokumen (PRD, CONTEXT, ERD) untuk lomba ITechnoCup: 6 September 2026 — perlu dikonfirmasi apakah ini juga deadline pengumpulan produk jadi/demo.

# 13. Glosarium

- **Seller :** Pengguna (masyarakat/UMKM) yang menjual/melistkan sampah atau limbah yang mereka hasilkan.
- **Buyer :** Pengguna yang mencari dan membeli sampah/limbah tertentu.
- **Listing :** Postingan sampah yang dibuat Seller untuk dijual.
- **Permintaan (Request) :** Postingan kebutuhan sampah yang dibuat Buyer.
- **Pencocokan (Matching) :** Proses otomatis sistem mempertemukan listing Seller dengan permintaan Buyer berdasarkan kategori dan lokasi.
- **COD (Cash on Delivery) :** Metode transaksi tatap muka langsung antara Seller dan Buyer di luar sistem, tanpa pembayaran digital di platform.
- **Computer Vision (CV) :** Teknologi kecerdasan buatan yang digunakan untuk mengenali dan mengklasifikasikan jenis sampah secara otomatis dari foto.
- **SDGs (Sustainable Development Goals) :** Tujuan Pembangunan Berkelanjutan PBB; proyek ini menyasar SDG 7, 8, 9, dan 11.
- **RLS (Row-Level Security) :** Mekanisme keamanan basis data pada Supabase/PostgreSQL untuk membatasi akses baris data sesuai identitas/peran pengguna.

---

*Dokumen ini merupakan draft sementara dan dapat berubah seiring pembahasan lebih lanjut dengan tim.*