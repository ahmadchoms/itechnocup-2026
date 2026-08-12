import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { ProximityMap } from "@/components/map/ProximityMap";
import { Recycle, ArrowRight, Camera, MapPin, Scale, ShieldCheck, Leaf, Coins, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Listing, WasteRequest } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  const listings = await prisma.listing.findMany({
    where: { status: { not: "dihapus" } },
    take: 6,
    include: {
      seller: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
          isAdmin: true,
          receivedReviews: { select: { rating: true } },
        },
      },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const requests = await prisma.wasteRequest.findMany({
    where: { status: { not: "dihapus" } },
    take: 4,
    include: {
      buyer: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedListings: Listing[] = listings.map((item) => {
    const reviews = item.seller.receivedReviews || [];
    const avgRating =
      reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 4.9;

    let distanceKm = 1.5;
    if (item.title.includes("Kopi")) distanceKm = 0.8;
    else if (item.title.includes("Kardus")) distanceKm = 2.4;
    else if (item.title.includes("Kaleng")) distanceKm = 5.1;

    return {
      ...item,
      estimatedWeightKg: item.estimatedWeightKg ? Number(item.estimatedWeightKg) : null,
      estimatedPrice: item.estimatedPrice ? Number(item.estimatedPrice) : null,
      cvConfidence: item.cvConfidence ? Number(item.cvConfidence) : null,
      distanceKm,
      seller: {
        ...item.seller,
        rating: avgRating,
      },
    } as unknown as Listing;
  });

  const formattedRequests: WasteRequest[] = requests.map((req) => ({
    ...req,
    offeredPrice: Number(req.offeredPrice),
  })) as unknown as WasteRequest[];

  return (
    <AppShell categories={categories}>
      <div className="space-y-16 py-4">
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Platform Sirkular Sampah & Limbah Indonesia</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Ubah Sampah & Limbah Jadi <span className="text-emerald-600">Nilai Ekonomi Sirkular</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Hubungkan ampas kopi cafe, kardus bekas, botol plastik, & minyak jelantah Anda langsung dengan pembeli, petani, & pengolah limbah terdekat berbasis deteksi AI dan lokasi proksimitas.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/listings"
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2"
              >
                <span>Jelajahi Pasar Sampah</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/matches"
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-colors flex items-center space-x-2"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Pencocokan Terdekat (0.8 km)</span>
              </Link>
            </div>
          </div>

          {/* Hero Featured Card Highlight */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Contoh Listing Terdekat
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Ampas Kopi
                </span>
              </div>

              <div className="aspect-16/10 rounded-2xl bg-slate-100 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600"
                  alt="Ampas Kopi"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  0.8 km
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Ampas Kopi Basah Espresso 25kg
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Murni Cafe • Jl. Siranda No. 5, Semarang</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Harga Nego</span>
                  <span className="text-base font-bold text-emerald-600">Rp 1.500 / kg</span>
                </div>
                <Link
                  href="/chat"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Chat Negosiasi
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK METRICS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="text-center space-y-1 border-r border-slate-100 last:border-r-0">
            <span className="text-2xl font-bold text-slate-900 block">130+ kg</span>
            <span className="text-xs text-slate-500 font-medium">Volume Terkelola</span>
          </div>
          <div className="text-center space-y-1 border-r border-slate-100 last:border-r-0">
            <span className="text-2xl font-bold text-emerald-600 block">Rp 187rb</span>
            <span className="text-xs text-slate-500 font-medium">Nilai Transaksi COD</span>
          </div>
          <div className="text-center space-y-1 border-r border-slate-100 last:border-r-0">
            <span className="text-2xl font-bold text-amber-600 block">0.8 km</span>
            <span className="text-xs text-slate-500 font-medium">Jarak Proksimitas Rata-Rata</span>
          </div>
          <div className="text-center space-y-1">
            <span className="text-2xl font-bold text-purple-600 block">94.5%</span>
            <span className="text-xs text-slate-500 font-medium">Akurasi Deteksi AI</span>
          </div>
        </div>

        {/* HOW IT WORKS (3 SIMPLE STEPS) */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">3 Langkah Mudah</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Cara Kerja DaurNusa</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Proses transaksi sampah yang cepat dari pelistingan hingga penyerahan barang di lokasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900">Foto & Scan AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unggah foto limbah Anda. Model Computer Vision mendeteksi jenis sampah secara otomatis.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900">Pencocokan Proksimitas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sistem otomatis menghubungkan listing Seller dengan permintaan Buyer terdekat berdasarkan koordinat lokasi.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900">Negosiasi & COD</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Diskusikan kesepakatan harga via chat real-time, lalu lakukan penyerahan barang dan pembayaran COD secara langsung.
              </p>
            </div>
          </div>
        </div>

        {/* MAP PROXIMITY HIGHLIGHT */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Sebaran Lokasi Limbah Semarang</h2>
              <p className="text-xs text-slate-500">Peta proksimitas interaktif penjemputan sampah</p>
            </div>
            <Link
              href="/matches"
              className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua Match</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ProximityMap listings={formattedListings} requests={formattedRequests} />
        </div>

        {/* FEATURED LISTINGS GRID */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Listing Sampah Siap Jual</h2>
              <p className="text-xs text-slate-500">Koleksi barang limbah terbaru dari masyarakat & UMKM</p>
            </div>
            <Link
              href="/listings"
              className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <span>Buka Pasar Sampah</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {formattedListings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  D
                </div>
                <span className="font-bold text-lg text-slate-900">DaurNusa</span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm">
                Platform marketplace jual-beli sampah dan limbah berbasis AI & proksimitas lokasi untuk ekosistem sirkular Indonesia.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-xs font-semibold text-slate-600">
              <Link href="/listings" className="hover:text-emerald-600">Pasar Sampah</Link>
              <Link href="/matches" className="hover:text-emerald-600">Match Terdekat</Link>
              <Link href="/about" className="hover:text-emerald-600">Tentang Kami</Link>
              <Link href="/contact" className="hover:text-emerald-600">Kontak & FAQ</Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <span>© 2026 DaurNusa — Tim ITechnoCup (Raki, Ahmad, Alfin). All rights reserved.</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px]">
              Semarang, Jawa Tengah
            </span>
          </div>
        </footer>
      </div>
    </AppShell>
  );
}
