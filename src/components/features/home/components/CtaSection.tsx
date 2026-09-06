import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";

export function CtaSection() {
  return (
    <section aria-labelledby="cta-heading">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[40px] bg-slate-950 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-14 sm:px-12 sm:py-20">
            <span className="inline-flex w-fit items-center rounded-full border border-emerald-800 bg-emerald-950 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
              Mulai Sekarang
            </span>

            <h2 id="cta-heading" className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Bangun ekosistem
              <br />
              daur ulang hari ini
            </h2>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
              Foto sampah Anda dan dapatkan penawaran dalam hitungan menit,
              atau jelajahi kebutuhan pasokan limbah di sekitar Anda sekarang juga.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/listings/create"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-900 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 shadow-md"
              >
                Foto &amp; Jual Sampah
                <ArrowRight className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
              </Link>
              <Link
                href="/requests"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 px-7 py-4 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <Search className="h-4 w-4" strokeWidth={2.5} />
                Jelajahi Permintaan
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 border-t border-slate-800 pt-6">
              <div>
                <span className="block text-xl font-extrabold text-white">2M+</span>
                <span className="text-xs text-slate-500">Kg terkelola</span>
              </div>
              <div className="h-8 w-px bg-slate-800" aria-hidden="true" />
              <div>
                <span className="block text-xl font-extrabold text-white">120+</span>
                <span className="text-xs text-slate-500">Komunitas mitra</span>
              </div>
              <div className="h-8 w-px bg-slate-800" aria-hidden="true" />
              <div>
                <span className="block text-xl font-extrabold text-white">0.8 km</span>
                <span className="text-xs text-slate-500">Radius rata-rata</span>
              </div>
            </div>
          </div>

          <div className="relative min-h-[280px] md:min-h-full">
            <Image
              src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1000&q=80"
              alt="Warga menyortir dan mengemas sampah daur ulang untuk dijual"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent md:bg-gradient-to-l"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
