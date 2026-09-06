"use client";

import Link from "next/link";
import { ArrowLeft, Layers, Compass } from "lucide-react";
import { displayFont, bodyFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { MyListingsTab } from "@/components/features/profile/MyListingsTab";
import { MyRequestsTab } from "@/components/features/profile/MyRequestsTab";
import type {
  ProfileListing,
  ProfileWasteRequest,
  WasteCategoryOption,
} from "@/types";

interface MyListingsPageClientProps {
  initialListings: ProfileListing[];
  initialRequests?: ProfileWasteRequest[];
  categories: WasteCategoryOption[];
  isSeller: boolean;
}

export function MyListingsPageClient({
  initialListings,
  initialRequests = [],
  categories,
  isSeller,
}: MyListingsPageClientProps) {
  return (
    <div
      className={cn(
        bodyFont.variable,
        displayFont.variable,
        "font-sans",
        "mx-auto max-w-5xl space-y-6 pb-12 pt-2",
      )}
    >
      {/* Top Breadcrumb / Back Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-[#171717] hover:bg-[#F7F4EE] transition-colors shadow-2xs"
            title="Kembali ke Dashboard Profil"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#E8EEDD] text-[#6B7B4F]">
                {isSeller ? (
                  <Layers className="h-3.5 w-3.5" />
                ) : (
                  <Compass className="h-3.5 w-3.5" />
                )}
              </div>
              <h1 className="font-display text-lg font-bold text-[#171717] sm:text-xl">
                {isSeller ? "Listing Sampah Saya" : "Permintaan Pasokan Saya"}
              </h1>
            </div>
            <p className="text-xs text-[#78766B] mt-0.5">
              {isSeller
                ? "Kelola barang sampah yang Anda pasang, perbarui harga, atau tambah stok baru."
                : "Kelola kebutuhan material pasokan sampah yang sedang Anda buka untuk warga & UMKM."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Seller Listings OR Buyer Requests */}
      {isSeller ? (
        <MyListingsTab
          initialListings={initialListings}
          categories={categories}
          isSeller={isSeller}
        />
      ) : (
        <MyRequestsTab
          initialRequests={initialRequests}
          categories={categories}
        />
      )}
    </div>
  );
}
