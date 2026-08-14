import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { ProximityMap } from "@/components/map/ProximityMap";
import {
  ArrowRight,
  Camera,
  MapPin,
  Sparkles,
  ArrowUpRight,
  Star,
  Moon,
  Sprout,
  UtensilsCrossed,
  Clock3,
  Search,
  type LucideIcon,
  Quote,
} from "lucide-react";
import Link from "next/link";
import { Listing, WasteRequest } from "@/types";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface FeatureItem {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

interface StatCardProps {
  value: string;
  label: string;
  valueColor?: string;
}

interface UseCaseItem {
  image: string;
  alt: string;
  title: string;
  description: string;
  spanClass: string;
  aspectClass: string;
}

interface AvatarItem {
  src: string;
  alt: string;
  ring: string;
}

interface HeroAvatarItem {
  src: string;
  alt: string;
}

interface ReviewItem {
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

const leftFeatures: FeatureItem[] = [
  {
    icon: Moon,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "DaurNusa Bekerja Otomatis",
    description:
      "Tidak perlu menekan tombol apa pun. Sistem kami mendeteksi kategori sampah secara otomatis.",
  },
  {
    icon: UtensilsCrossed,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    title: "Setor Limbah Rumah Tangga",
    description:
      "Dari botol plastik hingga kardus bekas, DaurNusa menerima hampir semua jenis limbah.",
  },
];

const rightFeatures: FeatureItem[] = [
  {
    icon: Sprout,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Salurkan ke UMKM Daur Ulang",
    description:
      "Limbah bernilai disalurkan langsung ke mitra UMKM dan bank sampah terdekat.",
  },
  {
    icon: Clock3,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    title: "Kumpulkan Selama Berminggu-minggu",
    description:
      "Simpan limbah lebih lama dan jual sekaligus saat volume sudah sesuai target.",
  },
];

const useCases: UseCaseItem[] = [
  {
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80",
    alt: "Warga memilah sampah rumah tangga di halaman rumah",
    title: "DaurNusa untuk rumah tangga",
    description: "Pilah dan jual limbah dapur, kardus, hingga botol plastik.",
    spanClass: "md:col-span-2 md:row-span-2",
    aspectClass: "aspect-4/3 md:aspect-auto md:h-full",
  },
  {
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=700&q=80",
    alt: "Pemulung memilah botol plastik untuk didaur ulang",
    title: "DaurNusa untuk pengepul",
    description: "Dapatkan pasokan limbah bersih langsung dari sumbernya.",
    spanClass: "",
    aspectClass: "aspect-4/3",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=700&q=80",
    alt: "Warga berkumpul membawa hasil daur ulang komunitas",
    title: "DaurNusa untuk komunitas",
    description: "Sisihkan ke bank sampah atau salurkan ke mitra UMKM.",
    spanClass: "",
    aspectClass: "aspect-4/3",
  },
];

const avatarSources: AvatarItem[] = [
  {
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    alt: "Anggota tim DaurNusa",
    ring: "ring-emerald-300",
  },
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    alt: "Anggota tim DaurNusa",
    ring: "ring-sky-300",
  },
  {
    src: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=100&q=80",
    alt: "Anggota tim DaurNusa",
    ring: "ring-amber-300",
  },
];

const heroAvatars: HeroAvatarItem[] = [
  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", alt: "Ahmad" },
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", alt: "Budi" },
  { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", alt: "Pak Tani" },
];

const reviews: ReviewItem[] = [
  {
    name: "Murni Cafe",
    role: "Penjual Ampas Kopi (Seller)",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120",
    quote:
      "Ampas kopi dari mesin espresso kami yang biasanya dibuang, sekarang rutin dibeli Pak Tani via DaurNusa. Transaksinya cepat dan bermanfaat!",
  },
  {
    name: "Budi Santoso",
    role: "Pengepul Kardus & Plastik (Buyer)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
    quote:
      "Sistem matching berdasarkan km lokasi membuat penjemputan kardus & botol plastik jadi jauh lebih hemat waktu dan ongkos.",
  },
];

const footerLinks = [
  { href: "/listings", label: "Pasar Sampah" },
  { href: "/matches", label: "Match Terdekat" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/contact", label: "Kontak & FAQ" },
];

const statCardBase =
  "rounded-[28px] bg-white p-6 sm:p-7 flex flex-col justify-between h-full min-h-[180px] shadow-sm";

function FeatureCard({ icon: Icon, iconBg, iconColor, title, description }: FeatureItem) {
  return (
    <div className="flex flex-col items-center text-center md:items-start md:text-left gap-3 max-w-xs mx-auto md:mx-0">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

function StatCard({ value, label, valueColor = "text-slate-900" }: StatCardProps) {
  return (
    <div className={statCardBase}>
      <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${valueColor}`}>
        {value}
      </span>
      <div className="mt-6 border-t border-slate-200 pt-3">
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
    </div>
  );
}

function ReviewCard({ name, role, avatar, quote }: ReviewItem) {
  return (
    <div className="p-6 rounded-[24px] bg-[#F6F8F6] border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={avatar}
            alt={name}
            className="w-9 h-9 rounded-full object-cover border border-slate-200"
          />
          <div>
            <span className="font-bold text-xs text-slate-900 block">{name}</span>
            <span className="text-[10px] text-slate-500 font-medium">{role}</span>
          </div>
        </div>
        <div className="flex text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-700 italic leading-relaxed">{quote}</p>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <div className="lg:col-span-7 bg-[#EAF2ED] text-slate-900 rounded-[36px] p-8 sm:p-12 flex flex-col justify-between space-y-8 relative overflow-hidden border border-emerald-900/5">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.12] text-slate-900">
            Ubah Sampah Jadi{" "}
            <span className="inline-flex items-center gap-1.5">
              <span className="underline decoration-emerald-300 decoration-wavy underline-offset-8">
                Nilai Ekonomi
              </span>
              <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-300 flex items-center justify-center text-white text-base shrink-0">
                <ArrowUpRight className="w-5 h-5" />
              </span>
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
            Hubungkan ampas kopi cafe, kardus bekas, botol plastik, &amp; minyak jelantah Anda langsung dengan pembeli &amp; petani terdekat berbasis AI &amp; lokasi proksimitas.
          </p>
        </div>

        <div className="space-y-6 pt-2">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/listings/create"
              className="px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-2 group"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Foto &amp; Jual Sampah »</span>
            </Link>

            <Link
              href="/listings"
              className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200 transition-colors"
            >
              Jelajahi Pasar
            </Link>
          </div>

          <div className="flex items-center space-x-3 pt-2 border-t border-slate-900/10">
            <div className="flex -space-x-2 overflow-hidden">
              {heroAvatars.map((avatar) => (
                <img
                  key={avatar.alt}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src={avatar.src}
                  alt={avatar.alt}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-slate-600">
              <strong className="text-slate-900 font-bold">120+ Warga &amp; UMKM</strong> Telah Terhubung
            </span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 bg-slate-900 rounded-[36px] overflow-hidden relative min-h-[380px] flex flex-col justify-end p-6 border border-slate-800 shadow-xs group">
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800"
          alt="Aktivitas DaurNusa"
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        <div className="absolute top-5 right-5 z-10">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-950/80 text-emerald-400 border border-slate-700/80 backdrop-blur-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>Terdekat: 0.8 km</span>
          </span>
        </div>

        <div className="relative z-10 space-y-3 bg-slate-950/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800/80">
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
              href="/chat"
              className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span>Tawar Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EffortlessSection() {
  return (
    <section aria-labelledby="effortless-heading" className="w-full bg-white px-6 pt-8 pb-16 sm:pt-12 sm:pb-24 rounded-4xl">
      <div className="mx-auto max-w-6xl text-center">
        <h2 id="effortless-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Mudah tanpa ribet
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
          Dengan teknologi cerdas dan desain yang bersih, DaurNusa membuat proses
          menjual limbah daur ulang jadi tanpa hambatan.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-[1fr_minmax(260px,340px)_1fr] md:gap-8">
        <div className="order-2 grid grid-cols-1 gap-10 sm:grid-cols-2 md:order-1 md:grid-cols-1 md:gap-16">
          {leftFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="relative order-1 mx-auto aspect-square w-full max-w-[340px] md:order-2">
          <Image
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
            alt="Tumpukan botol plastik dan kertas siap didaur ulang"
            fill
            sizes="(max-width: 768px) 90vw, 340px"
            className="rounded-[32px] object-cover shadow-xl"
            priority
          />
        </div>

        <div className="order-3 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-1 md:gap-16">
          {rightFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProximityMapSection({ listings, requests }: { listings: Listing[]; requests: WasteRequest[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Sebaran Lokasi Limbah Semarang
          </h2>
          <p className="text-xs text-slate-500">Peta proksimitas interaktif penjemputan sampah</p>
        </div>
        <Link
          href="/matches"
          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200"
        >
          <span>Lihat Semua Match</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <ProximityMap listings={listings} requests={requests} />
    </div>
  );
}

function ImpactStatsSection() {
  return (
    <section aria-labelledby="impact-heading" className="w-full bg-[#F6F8F6] px-6 pt-8 pb-16 sm:pt-12 sm:pb-24 rounded-4xl">
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="impact-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight">
          Kilogram limbah yang
          <br className="hidden sm:block" /> terselamatkan dari TPA
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
          Menciptakan dampak lingkungan yang terukur lewat kebiasaan memilah
          sampah sehari-hari.
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
          <div className="flex h-full flex-col justify-between rounded-[36px] bg-slate-950 p-8 text-white">
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              <span className="font-bold text-white">
                Kami mulai dari keyakinan sederhana: limbah rumah tangga tidak
                seharusnya berakhir di TPA.
              </span>{" "}
              Setiap hari, ribuan ton sampah yang masih bernilai terbuang
              sia-sia. Kami ingin membangun solusi yang lebih cerdas, bersih,
              dan berkelanjutan untuk rumah tangga modern.
            </p>

            <div className="mt-8 flex items-center justify-center" aria-hidden="true">
              <div className="flex -space-x-3">
                {avatarSources.map((avatar, index) => (
                  <div
                    key={avatar.src}
                    className={`relative h-14 w-14 overflow-hidden rounded-2xl ring-4 ${avatar.ring} ring-offset-2 ring-offset-slate-950`}
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
                className="flex-1 rounded-full bg-white px-6 py-4 text-center text-sm font-bold text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Tentang Kami
              </Link>

              <Link
                href="/about"
                aria-label="Pelajari lebih lanjut tentang DaurNusa"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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
          <StatCard value="98%" label="Kepuasan Pelanggan" valueColor="text-purple-600" />
        </div>
      </div>
    </section>
  );
}

function ListingsSection({ listings }: { listings: Listing[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Listing Sampah Siap Jual
          </h2>
          <p className="text-xs text-slate-500">Koleksi barang limbah terbaru dari masyarakat &amp; UMKM</p>
        </div>
        <Link
          href="/listings"
          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200"
        >
          <span>Buka Pasar Sampah</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((item) => (
          <ListingCard key={item.id} listing={item} />
        ))}
      </div>
    </div>
  );
}

function SecondLifeSection() {
  return (
    <section aria-labelledby="second-life-heading" className="w-full bg-white px-6 pt-8 pb-16 sm:pt-12 sm:pb-24 rounded-4xl">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <h2 id="second-life-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight">
            Memberi limbah
            <br />
            kehidupan kedua
          </h2>
          <p className="mt-4 text-sm text-slate-500 sm:text-base leading-relaxed">
            Ubah sampah rumah tangga menjadi sumber daya bernilai yang
            mendukung ekonomi sirkular dan komunitas yang lebih hijau.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {useCases.map((item) => (
            <figure key={item.title} className={`flex flex-col gap-4 ${item.spanClass}`}>
              <div className={`relative w-full overflow-hidden rounded-[28px] bg-slate-100 ${item.aspectClass}`}>
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <div className="bg-white rounded-[36px] border border-slate-200/80 p-8 sm:p-12 shadow-2xs space-y-10">
      <div className="text-center space-y-2 max-w-md mx-auto">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Dipercaya Warga & UMKM Di Indonesia
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        <div className="md:col-span-5 relative overflow-hidden rounded-[28px] border border-slate-200/80 shadow-xs aspect-4/5">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700"
            alt="Pak Tani Ungaran"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

          <Quote className="absolute right-6 top-6 h-10 w-10 text-white/15" strokeWidth={2.5} aria-hidden="true" />

          <div className="absolute inset-x-6 bottom-6 space-y-1.5 text-white">
            <p className="text-sm italic leading-snug text-slate-100">
              &quot;Sangat terbantu mendapatkan ampas kopi segar dari cafe Semarang untuk bahan pupuk kompos perkebunan.&quot;
            </p>
            <div className="flex items-center justify-between border-t border-white/20 pt-3">
              <div>
                <span className="block text-sm font-extrabold">Pak Tani Ungaran</span>
                <span className="text-xs font-medium text-emerald-300">Pembeli Rutin Ampas Kopi</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                5.0
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-center gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CtaSection() {
  return (
    <section aria-labelledby="cta-heading">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[40px] bg-slate-950">
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
              Foto limbah Anda dan dapatkan penawaran dalam hitungan menit,
              atau jelajahi kebutuhan sampah di sekitar Semarang sekarang
              juga.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/listings/create"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-900 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Foto &amp; Jual Sampah
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
              <Link
                href="/listings"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 px-7 py-4 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <Search className="h-4 w-4" strokeWidth={2.5} />
                Jelajahi Pasar
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
                <span className="block text-xl font-extrabold text-white">0.8km</span>
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

function SiteFooter() {
  return (
    <footer className="bg-white rounded-[32px] border border-slate-200/80 p-8 sm:p-10 space-y-6 shadow-2xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">DaurNusa</span>
          </div>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            Platform marketplace jual-beli sampah dan limbah berbasis AI &amp; proksimitas lokasi untuk ekosistem sirkular Indonesia.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-xs font-semibold text-slate-600">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-emerald-600">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <span>© 2026 DaurNusa — Tim Londo Ireng. All rights reserved.</span>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px]">
          Semarang, Jawa Tengah
        </span>
      </div>
    </footer>
  );
}

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
      latitude: item.latitude ? Number(item.latitude) : null,
      longitude: item.longitude ? Number(item.longitude) : null,
      distanceKm,
      seller: {
        ...item.seller,
        latitude: (item.seller as any).latitude ? Number((item.seller as any).latitude) : null,
        longitude: (item.seller as any).longitude ? Number((item.seller as any).longitude) : null,
        rating: avgRating,
      },
    } as unknown as Listing;
  });

  const formattedRequests: WasteRequest[] = requests.map((req) => ({
    ...req,
    offeredPrice: Number(req.offeredPrice),
    latitude: req.latitude ? Number(req.latitude) : null,
    longitude: req.longitude ? Number(req.longitude) : null,
    buyer: req.buyer
      ? {
        ...req.buyer,
        latitude: req.buyer.latitude ? Number(req.buyer.latitude) : null,
        longitude: req.buyer.longitude ? Number(req.buyer.longitude) : null,
      }
      : req.buyer,
  })) as unknown as WasteRequest[];

  return (
    <AppShell categories={categories}>
      <div className="space-y-20 py-4">
        <HeroSection />
        <EffortlessSection />
        <ProximityMapSection listings={formattedListings} requests={formattedRequests} />
        <ImpactStatsSection />
        <ListingsSection listings={formattedListings} />
        <SecondLifeSection />
        <TestimonialsSection />
        <CtaSection />
        <SiteFooter />
      </div>
    </AppShell>
  );
}