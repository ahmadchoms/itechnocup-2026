import { AppShell } from "@/components/layout/AppShell";
import { Recycle, Target, Leaf, Users, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Tentang Kami — DaurNusa",
  description: "Mengenal DaurNusa, platform sirkular jual-beli sampah dan limbah berbasis AI dan lokasi terdekat.",
};

import { getSessionUser } from "@/lib/session";

export default async function AboutPage() {
  const sessionUser = await getSessionUser();

  return (
    <AppShell sessionUser={sessionUser}>
      <div className="max-w-4xl mx-auto space-y-12 py-4">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Menghubungkan Penghasil Limbah dengan Industri Daur Ulang
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            DaurNusa hadir untuk memusatkan proses jual-beli sampah dan limbah yang selama ini berjalan secara informal. Kami memberikan nilai ekonomi nyata bagi masyarakat & UMKM sekaligus mendorong lingkungan yang bersih dan berkelanjutan.
          </p>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Visi Kami</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mewujudkan ekosistem pengelolaan sampah terintegrasi berbasis komunitas dan teknologi kecerdasan buatan, di mana setiap gram limbah yang dihasilkan memiliki tujuan daur ulang yang bernilai ekonomi.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Komitmen SDGs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              DaurNusa secara aktif mendukung Tujuan Pembangunan Berkelanjutan (SDGs) PBB: SDG 7 (Energi Bersih), SDG 8 (Pekerjaan Layak & Pertumbuhan Ekonomi), SDG 9 (Inovasi & Infrastruktur), serta SDG 11 (Kota Berkelanjutan).
            </p>
          </div>
        </div>

        {/* How DaurNusa Helps Users */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Bagaimana DaurNusa Bekerja untuk Anda?</h2>
            <p className="text-xs text-slate-400">Solusi dua sisi yang menguntungkan Penjual dan Pembeli</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Untuk Seller (Masyarakat & UMKM)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Upload foto ampas kopi, kardus, plastik, atau minyak jelantah Anda. Model Computer Vision kami mengenali kategori secara otomatis. Dapatkan pembeli terdekat tanpa ribet.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Untuk Buyer (Pengepul & Industri)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Post kebutuhan limbah tertentu yang Anda cari (misal ampas kopi untuk pupuk atau kardus untuk daur ulang). Sistem otomatis mencocokkan listing Seller terdekat dalam radius kilometer.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-6 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Siap Bergabung dalam Ekosistem Sirkular?</h3>
          <div className="flex justify-center space-x-4">
            <Link
              href="/profile"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-colors"
            >
              Jelajahi Pasar Sampah
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
            >
              Hubungi Tim DaurNusa
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
