import {
  Moon,
  Sprout,
  UtensilsCrossed,
  Clock3,
} from "lucide-react";
import type {
  FeatureItem,
  UseCaseItem,
  AvatarItem,
  HeroAvatarItem,
  ReviewItem,
  FooterLinkItem,
} from "../types/home.types";

export const leftFeatures: FeatureItem[] = [
  {
    icon: Moon,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "DaurNusa Bekerja Otomatis",
    description:
      "Tidak perlu repot menimbang dan mencocokkan manual. Sistem AI kami mendeteksi kategori sampah secara presisi.",
  },
  {
    icon: UtensilsCrossed,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    title: "Setor Limbah Rumah Tangga & Usaha",
    description:
      "Dari botol plastik, ampas kopi kafe, kardus kemasan, hingga minyak jelantah, DaurNusa menerima hampir seluruh jenis limbah.",
  },
];

export const rightFeatures: FeatureItem[] = [
  {
    icon: Sprout,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Salurkan ke UMKM Daur Ulang",
    description:
      "Limbah bernilai ekonomis disalurkan langsung ke mitra UMKM daur ulang dan bank sampah terdekat.",
  },
  {
    icon: Clock3,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    title: "Kumpulkan & Jual Sekaligus",
    description:
      "Akumulasi limbah daur ulang Anda dan jual dalam satu transaksi saat volume sudah sesuai target.",
  },
];

export const useCases: UseCaseItem[] = [
  {
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80",
    alt: "Warga memilah sampah rumah tangga di halaman rumah",
    title: "DaurNusa untuk Rumah Tangga & Kafe",
    description: "Pilah dan jual limbah dapur, kardus belanja, ampas kopi, hingga botol plastik langsung dari rumah.",
    spanClass: "md:col-span-2 md:row-span-2",
    aspectClass: "aspect-4/3 md:aspect-auto md:h-full",
  },
  {
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=700&q=80",
    alt: "Pengepul memilah botol plastik untuk didaur ulang",
    title: "DaurNusa untuk Pengepul & Pengolah",
    description: "Dapatkan pasokan limbah bersih berkualitas tinggi langsung dari sumber pertama tanpa perantara panjang.",
    spanClass: "",
    aspectClass: "aspect-4/3",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=700&q=80",
    alt: "Warga berkumpul membawa hasil daur ulang komunitas",
    title: "DaurNusa untuk Komunitas & Bank Sampah",
    description: "Tingkatkan partisipasi warga dan monitoring tonase limbah terkelola secara transparan berbasis digital.",
    spanClass: "",
    aspectClass: "aspect-4/3",
  },
];

export const avatarSources: AvatarItem[] = [
  {
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    alt: "Anggota komunitas DaurNusa",
    ring: "ring-emerald-300",
  },
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    alt: "Anggota tim DaurNusa",
    ring: "ring-sky-300",
  },
  {
    src: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=100&q=80",
    alt: "Mitra pengepul DaurNusa",
    ring: "ring-amber-300",
  },
];

export const heroAvatars: HeroAvatarItem[] = [
  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", alt: "Ahmad" },
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", alt: "Budi" },
  { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", alt: "Pak Tani" },
];

export const reviews: ReviewItem[] = [
  {
    name: "Murni Cafe",
    role: "Penjual Ampas Kopi (Seller)",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120",
    quote:
      "Ampas kopi dari mesin espresso kami yang biasanya dibuang, sekarang rutin dibeli Pak Tani via DaurNusa. Transaksinya cepat, aman, dan sangat bermanfaat!",
  },
  {
    name: "Budi Santoso",
    role: "Pengepul Kardus & Plastik",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
    quote:
      "Sistem matching berdasarkan radius lokasi membuat penjemputan kardus & botol plastik jadi jauh lebih hemat waktu, terukur, dan memangkas ongkos operasional.",
  },
];

export const footerLinks: FooterLinkItem[] = [
  { href: "/requests", label: "Permintaan Sampah" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/contact", label: "Kontak & Bantuan" },
];
