"use client";

import Link from "next/link";
import { ArrowLeft, Star, ThumbsUp, ShieldCheck } from "lucide-react";
import { displayFont, bodyFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ReviewsCard } from "@/components/features/profile/ReviewsCard";
import type { ProfileReview, ProfileStats } from "@/types";

interface ReviewsPageClientProps {
  reviews: ProfileReview[];
  stats: ProfileStats;
  isSeller: boolean;
}

export function ReviewsPageClient({
  reviews,
  stats,
  isSeller,
}: ReviewsPageClientProps) {
  // Hitung sebaran bintang
  const starCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <div
      className={cn(
        bodyFont.variable,
        displayFont.variable,
        "font-sans",
        "mx-auto max-w-5xl space-y-6 pb-12 pt-2"
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
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              </div>
              <h1 className="font-display text-lg font-bold text-[#171717] sm:text-xl">
                Ulasan &amp; Reputasi Transaksi
              </h1>
            </div>
            <p className="text-xs text-[#78766B] mt-0.5">
              Umpan balik asli dan testimoni kepuasan dari mitra transaksi COD Anda di DaurNusa.
            </p>
          </div>
        </div>
      </div>

      {/* Rating Overview Summary Hero Card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-[32px] border border-zinc-200/80 bg-white p-6 shadow-xs">
        {/* Total Score */}
        <div className="flex flex-col items-center justify-center space-y-2 border-b sm:border-b-0 sm:border-r border-zinc-100 p-4 text-center">
          <span className="font-display text-4xl font-extrabold text-[#171717]">
            {stats.avgRating}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i <= Math.round(stats.avgRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-zinc-200"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-[#78766B]">
            Berdasarkan {reviews.length} ulasan transaksi
          </span>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="space-y-2 p-2 sm:col-span-2 flex flex-col justify-center">
          {starCounts.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-[#78766B] font-semibold flex items-center gap-1">
                {star} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="h-2 flex-1 rounded-full bg-[#F7F4EE] overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-right font-semibold text-[#171717]">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <ReviewsCard reviews={reviews} />
    </div>
  );
}
