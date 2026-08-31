"use client";

import { useOptimistic, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Layers,
  ReceiptText,
  Star,
  ChevronRight,
  PlusCircle,
  MessageSquare,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { displayFont, bodyFont } from "@/lib/fonts";
import { ProfileHeaderCard } from "@/components/features/profile/ProfileHeaderCard";
import { StatsGrid } from "@/components/features/profile/StatsGrid";
import { EditProfileDialog } from "@/components/features/profile/EditProfileDialog";
import { BuyerRegistrationDialog } from "@/components/features/profile/BuyerRegistrationDialog";
import { switchRoleAction } from "@/actions/auth.actions";
import type {
  BuyerApplication,
  ProfileListing,
  ProfileReview,
  ProfileStats,
  ProfileTransaction,
  ProfileUser,
  ProfileWasteRequest,
  WasteCategoryOption,
} from "@/types";

interface ProfileClientProps {
  user: ProfileUser;
  stats: ProfileStats;
  listings?: ProfileListing[];
  wasteRequests?: ProfileWasteRequest[];
  transactions: ProfileTransaction[];
  reviews: ProfileReview[];
  categories?: WasteCategoryOption[];
  buyerApplication?: BuyerApplication | null;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export function ProfileClient({
  user,
  stats,
  listings = [],
  wasteRequests = [],
  transactions,
  reviews,
  buyerApplication,
}: ProfileClientProps) {
  const router = useRouter();
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Optimistic role state using React 19 useOptimistic
  const [optimisticRole, setOptimisticRole] = useOptimistic(
    user.activeRole || "seller",
    (_current, newRole: "seller" | "buyer") => newRole
  );

  const isSeller = optimisticRole === "seller";

  const handleSetRole = (targetRole: "seller" | "buyer") => {
    if (optimisticRole === targetRole) return;

    if (targetRole === "buyer" && !user.isBuyerApproved) {
      setShowBuyerModal(true);
      return;
    }

    startTransition(async () => {
      setOptimisticRole(targetRole);

      try {
        const res = await switchRoleAction(targetRole);

        if (res.success) {
          toast.success(
            targetRole === "seller" ? "Mode Penjual Aktif" : "Mode Pengepul Aktif",
            {
              description:
                targetRole === "seller"
                  ? "Anda kini berada dalam mode Penjual Sampah."
                  : "Anda kini berada dalam mode Pengepul / Mitra Pengolah.",
            }
          );
          router.refresh();
        } else {
          toast.error("Gagal beralih mode", {
            description: res.error || "Terjadi kesalahan server. Mode dikembalikan.",
          });
        }
      } catch {
        toast.error("Gagal beralih mode", {
          description: "Koneksi terputus. Mode dikembalikan ke posisi semula.",
        });
      }
    });
  };

  const activeItemsCount = isSeller
    ? listings.filter((l) => l.status === "aktif").length
    : wasteRequests.filter((r) => r.status === "aktif").length;

  const menuItems = [
    {
      href: "/profile/listings",
      icon: isSeller ? Layers : Compass,
      iconBg: "bg-[#E8EEDD] text-[#6B7B4F]",
      title: isSeller ? "Listing Sampah Saya" : "Permintaan Pasokan",
      subtitle: isSeller
        ? "Kelola barang sampah yang Anda jual, perbarui harga, atau tambah stok."
        : "Kelola kebutuhan pasokan material sampah yang sedang dicari pengepul.",
      badge: `${activeItemsCount} Aktif`,
      badgeColor: "bg-[#E8EEDD] text-[#2B3A1C]",
    },
    {
      href: "/profile/transactions",
      icon: ReceiptText,
      iconBg: "bg-blue-50 text-blue-700",
      title: isSeller ? "Riwayat Penjualan" : "Riwayat Pembelian",
      subtitle: isSeller
        ? "Pantau catatan uang masuk, serah terima sampah, dan status COD selesai."
        : "Catatan pengeluaran pembelian pasokan material dari warga & UMKM.",
      badge: `${transactions.length} Transaksi`,
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      href: "/profile/reviews",
      icon: Star,
      iconBg: "bg-amber-50 text-amber-600",
      title: "Ulasan & Rating",
      subtitle: "Lihat testimoni kepuasan, rating bintang, dan reputasi akun Anda.",
      badge: `${stats.avgRating} ★ (${reviews.length})`,
      badgeColor: "bg-amber-100 text-amber-800",
    },
  ];

  return (
    <TooltipProvider delay={150}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          bodyFont.variable,
          displayFont.variable,
          "font-sans",
          "mx-auto max-w-5xl space-y-6 pb-12 pt-2"
        )}
      >
        {/* 1. Header Profil Card */}
        <motion.div variants={itemVariants}>
          <ProfileHeaderCard
            user={{ ...user, activeRole: optimisticRole }}
            buyerApplication={buyerApplication}
            isSwitching={isPending}
            onSwitchRole={handleSetRole}
            onEditProfile={() => setShowEditProfileModal(true)}
            onRegisterBuyer={() => setShowBuyerModal(true)}
          />
        </motion.div>

        {/* 2. Stats Grid Ringkasan */}
        <motion.div variants={itemVariants}>
          <StatsGrid
            stats={stats}
            reviewCount={reviews.length}
            isSeller={isSeller}
          />
        </motion.div>

        {/* 3. Action Hub Menu Cards (3 Menu Utama) */}
        <motion.div variants={itemVariants} className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="font-display text-base font-bold text-[#171717]">
                Menu Kelola Akun
              </h2>
              <p className="text-xs text-[#78766B]">
                Akses cepat untuk inventaris, pembukuan COD, dan reputasi Anda
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs transition-all hover:border-[#171717] hover:shadow-md cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-2xl",
                          item.iconBg
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                          item.badgeColor
                        )}
                      >
                        {item.badge}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-display text-sm font-bold text-[#171717] group-hover:text-[#6B7B4F] transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#78766B]">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#171717] group-hover:translate-x-0.5 transition-transform pt-2 border-t border-zinc-100">
                    <span>Buka Halaman</span>
                    <ChevronRight className="h-3.5 w-3.5 text-[#78766B] group-hover:text-[#171717]" />
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* 4. Quick Shortcut Bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-zinc-200/80 bg-[#FAF8F5] p-5"
        >
          <div className="space-y-0.5">
            <h3 className="font-display text-sm font-bold text-[#171717]">
              Pintasan Cepat
            </h3>
            <p className="text-xs text-[#78766B]">
              Lakukan aksi transaksi atau jelajahi kebutuhan pasar
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={isSeller ? "/listings/create" : "/requests/create"}
              className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-4 py-2 text-xs font-bold text-white hover:bg-[#2B2B26] transition-colors shadow-xs"
            >
              <PlusCircle className="h-4 w-4" />
              <span>
                {isSeller ? "Pasang Sampah Baru" : "Buat Permintaan Baru"}
              </span>
            </Link>

            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-[#171717] hover:bg-[#F7F4EE] transition-colors shadow-2xs"
            >
              <MessageSquare className="h-3.5 w-3.5 text-[#6B7B4F]" />
              <span>Pesan &amp; Negosiasi</span>
            </Link>

            <Link
              href="/requests"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-[#171717] hover:bg-[#F7F4EE] transition-colors shadow-2xs"
            >
              <span>Jelajahi Permintaan</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#78766B]" />
            </Link>
          </div>
        </motion.div>

        {/* Edit Profile Modal */}
        <EditProfileDialog
          open={showEditProfileModal}
          onOpenChange={setShowEditProfileModal}
          user={user}
        />

        {/* Buyer Mitra Registration Modal */}
        <BuyerRegistrationDialog
          open={showBuyerModal}
          onOpenChange={setShowBuyerModal}
          initialAddress={user.address}
        />
      </motion.div>
    </TooltipProvider>
  );
}
