import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { avatarSources } from "../data/home.data";
import type { StatCardItem } from "../types/home.types";

function StatCard({ value, label, valueColor = "text-slate-900" }: StatCardItem) {
  return (
    <div className="rounded-[28px] bg-white p-6 sm:p-7 flex flex-col justify-between h-full min-h-[180px] shadow-xs border border-slate-100">
      <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${valueColor}`}>
        {value}
      </span>
      <div className="mt-6 border-t border-slate-100 pt-3">
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
    </div>
  );
}

export function ImpactStatsSection() {
  return (
    <section aria-labelledby="impact-heading" className="w-full bg-[#F6F8F6] px-6 pt-8 pb-16 sm:pt-12 sm:pb-24 rounded-4xl border border-emerald-950/5">
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="impact-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight">
          Kilogram limbah yang
          <br className="hidden sm:block" /> terselamatkan dari TPA
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
          Menciptakan dampak lingkungan dan sirkular yang terukur lewat kebiasaan memilah
          dan mendistribusikan sampah secara terintegrasi.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2">
        <div className="md:col-start-1 md:row-start-1">
          <StatCard value="2M+" label="Kilogram Terkelola" valueColor="text-emerald-600" />
        </div>

        <div className="md:col-start-4 md:row-start-1">
          <StatCard value="120+" label="Komunitas Mitra" valueColor="text-amber-600" />
        </div>

        <div className="order-first md:order-none md:col-start-2 md:col-span-2 md:row-start-1 md:row-span-2">
          <div className="flex h-full flex-col justify-between rounded-[36px] bg-slate-950 p-8 text-white shadow-xl">
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              <span className="font-bold text-white">
                Kami mulai dari keyakinan sederhana: limbah rumah tangga &amp; usaha tidak
                seharusnya berakhir di TPA.
              </span>{" "}
              Setiap hari, ribuan ton sampah bernilai terbuang sia-sia. Kami membangun solusi yang lebih cerdas, bersih,
              dan transparan untuk seluruh pelaku ekonomi sirkular Indonesia.
            </p>

            <div className="mt-8 flex items-center justify-center" aria-hidden="true">
              <div className="flex -space-x-3">
                {avatarSources.map((avatar, index) => (
                  <div
                    key={avatar.src}
                    className={`relative h-14 w-14 overflow-hidden rounded-2xl ring-4 ${avatar.ring} ring-offset-2 ring-offset-slate-950 shadow-md`}
                    style={{ zIndex: avatarSources.length - index }}
                  >
                    <Image src={avatar.src} alt={avatar.alt} fill sizes="56px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/about"
                className="flex-1 rounded-full bg-white px-6 py-4 text-center text-sm font-bold text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 shadow-xs"
              >
                Tentang Kami
              </Link>

              <Link
                href="/about"
                aria-label="Pelajari lebih lanjut tentang DaurNusa"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 shadow-xs"
              >
                <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>

        <div className="md:col-start-1 md:row-start-2">
          <StatCard value="50K+" label="Pengguna Aktif" valueColor="text-sky-600" />
        </div>

        <div className="md:col-start-4 md:row-start-2">
          <StatCard value="98%" label="Tingkat Kepuasan" valueColor="text-purple-600" />
        </div>
      </div>
    </section>
  );
}
