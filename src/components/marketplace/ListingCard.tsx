"use client";

import Link from "next/link";
import { MapPin, Star, Sparkles, Scale } from "lucide-react";
import { Listing } from "@/types";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const getBadgeStyle = (catName: string) => {
    const name = catName.toLowerCase();
    if (name.includes("organik") && !name.includes("anorganik")) return "badge-organik";
    if (name.includes("anorganik")) return "badge-anorganik";
    if (name.includes("logam")) return "badge-logam";
    if (name.includes("kopi")) return "badge-kopi";
    return "bg-slate-100 text-slate-700";
  };

  const formattedPrice = listing.estimatedPrice
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(Number(listing.estimatedPrice))
    : "Harga Nego";

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Photo Container 4:3 Ratio */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={listing.photoUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Category Badge - Top Left */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-semibold border border-white/50",
              getBadgeStyle(listing.category.name)
            )}
          >
            {listing.category.name}
          </span>
        </div>

        {/* AI Confidence Tag */}
        {listing.cvConfidence && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900 text-purple-200 border border-purple-800">
              <span>AI {Number(listing.cvConfidence)}%</span>
            </span>
          </div>
        )}

        {/* Proximity Distance Tag */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{listing.distanceKm ?? 0.8} km</span>
          </span>
        </div>

        {/* Sold Overlay */}
        {listing.status === "terjual" && (
          <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center z-20">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 text-white">
              Terjual / COD Selesai
            </span>
          </div>
        )}
      </div>

      {/* Card Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Seller Info */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-2 min-w-0">
              <img
                src={
                  listing.seller.avatarUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                }
                alt={listing.seller.fullName}
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
              />
              <span className="text-xs font-medium text-slate-600 truncate">
                {listing.seller.fullName}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs font-semibold text-amber-500 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{listing.seller.rating || 4.9}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
            {listing.title}
          </h3>

          {/* Weight & Condition */}
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center space-x-1 bg-slate-100 px-2 py-0.5 rounded-md">
              <Scale className="w-3 h-3 text-slate-400" />
              <span>
                {listing.estimatedWeightKg || listing.quantity} {listing.unit || "kg"}
              </span>
            </span>
            {listing.condition && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-md truncate">
                {listing.condition}
              </span>
            )}
          </div>
        </div>

        {/* Footer Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">
              Estimasi Harga
            </span>
            <span className="text-base font-bold text-emerald-600 tracking-tight">
              {formattedPrice}
            </span>
            {listing.unit && (
              <span className="text-[11px] font-normal text-slate-400">/{listing.unit}</span>
            )}
          </div>

          <Link
            href={`/chat?sellerId=${listing.seller.id}&listingId=${listing.id}`}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            Chat Negosiasi
          </Link>
        </div>
      </div>
    </div>
  );
}
