"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Layers, ReceiptText, Star } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { displayFont, bodyFont } from "@/lib/fonts";
import { ProfileHeaderCard } from "@/components/features/profile/ProfileHeaderCard";
import { StatsGrid } from "@/components/features/profile/StatsGrid";
import { MyListingsTab } from "@/components/features/profile/MyListingsTab";
import { TransactionHistoryCard } from "@/components/features/profile/TransactionHistoryCard";
import { ReviewsCard } from "@/components/features/profile/ReviewsCard";
import { EditProfileDialog } from "@/components/features/profile/EditProfileDialog";
import { BuyerRegistrationDialog } from "@/components/features/profile/BuyerRegistrationDialog";
import type {
  BuyerApplication,
  ProfileListing,
  ProfileReview,
  ProfileStats,
  ProfileTransaction,
  ProfileUser,
  WasteCategoryOption,
} from "@/components/features/profile/types";

interface ProfileClientProps {
  user: ProfileUser;
  stats: ProfileStats;
  listings?: ProfileListing[];
  transactions: ProfileTransaction[];
  reviews: ProfileReview[];
  categories?: WasteCategoryOption[];
  buyerApplication?: BuyerApplication | null;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

type ProfileTabKey = "listings" | "transactions" | "reviews";

export function ProfileClient({
  user,
  stats,
  listings = [],
  transactions,
  reviews,
  categories = [],
  buyerApplication,
}: ProfileClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTabKey>("listings");
  const [isSwitching, setIsSwitching] = useState(false);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const isSeller = user.activeRole === "seller";

  const handleSetRole = async (targetRole: "seller" | "buyer") => {
    if (user.activeRole === targetRole) return;

    if (targetRole === "buyer" && !user.isBuyerApproved) {
      setShowBuyerModal(true);
      return;
    }

    setIsSwitching(true);
    try {
      const res = await fetch("/api/auth/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal mengganti role");
      }
    } catch {
      alert("Terjadi kesalahan pada server");
    } finally {
      setIsSwitching(false);
    }
  };

  const tabs = [
    {
      key: "listings" as const,
      label: isSeller ? "Listing Sampah Saya" : "Permintaan Pasokan",
      icon: Layers,
      count: listings.length,
    },
    {
      key: "transactions" as const,
      label: "Riwayat Transaksi COD",
      icon: ReceiptText,
      count: transactions.length,
    },
    {
      key: "reviews" as const,
      label: "Ulasan & Reputasi",
      icon: Star,
      count: reviews.length,
    },
  ];

  return (
    <TooltipProvider>
      <div
        className={cn(
          displayFont.variable,
          bodyFont.variable,
          "mx-auto max-w-6xl p-3 sm:p-6 lg:p-8"
        )}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 sm:space-y-7"
        >
          {/* 1. Header Profile Card */}
          <motion.div variants={itemVariants}>
            <ProfileHeaderCard
              user={user}
              buyerApplication={buyerApplication}
              isSwitching={isSwitching}
              onSwitchRole={handleSetRole}
              onEditProfile={() => setShowEditProfileModal(true)}
              onRegisterBuyer={() => setShowBuyerModal(true)}
            />
          </motion.div>

          {/* 2. Key Metrics Stats Overview (4 Cards) */}
          <motion.div variants={itemVariants}>
            <StatsGrid stats={stats} reviewCount={reviews.length} isSeller={isSeller} />
          </motion.div>

          {/* 3. Segmented Navigation Tabs */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-1.5 p-1.5 bg-[#FAF8F5] rounded-2xl sm:rounded-full border border-zinc-200/80 shadow-2xs overflow-x-auto scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "relative flex items-center justify-center gap-2 py-2.5 px-4 sm:px-5 rounded-xl sm:rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex-1",
                      isActive
                        ? "text-[#171717]"
                        : "text-[#78766B] hover:text-[#171717] hover:bg-white/60"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeProfileSegmentedTab"
                        className="absolute inset-0 rounded-xl sm:rounded-full bg-white shadow-xs border border-zinc-200/90"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[#6B7B4F]" : "text-[#8A8778]")} />
                      <span>{tab.label}</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "px-2 py-0.2 rounded-full text-[10px] font-bold border-none",
                          isActive
                            ? "bg-[#EFF3E7] text-[#6B7B4F]"
                            : "bg-zinc-100 text-[#78766B]"
                        )}
                      >
                        {tab.count}
                      </Badge>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 4. Tab Content Body */}
            <div className="mt-4">
              <AnimatePresence mode="wait">
                {activeTab === "listings" && (
                  <motion.div
                    key="listings"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MyListingsTab
                      initialListings={listings}
                      categories={categories}
                      isSeller={isSeller}
                    />
                  </motion.div>
                )}

                {activeTab === "transactions" && (
                  <motion.div
                    key="transactions"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TransactionHistoryCard transactions={transactions} isSeller={isSeller} />
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ReviewsCard reviews={reviews} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* Dialog Modals */}
        <EditProfileDialog
          open={showEditProfileModal}
          onOpenChange={setShowEditProfileModal}
          user={user}
        />

        <BuyerRegistrationDialog
          open={showBuyerModal}
          onOpenChange={setShowBuyerModal}
          initialAddress={user.address}
        />
      </div>
    </TooltipProvider>
  );
}