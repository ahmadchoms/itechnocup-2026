import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Camera, MapPin } from "lucide-react";
import { heroAvatars } from "../data/home.data";

export function HeroSection() {
  return (
    <section aria-label="Hero Banner" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Kolom Kiri: Value Proposition & Call to Action */}
      <div className="lg:col-span-7 bg-[#EAF2ED] text-slate-900 rounded-[36px] p-8 sm:p-12 flex flex-col justify-between space-y-8 relative overflow-hidden border border-emerald-900/5">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Marketplace Limbah Sirkular AI Terintegrasi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.12] text-slate-900">
            Ubah Sampah Jadi{" "}
            <span className="inline-flex items-center gap-1.5">
              <span className="underline decoration-emerald-300 decoration-wavy underline-offset-8">
                Nilai Ekonomi
              </span>
              <span
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-300 flex items-center justify-center text-white text-base shrink-0 shadow-sm"
                aria-hidden="true"
              >
                <ArrowUpRight className="w-5 h-5 text-emerald-950" />
              </span>
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
            Hubungkan ampas kopi cafe, kardus kemasan, botol plastik, &amp; minyak jelantah Anda langsung dengan pengepul &amp; UMKM daur ulang terdekat berbasis AI dan lokasi proksimitas real-time.
          </p>
        </div>

        <div className="space-y-6 pt-2">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/listings/create"
              className="px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-2 group"
            >
              <Camera className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Foto &amp; Jual Sampah</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/requests"
              className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200 transition-colors"
            >
              Cari Kebutuhan Sampah
            </Link>
          </div>

          <div className="flex items-center space-x-3 pt-3 border-t border-slate-900/10">
            <div className="flex -space-x-2 overflow-hidden">
              {heroAvatars.map((avatar) => (
                <div key={avatar.alt} className="relative h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-slate-200">
                  <Image
                    src={avatar.src}
                    alt={avatar.alt}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-xs font-medium text-slate-600">
              <strong className="text-slate-900 font-bold">120+ Warga &amp; UMKM</strong> Telah Terhubung
            </span>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Live Proximity Waste Showcase */}
      <div className="lg:col-span-5 bg-slate-900 rounded-[36px] overflow-hidden relative min-h-[380px] flex flex-col justify-end p-6 border border-slate-800 shadow-xs group">
        <Image
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800"
          alt="Aktivitas DaurNusa"
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover opacity-75 group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute top-5 right-5 z-10">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-950/80 text-emerald-400 border border-slate-700/80 backdrop-blur-xs shadow-md">
            <MapPin className="w-3.5 h-3.5" />
            <span>Terdekat: 0.8 km</span>
          </span>
        </div>

        <div className="relative z-10 space-y-3 bg-slate-950/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
              Ampas Kopi Cafe
            </span>
            <span className="text-xs font-bold text-emerald-400">Rp 1.500 / kg</span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white line-clamp-1">
              Ampas Kopi Basah Espresso 25kg
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Murni Cafe • Jl. Siranda No. 5, Semarang
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Akurasi AI: <strong className="text-purple-300 font-semibold">94.5%</strong>
            </span>
            <Link
              href="/requests"
              className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span>Lihat Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
